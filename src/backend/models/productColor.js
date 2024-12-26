// backend/models/productcolor.js
module.exports = (sequelize, DataTypes) => {
    const ProductColor = sequelize.define(
        "ProductColor",
        {
            ColorID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            VariantID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "ProductVariant", // Tên bảng
                    key: "VariantID", // Tên trường khóa chính
                },
            },
            ColorName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ColorCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            tableName: "productcolors",
            timestamps: false,
        }
    );

    ProductColor.associate = (models) => {
        ProductColor.belongsTo(models.ProductVariant, {
            foreignKey: "VariantID",
            as: "variant",
        });
        ProductColor.hasMany(models.ProductImage, {
            foreignKey: "ColorID",
            as: "images",
        });
    };

    return ProductColor;
};
