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
db.MemorySize = require('./memorysize')(sequelize, Sequelize);
db.Brand = require('./brand')(sequelize, Sequelize);
db.Supplier = require('./supplier')(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);
db.Cart = require("./cart")(sequelize, Sequelize);
db.Order = require("./order")(sequelize, Sequelize);
db.OrderDetail = require("./orderDetail")(sequelize, Sequelize);
db.Promotion = require("./promotion")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;