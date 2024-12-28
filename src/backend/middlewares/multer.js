const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo thư mục nếu chưa tồn tại
const uploadDir = path.join(__dirname, "../assets/image/products");

// Hàm format tên file
const formatImageName = (originalname) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(originalname);
    const baseName = path
        .basename(originalname, ext)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s]+/g, "")
        .trim()
        .replace(/\s+/g, "-");

    return `${baseName}-${uniqueSuffix}${ext}`;
};

// Định nghĩa nơi lưu trữ tệp
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const formattedName = formatImageName(file.originalname);
        // Lưu tên file đã format vào req để sử dụng trong controller
        if (!req.formattedFileNames) {
            req.formattedFileNames = [];
        }
        req.formattedFileNames.push(formattedName);
        cb(null, formattedName);
    },
});

// Tạo middleware multer
const upload = multer({ storage });

module.exports = upload;
