module.exports = (sequelize, DataTypes) => {
    const ProductVariant = sequelize.define(
        "ProductVariant",
        {
            VariantID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            ProductID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            MemorySizeID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            Price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        },
        {
            tableName: "productvariants",
            timestamps: false,
        }
    );

    ProductVariant.associate = (models) => {
        ProductVariant.belongsTo(models.Product, {
            foreignKey: "ProductID",
            as: "product",
        });
        ProductVariant.belongsTo(models.MemorySize, {
            foreignKey: "MemorySizeID",
            as: "memorySize",
        });
        ProductVariant.hasMany(models.ProductColor, {
            foreignKey: "VariantID",
            as: "colors",
        });
    };

    return ProductVariant;
};
