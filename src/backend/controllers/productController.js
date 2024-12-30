const db = require("../models");
const fs = require("fs/promises");
const path = require("path");
const fsSync = require("fs");

// Thêm định nghĩa uploadDir ở đầu file
const uploadDir = path.join(__dirname, "../assets/image/products");

exports.createProduct = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { Name, Slug, Description, CategoryID, BrandID, SupplierID } =
            req.body;
        const variants = JSON.parse(req.body.Variants || "[]");

        // Kiểm tra files đã upload
        const thumbnailFile = req.files.thumbnail?.[0];
        const productImages = req.files.productImages || [];

        // Lấy tên file đã format
        const formattedFileNames = req.formattedFileNames || [];
        const thumbnailFileName = thumbnailFile ? formattedFileNames[0] : null;
        // Lấy tên file cho ảnh sản phẩm (bỏ qua file thumbnail)
        const productImageFileNames = formattedFileNames.slice(1);

        // Tạo sản phẩm với thumbnail
        const product = await db.Product.create(
            {
                Name,
                Slug,
                Description,
                CategoryID: parseInt(CategoryID),
                BrandID: parseInt(BrandID),
                SupplierID: parseInt(SupplierID),
                Thumbnail: thumbnailFileName,
            },
            { transaction }
        );

        // Lấy danh sách MemorySize từ database
        const memorySizes = await db.MemorySize.findAll({
            transaction,
        });

        let fileIndex = 0;
        // Xử lý variants và images
        for (const variant of variants) {
            // Tìm MemorySizeID tương ứng
            const memorySize = memorySizes.find(
                (ms) => ms.MemorySize === variant.MemorySize
            );
            if (!memorySize) {
                throw new Error(
                    `Không tìm thấy dung lượng bộ nhớ: ${variant.MemorySize}`
                );
            }

            const productVariant = await db.ProductVariant.create(
                {
                    ProductID: product.ProductID,
                    MemorySizeID: memorySize.MemorySizeID, // Sử dụng ID thay vì giá trị string
                    Price: variant.Price,
                },
                { transaction }
            );

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

                // Tạo records cho ảnh sản phẩm
                const numberOfImages = color.newImagesCount || 0;
                for (let i = 0; i < numberOfImages; i++) {
                    if (fileIndex < productImageFileNames.length) {
                        await db.ProductImage.create(
                            {
                                ColorID: productColor.ColorID,
                                ImageURL: productImageFileNames[fileIndex],
                            },
                            { transaction }
                        );
                        fileIndex++;
                    }
                }
            }
        }

        await transaction.commit();
        res.status(201).json({
            message: "Tạo sản phẩm thành công",
            slug: Slug,
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

        // Thêm tiền tố vào tên ảnh và thumbnail
        const productsWithImagePrefix = products.map((product) => {
            // Thêm tiền tố cho thumbnail
            if (product.Thumbnail) {
                product.Thumbnail = `http://localhost:5000/assets/image/products/${product.Thumbnail}`;
            }

            // Thêm tiền tố cho ảnh sản phẩm
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

        // Thêm tiền tố cho thumbnail
        if (product.Thumbnail) {
            product.Thumbnail = `http://localhost:5000/assets/image/products/${product.Thumbnail}`;
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

        // Thu thập tất cả tên file ảnh và thumbnail
        if (product.Thumbnail) {
            imageFiles.push(product.Thumbnail);
        }

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

        // Tạo slug mới từ tên sản phẩm
        const newSlug = Name.toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        // Kiểm tra có thumbnail mới không
        const thumbnailFile = req.files?.thumbnail?.[0];
        let thumbnailFileName = null;

        // Tìm sản phẩm hiện tại
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
        });

        if (!product) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        // Chỉ xử lý thumbnail nếu có file mới
        if (thumbnailFile) {
            // Xóa thumbnail cũ nếu có
            if (product.Thumbnail) {
                const oldThumbnailPath = path.join(
                    __dirname,
                    "../assets/image/products",
                    product.Thumbnail
                );
                try {
                    if (fsSync.existsSync(oldThumbnailPath)) {
                        await fs.unlink(oldThumbnailPath);
                    }
                } catch (error) {
                    console.error("Lỗi khi xóa thumbnail cũ:", error);
                }
            }
            thumbnailFileName = thumbnailFile.filename;
        }

        // Cập nhật thông tin sản phẩm
        await product.update(
            {
                Name,
                Slug: newSlug,
                Description,
                CategoryID: parseInt(CategoryID),
                BrandID: parseInt(BrandID),
                SupplierID: parseInt(SupplierID),
                Thumbnail: thumbnailFileName || product.Thumbnail, // Giữ thumbnail cũ nếu không có file mới
            },
            { transaction }
        );

        // Xử lý ảnh sản phẩm - Tổ chức lại theo màu
        const productImages = req.files?.images || [];
        let currentImageIndex = 0;
        const imagesByColor = new Map(); // Lưu trữ ảnh theo màu

        // Phân loại ảnh theo màu dựa vào thứ tự trong variants
        for (const variant of variants) {
            for (const color of variant.colors) {
                if (color.hasNewImages) {
                    const numberOfImages = color.newImagesCount || 0;
                    const imagesForThisColor = [];

                    for (let i = 0; i < numberOfImages; i++) {
                        if (currentImageIndex < productImages.length) {
                            imagesForThisColor.push(
                                productImages[currentImageIndex].filename
                            );
                            currentImageIndex++;
                        }
                    }

                    imagesByColor.set(
                        `${variant.MemorySize}-${color.ColorName}`,
                        imagesForThisColor
                    );
                }
            }
        }

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
        for (const existingVariant of product.variants) {
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
                    // Xóa ảnh cũ
                    const oldImages = await db.ProductImage.findAll({
                        where: { ColorID: productColor.ColorID },
                        transaction,
                    });

                    // Xóa file ảnh cũ
                    for (const oldImage of oldImages) {
                        const imagePath = path.join(
                            __dirname,
                            "../assets/image/products",
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

                    // Lấy ảnh mới cho màu này
                    const colorKey = `${variant.MemorySize}-${color.ColorName}`;
                    const newImages = imagesByColor.get(colorKey) || [];

                    // Thêm ảnh mới
                    for (const imageFileName of newImages) {
                        await db.ProductImage.create(
                            {
                                ColorID: productColor.ColorID,
                                ImageURL: imageFileName,
                            },
                            { transaction }
                        );
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
