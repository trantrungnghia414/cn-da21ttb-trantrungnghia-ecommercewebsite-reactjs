module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    BrandID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: 'brands',
    timestamps: false,
  });

  Brand.associate = (models) => {
    Brand.hasMany(models.Product, {
      foreignKey: 'BrandID',
      as: 'products',
    });
  };

  return Brand;
};