module.exports = (sequelize, DataTypes) => {
    const Promotion = sequelize.define(
        "Promotion",
        {
            PromotionID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            Code: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            Name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            Description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            DiscountType: {
                type: DataTypes.ENUM("Percentage", "Fixed"),
                allowNull: false,
            },
            DiscountValue: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            MinimumOrder: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            MaximumDiscount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            StartDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            EndDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            UsageLimit: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            UsageCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            Status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            timestamps: true,
            createdAt: "CreatedAt",
            updatedAt: "UpdatedAt",
        }
    );

    return Promotion;
};
