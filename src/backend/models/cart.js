const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            // Quan hệ với User
            Cart.belongsTo(models.User, {
                foreignKey: "UserID",
                as: "user",
            });

            // Quan hệ với ProductVariant
            Cart.belongsTo(models.ProductVariant, {
                foreignKey: "VariantID",
                as: "productVariant",
            });

            // Quan hệ với ProductColor
            Cart.belongsTo(models.ProductColor, {
                foreignKey: "ColorID",
                as: "productColor",
            });
        }
    }

    Cart.init(
        {
            CartID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            UserID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "UserID",
                },
            },
            VariantID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "ProductVariants",
                    key: "VariantID",
                },
            },
            ColorID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "ProductColors",
                    key: "ColorID",
                },
            },
            Quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    min: 1,
                },
            },
            Price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                comment: "Giá tại thời điểm thêm vào giỏ",
            },
            Status: {
                type: DataTypes.ENUM(
                    "active",
                    "saved_for_later",
                    "out_of_stock"
                ),
                allowNull: false,
                defaultValue: "active",
            },
            CreatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            UpdatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Cart",
            tableName: "Carts",
            timestamps: true,
            createdAt: "CreatedAt",
            updatedAt: "UpdatedAt",
        }
    );

    return Cart;
};
