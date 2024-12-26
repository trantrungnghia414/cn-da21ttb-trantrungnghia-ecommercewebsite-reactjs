const db = require('../models');

exports.createCategory = async (req, res) => {
  try {
    const { Name, Slug, Description } = req.body;
    const category = await db.Category.create({ Name, Slug, Description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => { // Lấy tất cả danh mục
  try {
    const categories = await db.Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategory = async (req, res) => { // Lấy một danh mục
  try {
    const category = await db.Category.findOne({ where: { Slug: req.params.slug } });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => { // Cập nhật một danh mục
  try {
    const category = await db.Category.findOne({ where: { Slug: req.params.slug } });
    if (category) {
      const { Name, Description } = req.body;
      await category.update({ Name, Description });
      res.json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.deleteCategory = async (req, res) => { // Xóa một danh mục
  try {
    const category = await db.Category.findOne({ where: { Slug: req.params.slug } });
    if (category) {
      await category.destroy();
      res.json({ message: 'Category deleted' });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}