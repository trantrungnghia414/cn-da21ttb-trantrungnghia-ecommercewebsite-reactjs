const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Tạo thư mục nếu chưa tồn tại
const uploadDir = path.join(__dirname, "../assets/image/products");

// Hàm tạo chuỗi số ngẫu nhiên 10 chữ số
const generateRandomNumbers = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Hàm format tên file
const formatImageName = (originalname) => {
    const ext = path.extname(originalname);
    // Tạo hash từ tên gốc + timestamp
    const hash = crypto
        .createHash("md5")
        .update(originalname + Date.now().toString())
        .digest("hex");

    // Thêm 10 số ngẫu nhiên
    const randomNumbers = generateRandomNumbers();

    return `${hash}-${randomNumbers}${ext}`;
};

// Định nghĩa nơi lưu trữ tệp
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
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
