const db = require('../models');

exports.createBrand = async (req, res) => {
  try {
    const { Name, Slug, Description } = req.body;
    const brand = await db.Brand.create({ Name, Slug, Description });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await db.Brand.findAll();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBrand = async (req, res) => {
  try {
    const brand = await db.Brand.findOne({ where: { Slug: req.params.slug } });
    if (brand) {
      res.json(brand);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const brand = await db.Brand.findOne({ where: { Slug: req.params.slug } });
    if (brand) {
      const { Name, Description } = req.body;
      await brand.update({ Name, Description });
      res.json(brand);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await db.Brand.findOne({ where: { Slug: req.params.slug } });
    if (brand) {
      await brand.destroy();
      res.json({ message: 'Brand deleted' });
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};