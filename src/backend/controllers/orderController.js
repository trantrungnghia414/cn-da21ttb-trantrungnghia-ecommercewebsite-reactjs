const {
    Order,
    OrderDetail,
    Cart,
    ProductVariant,
    ProductColor,
} = require("../models");
const db = require("../models");
const moment = require("moment");
const { createShippingOrder } = require("../services/ghnService");

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { UserID: req.user.id },
            include: [
                {
                    model: OrderDetail,
                    include: [
                        {
                            model: ProductVariant,
                            include: [
                                {
                                    model: db.Product,
                                    as: "product",
                                },
                                {
                                    model: db.MemorySize,
                                    as: "memorySize",
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [["CreatedAt", "DESC"]],
        });
        res.json(orders);
    } catch (error) {
        console.error("Error getting orders:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: OrderDetail,
                    include: [
                        {
                            model: ProductVariant,
                            include: ["product", "memorySize"],
                        },
                    ],
                },
            ],
        });

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json(order);
    } catch (error) {
        console.error("Error getting order:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { UserID: req.params.userId },
            include: [
                {
                    model: OrderDetail,
                    include: [
                        {
                            model: ProductVariant,
                            include: ["product", "memorySize"],
                        },
                    ],
                },
            ],
            order: [["OrderDate", "DESC"]],
        });
        res.json(orders);
    } catch (error) {
        console.error("Error getting user orders:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.createOrder = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        const { items, shippingInfo, paymentMethod, shippingFee, total } =
            req.body;

        // Tạo order
        const order = await Order.create(
            {
                UserID: req.user.id,
                OrderDate: new Date(),
                TotalAmount: total,
                ShippingFee: shippingFee,
                ShippingAddress: `${shippingInfo.address}, ${shippingInfo.wardName}, ${shippingInfo.districtName}, ${shippingInfo.provinceName}`,
                ShippingPhone: shippingInfo.phone,
                PaymentMethod: paymentMethod,
                PaymentStatus:
                    paymentMethod === "cod" ? "Pending" : "Processing",
                OrderStatus: "Pending",
                ProvinceCode: shippingInfo.provinceCode,
                DistrictCode: shippingInfo.districtCode,
                WardCode: shippingInfo.wardCode,
                ProvinceName: shippingInfo.provinceName,
                DistrictName: shippingInfo.districtName,
                WardName: shippingInfo.wardName,
                ShippingInfo: shippingInfo,
            },
            { transaction: t }
        );

        // Tạo order details và xử lý inventory
        const orderDetails = [];
        for (const item of items) {
            const detail = await OrderDetail.create(
                {
                    OrderID: order.OrderID,
                    VariantID: item.VariantID,
                    ColorID: item.ColorID,
                    Quantity: item.Quantity,
                    Price: item.Price,
                },
                { transaction: t }
            );
            orderDetails.push(detail);

            await ProductColor.update(
                { Stock: db.sequelize.literal(`Stock - ${item.Quantity}`) },
                {
                    where: { VariantID: item.VariantID, ColorID: item.ColorID },
                    transaction: t,
                }
            );

            await Cart.destroy({
                where: { CartID: item.CartID },
                transaction: t,
            });
        }

        // Tạo đơn hàng trên GHN
        try {
            const enrichedOrder = {
                ...order.toJSON(),
                ShippingInfo: shippingInfo,
                OrderDetails: orderDetails,
            };

            const ghnOrder = await createShippingOrder(enrichedOrder, items);

            await order.update(
                {
                    ShippingCode: ghnOrder.data.order_code,
                    ExpectedDeliveryTime: ghnOrder.data.expected_delivery_time,
                    ShippingFee: ghnOrder.data.total_fee,
                },
                { transaction: t }
            );
        } catch (ghnError) {
            console.error("GHN Order Creation Failed:", ghnError);
            await t.rollback();
            throw new Error(
                "Không thể tạo đơn hàng trên GHN: " + ghnError.message
            );
        }

        // Commit transaction trước khi xử lý VNPay
        await t.commit();

        // Xử lý thanh toán VNPay nếu cần
        if (paymentMethod === "vnpay") {
            // Tạo URL thanh toán VNPay

            process.env.TZ = "Asia/Ho_Chi_Minh";

            let date = new Date();
            let createDate = moment(date).format("YYYYMMDDHHmmss");

            let ipAddr =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let tmnCode = "KVRQR37P";
            let secretKey = "4N3E01VG15W3SGL37ZC18GVRNDP77B1X";
            let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            let returnUrl = "http://localhost:5000/api/payments/return_payment";
            let orderId = order.OrderID;
            let amount = total;
            let bankCode = "";

            let locale = "vn";

            let currCode = "VND";
            let vnp_Params = {};
            vnp_Params["vnp_Version"] = "2.1.0";
            vnp_Params["vnp_Command"] = "pay";
            vnp_Params["vnp_TmnCode"] = tmnCode;
            vnp_Params["vnp_Locale"] = locale;
            vnp_Params["vnp_CurrCode"] = currCode;
            vnp_Params["vnp_TxnRef"] = orderId;
            vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
            vnp_Params["vnp_OrderType"] = "other";
            vnp_Params["vnp_Amount"] = amount * 100;
            vnp_Params["vnp_ReturnUrl"] = returnUrl;
            vnp_Params["vnp_IpAddr"] = ipAddr;
            vnp_Params["vnp_CreateDate"] = createDate;
            if (bankCode !== null && bankCode !== "") {
                vnp_Params["vnp_BankCode"] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let querystring = require("qs");
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac
                .update(new Buffer(signData, "utf-8"))
                .digest("hex");
            vnp_Params["vnp_SecureHash"] = signed;
            vnpUrl +=
                "?" + querystring.stringify(vnp_Params, { encode: false });

            res.json({
                success: true,
                orderId: order.OrderID,
                paymentUrl: vnpUrl,
            });
        } else {
            res.json({
                success: true,
                orderId: order.OrderID,
            });
        }
    } catch (error) {
        // Chỉ rollback nếu transaction chưa được commit
        if (!t.finished) {
            await t.rollback();
        }
        console.error("Order Creation Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Có lỗi xảy ra khi tạo đơn hàng",
        });
    }
};

