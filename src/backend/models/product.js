module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BrandID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SupplierID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'products',
    timestamps: false,
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'CategoryID',
      as: 'category',
    });
    Product.belongsTo(models.Brand, {
      foreignKey: 'BrandID',
      as: 'brand',
    });
    Product.belongsTo(models.Supplier, {
      foreignKey: 'SupplierID',
      as: 'supplier',
    });
    Product.hasMany(models.ProductVariant, {
      foreignKey: 'ProductID',
      as: 'variants',
    });
  };

  return Product;
};