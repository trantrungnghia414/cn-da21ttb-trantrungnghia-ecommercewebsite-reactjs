const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        "Order",
        {
            OrderID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            UserID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            OrderDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            TotalAmount: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            ShippingFee: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            ShippingAddress: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ShippingPhone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            PaymentMethod: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            PaymentStatus: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Pending",
                validate: {
                    isIn: [
                        [
                            "Pending",
                            "Processing",
                            "Completed",
                            "Failed",
                            "Unpaid",
                        ],
                    ],
                    // Pending: Chờ thanh toán
                    // Processing: Đang xử lý
                    // Completed: Hoàn thành
                    // Failed: Thất bại
                    // Unpaid: Chưa thanh toán
                },
            },
            OrderStatus: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Pending",
                validate: {
                    isIn: [
                        [
                            "Pending", // Chờ xử lý
                            "Processing", // Đang xử lý
                            "Shipping", // Đang vận chuyển
                            "Delivered", // Đã giao
                            "Cancelled", // Đã hủy
                        ],
                    ],
                },
            },
            ProvinceCode: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            DistrictCode: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            WardCode: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            ProvinceName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            DistrictName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            WardName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            ShippingCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ExpectedDeliveryTime: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: "Orders",
            timestamps: true,
        }
    );

    Order.associate = function (models) {
        Order.hasMany(models.OrderDetail, {
            foreignKey: "OrderID",
        });
        Order.belongsTo(models.User, {
            foreignKey: "UserID",
        });
    };

    return Order;
};