exports.returnPayment = async (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = sortObject(vnp_Params);
    let tmnCode = "KVRQR37P";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    let secretKey = "4N3E01VG15W3SGL37ZC18GVRNDP77B1X";
    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    if (secureHash === signed) {
        const orderId = vnp_Params["vnp_TxnRef"];

        // xu ly cap nhat da thanh toan vo database
        await Order.update(
            { PaymentStatus: "Completed" },
            { where: { OrderID: orderId } }
        );

        // luu

        res.redirect(`http://localhost:3000/order-success/${orderId}`);
    } else {
        // thanh toan that bai
        res.redirect("http://localhost:3000/order-failed");
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Kiểm tra đơn hàng tồn tại
        const order = await db.Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng",
            });
        }

        // Kiểm tra trạng thái hợp lệ
        const validStatuses = [
            "Pending",
            "Processing",
            "Shipping",
            "Delivered",
            "Cancelled",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Trạng thái không hợp lệ",
            });
        }

        // Cập nhật trạng thái
        await order.update({ OrderStatus: status });

        // Nếu trạng thái là Delivered, cập nhật PaymentStatus thành Completed với đơn COD
        if (status === "Delivered" && order.PaymentMethod === "cod") {
            await order.update({ PaymentStatus: "Completed" });
        }

        // Nếu trạng thái là Cancelled, cập nhật PaymentStatus
        if (status === "Cancelled") {
            await order.update({ PaymentStatus: "Failed" });
        }

        res.json({
            message: "Cập nhật trạng thái đơn hàng thành công",
            order,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            message: "Lỗi khi cập nhật trạng thái đơn hàng",
        });
    }
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            "+"
        );
    }
    return sorted;
}
