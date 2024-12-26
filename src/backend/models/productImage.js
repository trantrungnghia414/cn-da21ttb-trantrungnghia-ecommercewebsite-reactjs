// backend/models/productimage.js
module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define('ProductImage', {
      ImageID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ColorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ImageURL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'productimages',
      timestamps: false,
    });
  
    ProductImage.associate = (models) => {
      ProductImage.belongsTo(models.ProductColor, {
        foreignKey: 'ColorID',
        as: 'color',
      });
    };
  
    return ProductImage;
  };