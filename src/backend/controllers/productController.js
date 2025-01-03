const db = require("../models");
const fs = require("fs/promises");
const path = require("path");
const fsSync = require("fs");
const { saveFiles, deleteFiles } = require("../middlewares/multer");

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

        // Kiểm tra xem slug đã tồn tại chưa
        const existingProduct = await db.Product.findOne({
            where: { Slug },
            transaction,
        });

        if (existingProduct) {
            throw new Error("Sản phẩm với tên này đã tồn tại");
        }

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

        // Kiểm tra trùng màu trong cùng dung lượng
        for (const variant of variants) {
            const memorySize = memorySizes.find(
                (ms) => ms.MemorySize === variant.MemorySize
            );

            if (!memorySize) {
                throw new Error(
                    `Không tìm thấy dung lượng bộ nhớ: ${variant.MemorySize}`
                );
            }

            // Kiểm tra trùng tên màu và mã màu trong cùng dung lượng
            const colorNames = new Set();
            const colorCodes = new Set();

            for (const color of variant.colors) {
                if (colorNames.has(color.ColorName.toLowerCase())) {
                    throw new Error(
                        `Tên màu "${color.ColorName}" đã tồn tại trong dung lượng ${variant.MemorySize}`
                    );
                }
                if (colorCodes.has(color.ColorCode.toLowerCase())) {
                    throw new Error(
                        `Mã màu "${color.ColorCode}" đã tồn tại trong dung lượng ${variant.MemorySize}`
                    );
                }
                colorNames.add(color.ColorName.toLowerCase());
                colorCodes.add(color.ColorCode.toLowerCase());
            }
        }

        let fileIndex = 0;
        // Xử lý variants và images
        for (const variant of variants) {
            const memorySize = memorySizes.find(
                (ms) => ms.MemorySize === variant.MemorySize
            );

            // Tạo variant
            const productVariant = await db.ProductVariant.create(
                {
                    ProductID: product.ProductID,
                    MemorySizeID: memorySize.MemorySizeID,
                    Price: variant.Price,
                },
                { transaction }
            );

            // Xử lý colors và images cho variant
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

        // Lưu các file vào thư mục sau khi tất cả các thao tác DB thành công
        await saveFiles(req.fileBuffers);

        await transaction.commit();
        res.status(201).json({
            message: "Tạo sản phẩm thành công",
            productId: product.ProductID,
        });
    } catch (error) {
        await transaction.rollback();

        // Xóa các file đã lưu (nếu có) khi rollback
        if (req.formattedFileNames?.length > 0) {
            await deleteFiles(req.formattedFileNames);
        }

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
        const colorKeys = JSON.parse(req.body.colorKeys || "[]");

        // Xử lý files từ multer
        const productImages = req.files?.productImages || [];
        const imagesByColor = new Map();

        // Map ảnh với màu tương ứng
        if (productImages.length > 0 && colorKeys.length > 0) {
            productImages.forEach((file, index) => {
                const colorKey = colorKeys[index];
                if (!imagesByColor.has(colorKey)) {
                    imagesByColor.set(colorKey, []);
                }
                imagesByColor.get(colorKey).push(file);
            });
        }

        // Tạo slug mới từ tên sản phẩm
        const newSlug = req.body.Name.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

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

        // Xử lý thumbnail
        let thumbnailFileName = product.Thumbnail; // Giữ nguyên thumbnail cũ

        if (req.body.hasNewThumbnail === "true") {
            const uploadDir = path.join(__dirname, "../assets/image/products");

            // Đảm bảo thư mục tồn tại
            if (!fsSync.existsSync(uploadDir)) {
                fsSync.mkdirSync(uploadDir, { recursive: true });
            }

            // Nếu có thumbnail cũ và yêu cầu cập nhật mới, xóa thumbnail cũ
            if (product.Thumbnail) {
                const oldThumbnailPath = path.join(
                    uploadDir,
                    product.Thumbnail
                );
                try {
                    if (fsSync.existsSync(oldThumbnailPath)) {
                        await fs.unlink(oldThumbnailPath);
                        console.log("Đã xóa thumbnail cũ:", oldThumbnailPath);
                    }
                } catch (error) {
                    console.error("Lỗi khi xóa thumbnail cũ:", error);
                }
            }

            // Nếu có file thumbnail mới được upload
            if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
                const thumbnailFile = req.files.thumbnail[0];
                thumbnailFileName = `${Date.now()}-${
                    thumbnailFile.originalname
                }`;

                try {
                    // Lưu file thumbnail mới
                    await fs.writeFile(
                        path.join(uploadDir, thumbnailFileName),
                        thumbnailFile.buffer
                    );
                    console.log("Đã lưu thumbnail mới:", thumbnailFileName);
                } catch (error) {
                    console.error("Lỗi khi lưu thumbnail mới:", error);
                    throw new Error(
                        "Không thể lưu thumbnail mới: " + error.message
                    );
                }
            } else {
                // Nếu yêu cầu cập nhật nhưng không có file mới (trường hợp xóa thumbnail)
                thumbnailFileName = null;
            }
        }

        // Cập nhật thông tin sản phẩm với thumbnail
        await product.update(
            {
                Name: req.body.Name,
                Slug: newSlug,
                Description: req.body.Description,
                CategoryID: parseInt(req.body.CategoryID),
                BrandID: parseInt(req.body.BrandID),
                SupplierID: parseInt(req.body.SupplierID),
                Thumbnail: thumbnailFileName,
            },
            { transaction }
        );

        // Lấy danh sách MemorySizeID mới từ request
        const memorySizeRecords = await db.MemorySize.findAll({
            where: {
                CategoryID: parseInt(req.body.CategoryID, 10),
            },
            transaction,
        });

        // Map variants hiện tại để dễ truy cập
        const existingVariantsMap = new Map(
            product.variants.map((variant) => [variant.MemorySizeID, variant])
        );

        // Xử lý thay đổi dung lượng
        const memorySizeChanges = req.body.memorySizeChanges
            ? JSON.parse(req.body.memorySizeChanges)
            : {};

        // Xử lý từng variant
        for (const variant of variants) {
            const memorySizeRecord = memorySizeRecords.find(
                (ms) => ms.MemorySize === variant.MemorySize
            );

            if (!memorySizeRecord) {
                throw new Error(
                    `Không tìm thấy dung lượng: ${variant.MemorySize}`
                );
            }

            // Kiểm tra xem variant này có phải là variant đã thay đổi dung lượng không
            const variantChange = memorySizeChanges[variant.VariantID];

            if (variantChange && variant.VariantID) {
                // Tìm variant hiện tại
                const existingVariant = await db.ProductVariant.findOne({
                    where: { VariantID: variant.VariantID },
                    transaction,
                });

                if (existingVariant) {
                    // Cập nhật variant với dung lượng mới
                    await existingVariant.update(
                        {
                            MemorySizeID: memorySizeRecord.MemorySizeID,
                            Price: variant.Price,
                        },
                        { transaction }
                    );

                    // Không cần tạo variant mới vì chỉ cập nhật dung lượng
                    continue;
                }
            }

            // Xử lý các trường hợp khác như bình thường
            const existingVariant = existingVariantsMap.get(
                memorySizeRecord.MemorySizeID
            );

            if (existingVariant) {
                // Cập nhật thông tin variant hiện tại
                await existingVariant.update(
                    { Price: variant.Price },
                    { transaction }
                );

                // Map colors hiện tại của variant này
                const existingColorsMap = new Map(
                    existingVariant.colors.map((color) => [
                        color.ColorName,
                        color,
                    ])
                );

                // Xử lý từng màu trong variant
                for (const color of variant.colors) {
                    const existingColor = existingColorsMap.get(
                        color.ColorName
                    );

                    if (existingColor) {
                        // Cập nhật thông tin màu hiện tại
                        await existingColor.update(
                            {
                                ColorCode: color.ColorCode,
                                Stock: color.Stock,
                            },
                            { transaction }
                        );

                        // Chỉ xử lý ảnh nếu có ảnh mới
                        if (color.hasNewImages === "true") {
                            const colorKey = `${variant.MemorySize}-${color.ColorName}`;
                            const newImages = imagesByColor.get(colorKey) || [];

                            if (newImages.length > 0) {
                                // Xóa ảnh cũ
                                const oldImages = await db.ProductImage.findAll(
                                    {
                                        where: {
                                            ColorID: existingColor.ColorID,
                                        },
                                        transaction,
                                    }
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
                                    where: { ColorID: existingColor.ColorID },
                                    transaction,
                                });

                                // Lưu ảnh mới
                                for (const file of newImages) {
                                    const fileName = `${Date.now()}-${Math.random()
                                        .toString(36)
                                        .substring(7)}${path.extname(
                                        file.originalname
                                    )}`;

                                    try {
                                        // Lưu file vào thư mục
                                        await fs.writeFile(
                                            path.join(uploadDir, fileName),
                                            file.buffer
                                        );

                                        // Tạo record trong database
                                        await db.ProductImage.create(
                                            {
                                                ColorID: existingColor.ColorID,
                                                ImageURL: fileName,
                                            },
                                            { transaction }
                                        );
                                    } catch (error) {
                                        throw new Error(
                                            "Không thể lưu ảnh: " +
                                                error.message
                                        );
                                    }
                                }
                            }
                        }
                    } else {
                        // Tạo màu mới nếu chưa tồn tại
                        const newColor = await db.ProductColor.create(
                            {
                                VariantID: existingVariant.VariantID,
                                ColorName: color.ColorName,
                                ColorCode: color.ColorCode,
                                Stock: color.Stock,
                            },
                            { transaction }
                        );

                        // Thêm ảnh cho màu mới
                        const colorKey = `${variant.MemorySize}-${color.ColorName}`;
                        const newImages = imagesByColor.get(colorKey) || [];
                        for (const file of newImages) {
                            const fileName = `${Date.now()}-${Math.random()
                                .toString(36)
                                .substring(7)}${path.extname(
                                file.originalname
                            )}`;

                            try {
                                // Lưu file vào thư mục
                                await fs.writeFile(
                                    path.join(uploadDir, fileName),
                                    file.buffer
                                );

                                // Tạo record trong database
                                await db.ProductImage.create(
                                    {
                                        ColorID: newColor.ColorID,
                                        ImageURL: fileName,
                                    },
                                    { transaction }
                                );
                            } catch (error) {
                                throw new Error(
                                    "Không thể lưu ảnh: " + error.message
                                );
                            }
                        }
                    }
                }

                // Xóa những màu không còn trong danh sách mới
                const newColorNames = new Set(
                    variant.colors.map((c) => c.ColorName)
                );
                for (const [colorName, existingColor] of existingColorsMap) {
                    if (!newColorNames.has(colorName)) {
                        // Xóa ảnh của màu này
                        const colorImages = await db.ProductImage.findAll({
                            where: { ColorID: existingColor.ColorID },
                            transaction,
                        });

                        // Xóa file ảnh
                        for (const image of colorImages) {
                            const imagePath = path.join(
                                uploadDir,
                                image.ImageURL
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

                        // Xóa records ảnh và màu
                        await db.ProductImage.destroy({
                            where: { ColorID: existingColor.ColorID },
                            transaction,
                        });
                        await existingColor.destroy({ transaction });
                    }
                }
            } else {
                // Tạo variant mới nếu chưa tồn tại
                const newVariant = await db.ProductVariant.create(
                    {
                        ProductID: product.ProductID,
                        MemorySizeID: memorySizeRecord.MemorySizeID,
                        Price: variant.Price,
                    },
                    { transaction }
                );

                // Tạo màu và ảnh cho variant mới
                for (const color of variant.colors) {
                    const newColor = await db.ProductColor.create(
                        {
                            VariantID: newVariant.VariantID,
                            ColorName: color.ColorName,
                            ColorCode: color.ColorCode,
                            Stock: color.Stock,
                        },
                        { transaction }
                    );

                    const colorKey = `${variant.MemorySize}-${color.ColorName}`;
                    const newImages = imagesByColor.get(colorKey) || [];
                    for (const file of newImages) {
                        const fileName = `${Date.now()}-${Math.random()
                            .toString(36)
                            .substring(7)}${path.extname(file.originalname)}`;

                        try {
                            // Lưu file vào thư mục
                            await fs.writeFile(
                                path.join(uploadDir, fileName),
                                file.buffer
                            );

                            // Tạo record trong database
                            await db.ProductImage.create(
                                {
                                    ColorID: newColor.ColorID,
                                    ImageURL: fileName,
                                },
                                { transaction }
                            );
                        } catch (error) {
                            throw new Error(
                                "Không thể lưu ảnh: " + error.message
                            );
                        }
                    }
                }
            }
        }

        // Xử lý các biến thể đã xóa
        if (req.body.deletedVariants) {
            console.log("Deleting variants:", req.body.deletedVariants); // Debug log
            const deletedVariantIds = JSON.parse(req.body.deletedVariants);

            for (const variantId of deletedVariantIds) {
                // Xóa các màu và ảnh của variant
                const colors = await db.ProductColor.findAll({
                    where: { VariantID: variantId },
                    transaction,
                });

                for (const color of colors) {
                    // Xóa ảnh
                    const images = await db.ProductImage.findAll({
                        where: { ColorID: color.ColorID },
                        transaction,
                    });

                    for (const image of images) {
                        try {
                            const imagePath = path.join(
                                uploadDir,
                                image.ImageURL
                            );
                            if (fsSync.existsSync(imagePath)) {
                                await fs.unlink(imagePath);
                            }
                        } catch (error) {
                            console.error(`Error deleting image file:`, error);
                        }
                    }

                    // Xóa records ảnh
                    await db.ProductImage.destroy({
                        where: { ColorID: color.ColorID },
                        transaction,
                    });
                }

                // Xóa colors
                await db.ProductColor.destroy({
                    where: { VariantID: variantId },
                    transaction,
                });

                // Xóa variant
                await db.ProductVariant.destroy({
                    where: { VariantID: variantId },
                    transaction,
                });
            }
        }

        await transaction.commit();
        res.json({
            message: "Cập nhật sản phẩm thành công",
            thumbnail: thumbnailFileName,
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating product:", error);
        res.status(500).json({ error: error.message });
    }
};
