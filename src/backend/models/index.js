// backend/models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/config');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Product = require('./product')(sequelize, Sequelize);
db.ProductColor = require('./productcolor')(sequelize, Sequelize);
db.ProductImage = require('./productimage')(sequelize, Sequelize);
db.ProductVariant = require('./productvariant')(sequelize, Sequelize);
db.Category = require('./category')(sequelize, Sequelize);
db.Brand = require('./brand')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;