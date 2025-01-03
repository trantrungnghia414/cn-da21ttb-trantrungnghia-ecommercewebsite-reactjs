const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const brandRoutes = require('./brandRoutes');
const supplierRoutes = require('./supplierRoutes');
const memorySizeRoutes = require('./memorySizeRoutes');
// const cartRoutes = require('./cartRoutes');
// const orderRoutes = require('./orderRoutes');
// const paymentRoutes = require('./paymentRoutes');
// const reviewRoutes = require('./reviewRoutes');
// const promotionRoutes = require('./promotionRoutes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/memorysizes', memorySizeRoutes);
// router.use('/carts', cartRoutes);
// router.use('/orders', orderRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/reviews', reviewRoutes);
// router.use('/promotions', promotionRoutes);

module.exports = router;