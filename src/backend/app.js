require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    })
);

// Thêm log để debug routes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static files
app.use("/assets", express.static(path.join(__dirname, "assets")));

// API routes
app.use(express.json());
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/brands", require("./routes/brandRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/memorysizes", require("./routes/memorySizeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/shipping", require("./routes/shippingRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));
const promotionRoutes = require("./routes/promotionRoutes");
app.use("/api/promotions", promotionRoutes);

// Thêm error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Có lỗi xảy ra!" });
});

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
