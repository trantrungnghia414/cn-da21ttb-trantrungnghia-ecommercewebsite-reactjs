const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const fsSync = require("fs");
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
    const hash = crypto
        .createHash("md5")
        .update(originalname + Date.now().toString())
        .digest("hex");
    const randomNumbers = generateRandomNumbers();
    return `${hash}-${randomNumbers}${ext}`;
};

// Sử dụng memoryStorage thay vì diskStorage
const storage = multer.memoryStorage();

// Tạo middleware multer với memory storage
const upload = multer({ storage });

// Middleware để xử lý việc lưu file
const handleFileUpload = async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next();
    }

    try {
        // Tạo mảng để lưu tên file đã format
        req.formattedFileNames = [];

        // Tạo mảng để lưu thông tin file (buffer và tên)
        req.fileBuffers = [];

        // Xử lý tất cả các file
        const allFiles = [
            ...(req.files.thumbnail || []),
            ...(req.files.productImages || []),
        ];

        for (const file of allFiles) {
            const formattedName = formatImageName(file.originalname);
            req.formattedFileNames.push(formattedName);
            req.fileBuffers.push({
                buffer: file.buffer,
                fileName: formattedName,
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

// Hàm để lưu các file vào thư mục
const saveFiles = async (fileBuffers) => {
    // Đảm bảo thư mục tồn tại
    if (!fsSync.existsSync(uploadDir)) {
        await fs.mkdir(uploadDir, { recursive: true });
    }

    // Lưu từng file
    for (const file of fileBuffers) {
        const filePath = path.join(uploadDir, file.fileName);
        await fs.writeFile(filePath, file.buffer);
    }
};

// Hàm để xóa các file đã lưu (trong trường hợp rollback)
const deleteFiles = async (fileNames) => {
    for (const fileName of fileNames) {
        const filePath = path.join(uploadDir, fileName);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error(`Không thể xóa file ${filePath}:`, error);
        }
    }
};

module.exports = {
    upload,
    handleFileUpload,
    saveFiles,
    deleteFiles,
};
