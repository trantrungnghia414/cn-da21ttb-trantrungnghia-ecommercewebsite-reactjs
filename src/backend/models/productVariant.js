// backend/models/productvariant.js
module.exports = (sequelize, DataTypes) => {
    const ProductVariant = sequelize.define('ProductVariant', {
        VariantID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        MemorySize: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        tableName: 'productvariants',
        timestamps: false,
    });

    ProductVariant.associate = (models) => {
        ProductVariant.belongsTo(models.Product, {
            foreignKey: 'ProductID',
            as: 'product',
        });
        ProductVariant.hasMany(models.ProductColor, {
            foreignKey: 'VariantID',
            as: 'colors',
        });
    };

    return ProductVariant;
};