const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

// Đăng ký tài khoản khách hàng
exports.register = async (req, res) => {
    try {
        const { FullName, Email, Password } = req.body;

        // Kiểm tra email đã tồn tại
        const existingUser = await db.User.findOne({ where: { Email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Tạo user mới
        const newUser = await db.User.create({
            FullName,
            Email,
            PasswordHash: hashedPassword,
            Role: "Customer",
            Status: "active",
        });

        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                id: newUser.UserID,
                email: newUser.Email,
                fullName: newUser.FullName,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Đăng nhập tài khoản khách hàng
exports.login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Tìm user theo email
        const user = await db.User.findOne({ where: { Email } });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Email hoặc mật khẩu không đúng" });
        }

        // Kiểm tra tài khoản có bị khóa không
        if (!user.Status) {
            return res.status(403).json({
                message: "Tài khoản đã bị khóa. Vui lòng liên hệ admin.",
            });
        }

        // Kiểm tra password
        const isValidPassword = await bcrypt.compare(
            Password,
            user.PasswordHash
        );
        if (!isValidPassword) {
            return res
                .status(401)
                .json({ message: "Email hoặc mật khẩu không đúng" });
        }

        // Cập nhật LastLogin
        await user.update({ LastLogin: new Date() });

        // Tạo JWT token
        const token = jwt.sign(
            {
                id: user.UserID,
                email: user.Email,
                role: user.Role,
                status: user.Status,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Đăng nhập thành công",
            user: {
                id: user.UserID,
                email: user.Email,
                fullName: user.FullName,
                role: user.Role,
                status: user.Status,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Kiểm tra trạng thái đăng nhập
exports.check = async (req, res) => {

    let userInToken = jwt.verify(req.body.token, process.env.JWT_SECRET);

    console.log(userInToken);

    let user = await db.User.findOne({ where: { UserID: userInToken.id } });

    console.log(user);

    if (!user) {
        return res.status(401).json({ message: "Tài khoản không tồn tại" });
    }

    res.status(200).json({
        message: "Kiem tra thanh cong",
        data: {
            user: user,
        },
    });
};
