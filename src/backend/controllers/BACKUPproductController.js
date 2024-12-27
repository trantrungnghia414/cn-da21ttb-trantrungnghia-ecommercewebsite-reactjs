const db = require("../models");

exports.createProduct = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const {
            Name,
            Slug,
            Description,
            CategoryID,
            BrandID,
            SupplierID,
            Variants,
        } = req.body;

        console.log(
            "Dữ liệu nhận được từ frontend:",
            JSON.stringify(req.body, null, 2)
        );

        const categoryID = parseInt(CategoryID, 10);
        const brandID = parseInt(BrandID, 10);
        const supplierID = parseInt(SupplierID, 10);

        // Tạo sản phẩm mới
        const product = await db.Product.create(
            {
                Name,
                Slug,
                Description,
                CategoryID: categoryID,
                BrandID: brandID,
                SupplierID: supplierID,
            },
            { transaction }
        );

        // Kiểm tra sự tồn tại của ProductID
        if (!product || !product.ProductID) {
            throw new Error("Không thể tạo sản phẩm, ProductID không tồn tại.");
        }

        for (const variant of Variants) {
            const memorySize = variant.MemorySize.trim();
            const price = parseFloat(variant.Price);

            // Kiểm tra tính hợp lệ của MemorySize và Price
            if (!memorySize || isNaN(price)) {
                throw new Error(
                    "MemorySize không hợp lệ hoặc Price không phải là số"
                );
            }

            // Tìm MemorySizeID từ bảng memorysizes
            const memorySizeRecord = await db.MemorySize.findOne({
                where: { MemorySize: memorySize, CategoryID: categoryID },
            });

            if (!memorySizeRecord) {
                throw new Error(`Không tìm thấy MemorySize: ${memorySize}`);
            }

            const productVariant = await db.ProductVariant.create(
                {
                    ProductID: product.ProductID,
                    MemorySizeID: memorySizeRecord.MemorySizeID, // Sử dụng MemorySizeID
                    Price: price,
                },
                { transaction }
            );

            console.log("VariantID:", productVariant.VariantID);

            if (!productVariant || !productVariant.VariantID) {
                throw new Error(
                    "Không thể tạo biến thể, VariantID không tồn tại."
                );
            }

            if (variant.colors && variant.colors.length > 0) {
                for (const color of variant.colors) {
                    const colorName = color.ColorName.trim();
                    const colorCode = color.ColorCode.trim();
                    const stock = parseInt(color.Stock, 10);

                    if (!colorName || !colorCode || isNaN(stock)) {
                        throw new Error(
                            "ColorName, ColorCode hoặc Stock không hợp lệ"
                        );
                    }

                    const productColor = await db.ProductColor.create(
                        {
                            VariantID: productVariant.VariantID,
                            ColorName: colorName,
                            ColorCode: colorCode,
                            Stock: stock,
                        },
                        { transaction }
                    );

                    if (color.Images && color.Images.length > 0) {
                        for (const image of color.Images) {
                            if (image.ImageURL) {
                                await db.ProductImage.create(
                                    {
                                        ColorID: productColor.ColorID,
                                        ImageURL: image.ImageURL,
                                    },
                                    { transaction }
                                );
                            } else {
                                console.warn(
                                    "Không có URL ảnh cho màu:",
                                    colorName
                                );
                            }
                        }
                    }
                }
            }
        }

        await transaction.commit();
        res.status(201).json(product);
    } catch (error) {
        await transaction.rollback();
        console.error("Lỗi khi tạo sản phẩm:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await db.Product.findAll({
            include: [
                {
                    model: db.Category,
                    as: "category",
                    attributes: ["Name", "Slug"],
                },
                {
                    model: db.Brand,
                    as: "brand",
                    attributes: ["Name", "Slug"],
                },
                {
                    model: db.ProductVariant,
                    as: "variants",
                    include: [
                        {
                            model: db.ProductColor,
                            as: "colors",
                            attributes: ["ColorName", "ColorCode", "Stock"],
                        },
                    ],
                },
            ],
        });

        res.status(200).json(products);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        res.status(500).json({ error: error.message });
    }
};
