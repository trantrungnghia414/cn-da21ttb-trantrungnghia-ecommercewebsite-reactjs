const db = require("../models");

exports.createProduct = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { Name, Slug, Description, CategoryID, BrandID, variants } = req.body;

        // Tạo sản phẩm mới
        const product = await db.Product.create(
            {
                Name,
                Slug,
                Description,
                CategoryID,
                BrandID,
            },
            { transaction }
        );

        // Thêm biến thể, màu sắc và ảnh cho sản phẩm
        for (const variant of variants) {
            const productVariant = await db.ProductVariant.create(
                {
                    ProductID: product.ProductID,
                    MemorySize: variant.MemorySize,
                    Price: variant.Price,
                    Stock: variant.Stock,
                },
                { transaction }
            );

            for (const color of variant.colors) {
                const productColor = await db.ProductColor.create(
                    {
                        ProductID: product.ProductID,
                        ColorName: color.ColorName,
                        ColorCode: color.ColorCode,
                        Stock: color.Stock,
                    },
                    { transaction }
                );

                for (const image of color.Images) {
                    await db.ProductImage.create(
                        {
                            ColorID: productColor.ColorID,
                            ImageURL: image.ImageURL,
                        },
                        { transaction }
                    );
                }
            }
        }

        await transaction.commit();
        res.status(201).json(product);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.addColor = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { ColorName, ColorCode, Stock, Images } = req.body;
        const { productID } = req.params;

        const productColor = await db.ProductColor.create(
            {
                ProductID: productID,
                ColorName,
                ColorCode,
                Stock,
            },
            { transaction }
        );

        for (const image of Images) {
            await db.ProductImage.create(
                {
                    ColorID: productColor.ColorID,
                    ImageURL: image.ImageURL,
                },
                { transaction }
            );
        }

        await transaction.commit();
        res.status(201).json(productColor);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.addVariant = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { MemorySize, Price, Stock, colors } = req.body;
        const { productID } = req.params;

        const productVariant = await db.ProductVariant.create(
            {
                ProductID: productID,
                MemorySize,
                Price,
                Stock,
            },
            { transaction }
        );

        for (const color of colors) {
            const productColor = await db.ProductColor.create(
                {
                    ProductID: productID,
                    ColorName: color.ColorName,
                    ColorCode: color.ColorCode,
                    Stock: color.Stock,
                },
                { transaction }
            );

            for (const image of color.Images) {
                await db.ProductImage.create(
                    {
                        ColorID: productColor.ColorID,
                        ImageURL: image.ImageURL,
                    },
                    { transaction }
                );
            }
        }

        await transaction.commit();
        res.status(201).json(productVariant);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await db.Product.findAll({
            include: [
                {
                    model: db.Category,
                    as: 'category',
                },
                {
                    model: db.Brand,
                    as: 'brand',
                },
                {
                    model: db.ProductVariant,
                    as: 'variants',
                    include: [
                        {
                            model: db.ProductColor,
                            as: 'colors',
                            include: [
                                {
                                    model: db.ProductImage,
                                    as: 'images',
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};