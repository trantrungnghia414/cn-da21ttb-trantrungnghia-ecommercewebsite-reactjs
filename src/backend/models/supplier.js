module.exports = (sequelize, DataTypes) => {
    const Supplier = sequelize.define('Supplier', {
      SupplierID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ContactInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'suppliers',
      timestamps: false,
    });
  
    Supplier.associate = (models) => {
      Supplier.hasMany(models.Product, {
        foreignKey: 'SupplierID',
        as: 'products',
      });
    };
  
    return Supplier;
  };