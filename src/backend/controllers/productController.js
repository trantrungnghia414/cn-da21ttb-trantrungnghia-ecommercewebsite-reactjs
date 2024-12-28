const db = require("../models");
const supplier = require("../models/supplier");

exports.createProduct = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Parse JSON string back to object
        const variants = JSON.parse(req.body.Variants || "[]");

        const { Name, Slug, Description, CategoryID, BrandID, SupplierID } =
            req.body;

        // Kiểm tra các tệp ảnh đã được tải lên
        const uploadedFiles = req.files;
        const formattedFileNames = req.formattedFileNames || []; // Lấy tên file đã được format từ multer

        console.log("Uploaded files:", uploadedFiles); // Debug log
        console.log("Formatted file names:", formattedFileNames); // Debug log

        if (!uploadedFiles || uploadedFiles.length === 0) {
            throw new Error("Không có ảnh nào được tải lên.");
        }

        // Tạo sản phẩm mới
        const product = await db.Product.create(
            {
                Name,
                Slug,
                Description,
                CategoryID: parseInt(CategoryID, 10),
                BrandID: parseInt(BrandID, 10),
                SupplierID: parseInt(SupplierID, 10),
            },
            { transaction }
        );

        let fileIndex = 0;

        // Xử lý variants và files
        for (const variant of variants) {
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
                where: {
                    MemorySize: memorySize,
                    CategoryID: parseInt(CategoryID, 10),
                },
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
                    const productColor = await db.ProductColor.create(
                        {
                            VariantID: productVariant.VariantID,
                            ColorName: color.ColorName,
                            ColorCode: color.ColorCode,
                            Stock: color.Stock,
                        },
                        { transaction }
                    );

                    // Sử dụng tên file đã được format từ multer
                    for (const image of color.Images) {
                        if (fileIndex < formattedFileNames.length) {
                            await db.ProductImage.create(
                                {
                                    ColorID: productColor.ColorID,
                                    ImageURL: formattedFileNames[fileIndex],
                                },
                                { transaction }
                            );
                            fileIndex++;
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
                    model: db.Supplier,
                    as: "supplier",
                    attributes: ["Name"],
                },
                {
                    model: db.ProductVariant,
                    as: "variants",
                    include: [
                        {
                            model: db.ProductColor,
                            as: "colors",
                            attributes: ["ColorName", "ColorCode", "Stock"],
                            include: [
                                {
                                    model: db.ProductImage,
                                    as: "images",
                                    attributes: ["ImageURL"],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        // Thêm tiền tố vào tên ảnh
        const productsWithImagePrefix = products.map((product) => {
            product.variants.forEach((variant) => {
                variant.colors.forEach((color) => {
                    color.images.forEach((image) => {
                        image.ImageURL = `http://localhost:5000/assets/image/products/${image.ImageURL}`;
                    });
                });
            });
            return product;
        });

        res.status(200).json(productsWithImagePrefix);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProduct = async (req, res) => {
    const { slug } = req.params; // Lấy slug từ tham số

    try {
        const product = await db.Product.findOne({
            where: { Slug: slug },
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
                    model: db.Supplier,
                    as: "supplier",
                    attributes: ["Name"],
                },
                {
                    model: db.ProductVariant,
                    as: "variants",
                    include: [
                        {
                            model: db.ProductColor,
                            as: "colors",
                            attributes: ["ColorName", "ColorCode", "Stock"],
                            include: [
                                {
                                    model: db.ProductImage,
                                    as: "images",
                                    attributes: ["ImageURL"],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!product) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại." });
        }

        // Thêm tiền tố vào tên ảnh
        product.variants.forEach((variant) => {
            variant.colors.forEach((color) => {
                color.images.forEach((image) => {
                    image.ImageURL = `http://localhost:5000/assets/image/products/${image.ImageURL}`;
                });
            });
        });

        res.status(200).json(product); // Trả về thông tin sản phẩm
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { slug } = req.params;

    const transaction = await db.sequelize.transaction();
    try {
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await db.Product.findOne({ where: { Slug: slug } });
        if (!product) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại." });
        }

        // Xóa tất cả hình ảnh liên quan đến sản phẩm
        await db.ProductImage.destroy({
            where: { ColorID: db.sequelize.col("ProductColor.ColorID") },
            include: [
                {
                    model: db.ProductColor,
                    as: "colors",
                    where: { ProductID: product.ProductID },
                },
            ],
            transaction,
        });

        // Xóa tất cả màu sắc liên quan đến sản phẩm
        await db.ProductColor.destroy({
            where: { VariantID: db.sequelize.col("ProductVariant.VariantID") },
            include: [
                {
                    model: db.ProductVariant,
                    as: "variants",
                    where: { ProductID: product.ProductID },
                },
            ],
            transaction,
        });

        // Xóa tất cả biến thể liên quan đến sản phẩm
        await db.ProductVariant.destroy({
            where: { ProductID: product.ProductID },
            transaction,
        });

        // Cuối cùng, xóa sản phẩm
        await db.Product.destroy({
            where: { Slug: slug },
            transaction,
        });

        await transaction.commit();
        res.status(204).send();
    } catch (error) {
        await transaction.rollback();
        console.error("Lỗi khi xóa sản phẩm:", error);
        res.status(500).json({ error: error.message });
    }
};
