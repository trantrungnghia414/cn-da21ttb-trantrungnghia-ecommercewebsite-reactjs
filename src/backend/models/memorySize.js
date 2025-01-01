module.exports = (sequelize, DataTypes) => {
    const MemorySize = sequelize.define(
        "MemorySize",
        {
            MemorySizeID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            MemorySize: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            CategoryID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            CreatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "memorysizes",
            timestamps: false,
        }
    );

    MemorySize.associate = (models) => {
        MemorySize.belongsTo(models.Category, {
            foreignKey: "CategoryID",
            as: "Category",
        });
    };

    return MemorySize;
};
