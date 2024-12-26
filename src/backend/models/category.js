module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    CategoryID: {
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
    tableName: 'categories',
    timestamps: false,
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: 'CategoryID',
      as: 'products',
    });
  };

  return Category;
};