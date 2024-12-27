module.exports = (sequelize, DataTypes) => {
    const MemorySize = sequelize.define('MemorySize', {
        MemorySizeID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        CategoryID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        MemorySize: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'memorysizes',
        timestamps: false,
    });

    MemorySize.associate = (models) => {
        MemorySize.belongsTo(models.Category, {
            foreignKey: 'CategoryID',
            as: 'category',
        });
        MemorySize.hasMany(models.ProductVariant, {
            foreignKey: 'MemorySizeID',
            as: 'variants',
        });
    };

    return MemorySize;
};