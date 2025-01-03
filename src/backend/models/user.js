module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            UserID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            FullName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            PasswordHash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            PhoneNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            Address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            Role: {
                type: DataTypes.ENUM("Customer", "Admin"),
                defaultValue: "Customer",
            },
            Status: {
                type: DataTypes.STRING,
                defaultValue: "active",
            },
        },
        {
            tableName: "users",
            timestamps: false,
        }
    );

    return User;
};
