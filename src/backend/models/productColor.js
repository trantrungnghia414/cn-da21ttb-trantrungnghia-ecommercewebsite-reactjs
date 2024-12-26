// backend/models/productcolor.js
module.exports = (sequelize, DataTypes) => {
  const ProductColor = sequelize.define('ProductColor', {
    ColorID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ColorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ColorCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'productcolors',
    timestamps: false,
  });

  ProductColor.associate = (models) => {
    ProductColor.belongsTo(models.Product, {
      foreignKey: 'ProductID',
      as: 'product',
    });
    ProductColor.hasMany(models.ProductImage, {
      foreignKey: 'ColorID',
      as: 'images',
    });
    ProductColor.hasMany(models.ProductVariant, {
      foreignKey: 'ColorID',
      as: 'variants',
    });
  };

  return ProductColor;
};