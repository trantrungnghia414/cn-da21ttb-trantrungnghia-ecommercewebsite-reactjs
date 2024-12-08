const db = require('../config/database');

class Product {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM products');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(productData) {
        const [result] = await db.query(
            'INSERT INTO products (category_id, name, slug, description, price, stock_quantity, brand, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [productData.category_id, productData.name, productData.slug, productData.description, 
             productData.price, productData.stock_quantity, productData.brand, productData.image_url]
        );
        return result.insertId;
    }

    static async update(id, productData) {
        const [result] = await db.query(
            'UPDATE products SET ? WHERE id = ?',
            [productData, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Product;