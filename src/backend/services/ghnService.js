const axios = require("axios");
const db = require("../models");

const GHN_DEV_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2";
const TOKEN = process.env.GHN_TOKEN; // Token từ tài khoản GHN dev của bạn
const SHOP_ID = process.env.GHN_SHOP_ID; // Shop ID từ tài khoản của bạn
const FROM_DISTRICT_ID = process.env.GHN_FROM_DISTRICT_ID;
const FROM_WARD_CODE = process.env.GHN_FROM_WARD;
const FROM_ADDRESS = process.env.GHN_FROM_ADDRESS;

const ghnClient = axios.create({
    baseURL: GHN_DEV_URL,
    headers: {
        "Content-Type": "application/json",
        Token: TOKEN,
        ShopId: SHOP_ID,
    },
});

// Thêm hàm kiểm tra khu vực được hỗ trợ
const checkDistrictSupport = async (districtID) => {
    try {
        // Kiểm tra xem SHOP_DISTRICT_ID có tồn tại không
        if (!FROM_DISTRICT_ID) {
            console.error(
                "GHN_FROM_DISTRICT_ID is not defined in environment variables"
            );
            return false;
        }

        const response = await ghnClient.get(
            "/shipping-order/available-services",
            {
                params: {
                    shop_id: parseInt(SHOP_ID),
                    from_district: parseInt(FROM_DISTRICT_ID),
                    to_district: parseInt(districtID),
                },
            }
        );

        // Log response để debug
        console.log("GHN Available Services Response:", response.data);

        return response.data.data && response.data.data.length > 0;
    } catch (error) {
        console.error(
            "Error checking district support:",
            error.response?.data || error.message
        );
        return false;
    }
};

const createShippingOrder = async (order, items) => {
    try {
        // Log để debug
        console.log("Creating GHN order with params:", {
            from_district: FROM_DISTRICT_ID,
            from_ward_code: FROM_WARD_CODE,
            to_district: order.DistrictCode,
            to_ward_code: order.WardCode,
        });

        // Kiểm tra các tham số bắt buộc
        if (
            !FROM_DISTRICT_ID ||
            !FROM_WARD_CODE ||
            !order.DistrictCode ||
            !order.WardCode
        ) {
            throw new Error("Missing required shipping parameters");
        }

        // Kiểm tra khu vực được hỗ trợ
        const isSupported = await checkDistrictSupport(order.DistrictCode);
        if (!isSupported) {
            throw new Error(
                `GHN không hỗ trợ giao hàng đến khu vực: ${order.DistrictName}`
            );
        }

        // Tính tổng khối lượng đơn hàng
        const totalWeight = items.reduce((total, item) => {
            return total + item.Quantity * 200; // Mỗi sản phẩm 200g
        }, 0);

        const response = await axios.post(
            `${GHN_DEV_URL}/shipping-order/create`,
            {
                payment_type_id: 2,
                note: "Gọi điện trước khi giao hàng",
                required_note: "KHONGCHOXEMHANG",
                from_name: "Shop Phone",
                from_phone: process.env.GHN_FROM_PHONE,
                from_address: FROM_ADDRESS,
                from_ward_code: FROM_WARD_CODE,
                from_district_id: parseInt(FROM_DISTRICT_ID),
                to_name: order.ShippingInfo?.fullName || "Không có tên",
                to_phone: order.ShippingInfo?.phone || order.ShippingPhone,
                to_address: order.ShippingAddress,
                to_ward_code: order.WardCode,
                to_district_id: parseInt(order.DistrictCode),
                service_type_id: 2,
                service_id: 0,
                weight: totalWeight,
                items: items.map((item) => ({
                    name: item.productVariant?.product?.Name,
                    quantity: item.Quantity,
                    price: parseInt(item.Price),
                    weight: 200,
                })),
            },
            {
                headers: {
                    Token: TOKEN,
                    ShopId: SHOP_ID,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("GHN Error Details:", {
            message: error.message,
            response: error.response?.data,
            config: error.config,
        });
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                "GHN không hỗ trợ giao hàng đến khu vực này"
        );
    }
};

const calculateTotalWeight = (items) => {
    return items.reduce((total, item) => {
        return total + item.Quantity * 200; // Giả sử mỗi sản phẩm nặng 200g
    }, 0);
};

module.exports = {
    createShippingOrder,
    checkDistrictSupport,
};
