const jwt = require("jsonwebtoken");

// Middleware để xác thực token
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Không tìm thấy token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token không hợp lệ" });
        }
        req.user = user;
        next();
    });
};

// Middleware để kiểm tra quyền admin
exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
};

// Middleware để kiểm tra trạng thái tài khoản
exports.checkUserStatus = (req, res, next) => {
    if (!req.user.status) {
        return res.status(403).json({
            message: "Tài khoản đã bị khóa. Vui lòng liên hệ admin.",
        });
    }
    next();
};
