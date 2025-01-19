module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define(
        "OrderDetail",
        {
            OrderDetailID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            OrderID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            VariantID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            ColorID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            Quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            Price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        },
        {
            tableName: "OrderDetails",
            timestamps: true,
        }
    );

    OrderDetail.associate = (models) => {
        OrderDetail.belongsTo(models.Order, {
            foreignKey: "OrderID",
        });
        OrderDetail.belongsTo(models.ProductVariant, {
            foreignKey: "VariantID",
        });
        OrderDetail.belongsTo(models.ProductColor, {
            foreignKey: "ColorID",
        });
    };

    return OrderDetail;
};
