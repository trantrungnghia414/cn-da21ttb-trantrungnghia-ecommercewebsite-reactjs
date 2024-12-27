const multer = require('multer');
const path = require('path');

// Định nghĩa nơi lưu trữ tệp
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../assets/image/products')); // Đường dẫn đến thư mục lưu trữ ảnh sản phẩm
    },
    filename: (req, file, cb) => {
        const formattedName = file.originalname
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9.]+/g, "-")
            .replace(/^-+|-+$/g, "");
        cb(null, formattedName); // Lưu tên đã được định dạng
    },
});

// Tạo middleware multer
const upload = multer({ storage });

module.exports = upload;