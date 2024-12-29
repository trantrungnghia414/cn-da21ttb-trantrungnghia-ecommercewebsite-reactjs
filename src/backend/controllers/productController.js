const db = require("../models");
const fs = require("fs/promises");
const path = require("path");
const fsSync = require("fs");

// Thêm định nghĩa uploadDir ở đầu file
const uploadDir = path.join(__dirname, "../assets/image/products");

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
                    MemorySizeID: memorySizeRecord.MemorySizeID,
                    Price: price,
                },
                { transaction }
            );

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
        res.status(201).json({
            message: "Tạo sản phẩm thành công",
            slug: product.Slug,
        });
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
    try {
        const { slug } = req.params;
        const product = await db.Product.findOne({
            where: { Slug: slug },
            include: [
                {
                    model: db.Category,
                    as: "category",
                },
                {
                    model: db.Brand,
                    as: "brand",
                },
                {
                    model: db.Supplier,
                    as: "supplier",
                },
                {
                    model: db.ProductVariant,
                    as: "variants",
                    include: [
                        {
                            model: db.MemorySize,
                            as: "memorySize",
                        },
                        {
                            model: db.ProductColor,
                            as: "colors",
                            include: [
                                {
                                    model: db.ProductImage,
                                    as: "images",
                                    attributes: [
                                        "ImageID",
                                        [
                                            db.sequelize.literal(
                                                `CONCAT('http://localhost:5000/assets/image/products/', ImageURL)`
                                            ),
                                            "ImageURL",
                                        ],
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!product) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        res.json(product);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

exports.deleteProduct = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { slug } = req.params;

        // Tìm sản phẩm theo slug
        const product = await db.Product.findOne({
            where: { Slug: slug },
            include: [
                {
                    model: db.ProductVariant,
                    as: "variants",
                    include: [
                        {
                            model: db.ProductColor,
                            as: "colors",
                            include: [
                                {
                                    model: db.ProductImage,
                                    as: "images",
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!product) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        // Lưu danh sách tên file ảnh cần xóa
        const imageFiles = [];

        // Thu thập tất cả tên file ảnh
        product.variants.forEach((variant) => {
            variant.colors.forEach((color) => {
                color.images.forEach((image) => {
                    imageFiles.push(image.ImageURL);
                });
            });
        });

        // Xóa dữ liệu theo thứ tự (từ con đến cha)
        for (const variant of product.variants) {
            for (const color of variant.colors) {
                // Xóa images của color
                await db.ProductImage.destroy({
                    where: { ColorID: color.ColorID },
                    transaction,
                });
            }
            // Xóa colors của variant
            await db.ProductColor.destroy({
                where: { VariantID: variant.VariantID },
                transaction,
            });
        }

        // Xóa variants của product
        await db.ProductVariant.destroy({
            where: { ProductID: product.ProductID },
            transaction,
        });

        // Xóa product
        await db.Product.destroy({
            where: { ProductID: product.ProductID },
            transaction,
        });

        // Xóa các file ảnh từ thư mục
        const uploadDir = path.join(__dirname, "../assets/image/products");
        for (const imageFile of imageFiles) {
            try {
                await fs.unlink(path.join(uploadDir, imageFile));
            } catch (error) {
                console.error(`Không thể xóa file ${imageFile}:`, error);
                // Tiếp tục xóa các file khác ngay cả khi một file xóa thất bại
            }
        }

        await transaction.commit();
        res.status(200).json({ message: "Đã xóa sản phẩm thành công" });
    } catch (error) {
        await transaction.rollback();
        console.error("Lỗi khi xóa sản phẩm:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { slug } = req.params;
        const variants = JSON.parse(req.body.Variants || "[]");
        const { Name, Description, CategoryID, BrandID, SupplierID } = req.body;
        const formattedFileNames = req.formattedFileNames || [];
        let fileIndex = 0;

        // Tạo slug mới từ tên mới
        const newSlug = Name.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const product = await db.Product.findOne({
            where: { Slug: slug },
            include: [
                {
                    model: db.ProductVariant,
                    as: "variants",
                    include: [
                        {
                            model: db.ProductColor,
                            as: "colors",
                            include: [{ model: db.ProductImage, as: "images" }],
                        },
                    ],
                },
            ],
            transaction,
        });

        if (!product) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        // Cập nhật thông tin cơ bản
        await product.update(
            {
                Name,
                Slug: newSlug,
                Description,
                CategoryID,
                BrandID,
                SupplierID,
            },
            { transaction }
        );

        // Lấy danh sách variant hiện tại
        const existingVariants = await db.ProductVariant.findAll({
            where: { ProductID: product.ProductID },
            include: [
                {
                    model: db.ProductColor,
                    as: "colors",
                    include: [
                        {
                            model: db.ProductImage,
                            as: "images",
                        },
                    ],
                },
            ],
            transaction,
        });

        // Lấy danh sách MemorySizeID mới từ request
        const memorySizeRecords = await db.MemorySize.findAll({
            where: {
                CategoryID: parseInt(CategoryID, 10),
            },
            transaction,
        });

        const newMemorySizeIDs = await Promise.all(
            variants.map(async (variant) => {
                const memorySizeRecord = memorySizeRecords.find(
                    (ms) => ms.MemorySize === variant.MemorySize
                );
                return memorySizeRecord ? memorySizeRecord.MemorySizeID : null;
            })
        );

        // Xóa những variant không còn trong danh sách mới
        for (const existingVariant of existingVariants) {
            if (!newMemorySizeIDs.includes(existingVariant.MemorySizeID)) {
                // Xóa ảnh và colors của variant này
                for (const color of existingVariant.colors) {
                    // Xóa file ảnh
                    for (const image of color.images) {
                        const imagePath = path.join(uploadDir, image.ImageURL);
                        try {
                            if (fsSync.existsSync(imagePath)) {
                                await fs.unlink(imagePath);
                            }
                        } catch (error) {
                            console.error(
                                `Không thể xóa file ${imagePath}:`,
                                error
                            );
                        }
                    }

                    // Xóa records ảnh
                    await db.ProductImage.destroy({
                        where: { ColorID: color.ColorID },
                        transaction,
                    });

                    // Xóa color
                    await color.destroy({ transaction });
                }

                // Xóa variant
                await existingVariant.destroy({ transaction });
            }
        }

        // Tiếp tục xử lý variants mới
        for (const variant of variants) {
            const memorySizeRecord = memorySizeRecords.find(
                (ms) => ms.MemorySize === variant.MemorySize
            );

            if (!memorySizeRecord) {
                throw new Error(
                    `Không tìm thấy dung lượng: ${variant.MemorySize}`
                );
            }

            const [productVariant] = await db.ProductVariant.findOrCreate({
                where: {
                    ProductID: product.ProductID,
                    MemorySizeID: memorySizeRecord.MemorySizeID,
                },
                defaults: {
                    Price: variant.Price,
                },
                transaction,
            });

            await productVariant.update(
                { Price: variant.Price },
                { transaction }
            );

            // Lấy danh sách màu hiện tại của variant
            const existingColors = await db.ProductColor.findAll({
                where: { VariantID: productVariant.VariantID },
                transaction,
            });

            // Lấy danh sách tên màu mới từ request
            const newColorNames = variant.colors.map(
                (color) => color.ColorName
            );

            // Xóa những màu không còn trong danh sách mới
            for (const existingColor of existingColors) {
                if (!newColorNames.includes(existingColor.ColorName)) {
                    // Xóa ảnh của màu này
                    const colorImages = await db.ProductImage.findAll({
                        where: { ColorID: existingColor.ColorID },
                        transaction,
                    });

                    // Xóa file ảnh
                    const uploadDir = path.join(
                        __dirname,
                        "../assets/image/products"
                    );
                    for (const image of colorImages) {
                        try {
                            const imagePath = path.join(
                                uploadDir,
                                image.ImageURL
                            );
                            if (fsSync.existsSync(imagePath)) {
                                await fs.unlink(imagePath);
                            }
                        } catch (error) {
                            console.error(
                                `Không thể xóa file ${imagePath}:`,
                                error
                            );
                        }
                    }

                    // Xóa records ảnh trong database
                    await db.ProductImage.destroy({
                        where: { ColorID: existingColor.ColorID },
                        transaction,
                    });

                    // Xóa màu
                    await existingColor.destroy({ transaction });
                }
            }

            // Tiếp tục xử lý thêm/cập nhật màu mới
            for (const color of variant.colors) {
                const [productColor] = await db.ProductColor.findOrCreate({
                    where: {
                        VariantID: productVariant.VariantID,
                        ColorName: color.ColorName,
                    },
                    defaults: {
                        ColorCode: color.ColorCode,
                        Stock: color.Stock,
                    },
                    transaction,
                });

                await productColor.update(
                    {
                        ColorCode: color.ColorCode,
                        Stock: color.Stock,
                    },
                    { transaction }
                );

                // Kiểm tra hasNewImages cho từng màu
                if (color.hasNewImages) {
                    // Xóa ảnh cũ nếu có
                    const oldImages = await db.ProductImage.findAll({
                        where: { ColorID: productColor.ColorID },
                        transaction,
                    });

                    const uploadDir = path.join(
                        __dirname,
                        "../assets/image/products"
                    );

                    // Xóa file ảnh cũ
                    for (const oldImage of oldImages) {
                        const imagePath = path.join(
                            uploadDir,
                            oldImage.ImageURL
                        );
                        try {
                            if (fsSync.existsSync(imagePath)) {
                                await fs.unlink(imagePath);
                            }
                        } catch (error) {
                            console.error(
                                `Không thể xóa file ${imagePath}:`,
                                error
                            );
                        }
                    }

                    // Xóa records ảnh cũ
                    await db.ProductImage.destroy({
                        where: { ColorID: productColor.ColorID },
                        transaction,
                    });

                    // Thêm ảnh mới cho màu này
                    const numberOfImages = color.newImagesCount || 0;
                    for (let i = 0; i < numberOfImages; i++) {
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
        res.status(200).json({
            message: "Cập nhật sản phẩm thành công",
            slug: newSlug,
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        res.status(500).json({ error: error.message });
    }
};
