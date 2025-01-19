const db = require("../models");

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
    try {
        const cart = await db.Cart.findAll({
            where: {
                UserID: req.user.id,
                Status: "active",
            },
            include: [
                {
                    model: db.ProductVariant,
                    as: "productVariant",
                    include: [
                        {
                            model: db.Product,
                            as: "product",
                            attributes: [
                                "ProductID",
                                "Name",
                                "Thumbnail",
                                "Slug",
                            ],
                        },
                        {
                            model: db.MemorySize,
                            as: "memorySize",
                        },
                    ],
                },
                {
                    model: db.ProductColor,
                    as: "productColor",
                    attributes: ["ColorID", "ColorName", "ColorCode", "Stock"],
                },
            ],
            order: [["CreatedAt", "DESC"]],
        });

        // Thêm tiền tố cho thumbnail
        const cartWithImagePrefix = cart.map(item => {
            if (item.productVariant.product.Thumbnail) {
                item.productVariant.product.Thumbnail = 
                    `http://localhost:5000/assets/image/products/${item.productVariant.product.Thumbnail}`;
            }
            return item;
        });

        res.json(cartWithImagePrefix);
    } catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).json({ error: error.message });
    }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    try {
        const { variantId, colorId, quantity = 1 } = req.body;

        // Kiểm tra tồn kho
        const productColor = await db.ProductColor.findOne({
            where: { ColorID: colorId },
        });

        if (!productColor) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        if (productColor.Stock < quantity) {
            return res.status(400).json({
                message: "Số lượng vượt quá tồn kho",
                availableStock: productColor.Stock,
            });
        }

        // Lấy giá hiện tại của variant
        const variant = await db.ProductVariant.findByPk(variantId);
        if (!variant) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy biến thể sản phẩm" });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        let cartItem = await db.Cart.findOne({
            where: {
                UserID: req.user.id,
                VariantID: variantId,
                ColorID: colorId,
                Status: "active",
            },
        });

        if (cartItem) {
            // Kiểm tra tổng số lượng sau khi cập nhật
            const newQuantity = cartItem.Quantity + quantity;
            if (newQuantity > productColor.Stock) {
                return res.status(400).json({
                    message: "Tổng số lượng vượt quá tồn kho",
                    availableStock: productColor.Stock,
                });
            }

            // Nếu đã có thì cập nhật số lượng và giá mới nhất
            cartItem.Quantity = newQuantity;
            cartItem.Price = variant.Price; // Cập nhật giá mới nhất
            await cartItem.save();
        } else {
            // Nếu chưa có thì tạo mới
            cartItem = await db.Cart.create({
                UserID: req.user.id,
                VariantID: variantId,
                ColorID: colorId,
                Quantity: quantity,
                Price: variant.Price,
                Status: "active",
            });
        }

        res.status(201).json(cartItem);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { quantity, status } = req.body;

        const cartItem = await db.Cart.findOne({
            where: {
                CartID: cartId,
                UserID: req.user.id,
            },
        });

        if (!cartItem) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
        }

        // Nếu cập nhật số lượng
        if (quantity !== undefined) {
            // Kiểm tra tồn kho
            const productColor = await db.ProductColor.findOne({
                where: { ColorID: cartItem.ColorID },
            });

            if (productColor.Stock < quantity) {
                return res.status(400).json({
                    message: "Số lượng vượt quá tồn kho",
                    availableStock: productColor.Stock,
                });
            }

            cartItem.Quantity = quantity;
        }

        // Nếu cập nhật trạng thái
        if (status !== undefined) {
            cartItem.Status = status;
        }

        await cartItem.save();
        res.json(cartItem);
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ error: error.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
    try {
        const { cartId } = req.params;

        const result = await db.Cart.destroy({
            where: {
                CartID: cartId,
                UserID: req.user.id,
            },
        });

        if (!result) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
        }

        res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ error: error.message });
    }
};
