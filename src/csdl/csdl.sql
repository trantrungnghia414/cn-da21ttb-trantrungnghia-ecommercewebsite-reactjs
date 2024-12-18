-- Bảng Users (Quản lý người dùng)
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20),
    Address TEXT,
    Role ENUM('Customer', 'Admin') DEFAULT 'Customer',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Categories (Quản lý danh mục sản phẩm)
CREATE TABLE IF NOT EXISTS Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Slug VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Brands (Quản lý thương hiệu)
CREATE TABLE IF NOT EXISTS Brands (
    BrandID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Slug VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Products (Quản lý sản phẩm)
CREATE TABLE IF NOT EXISTS Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryID INT NOT NULL,
    BrandID INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Slug VARCHAR(255) NOT NULL UNIQUE,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    FOREIGN KEY (BrandID) REFERENCES Brands(BrandID)
);

-- Bảng ProductColors (Quản lý màu sắc của sản phẩm)
CREATE TABLE IF NOT EXISTS ProductColors (
    ColorID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT NOT NULL,
    ColorName VARCHAR(50) NOT NULL,
    ColorCode VARCHAR(10) NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Bảng ProductImages (Quản lý hình ảnh sản phẩm theo màu sắc)
CREATE TABLE IF NOT EXISTS ProductImages (
    ImageID INT AUTO_INCREMENT PRIMARY KEY,
    ColorID INT NOT NULL,
    ImageURL VARCHAR(255) NOT NULL,
    FOREIGN KEY (ColorID) REFERENCES ProductColors(ColorID)
);

-- Bảng ProductVariants (Quản lý các biến thể sản phẩm như dung lượng, giá cả, số lượng)
CREATE TABLE IF NOT EXISTS ProductVariants (
    VariantID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT NOT NULL,
    ColorID INT NOT NULL,
    MemorySize VARCHAR(50),
    Price DECIMAL(10, 2) NOT NULL,
    Stock INT NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (ColorID) REFERENCES ProductColors(ColorID)
);

-- Bảng Carts (Quản lý giỏ hàng và các sản phẩm trong giỏ hàng)
CREATE TABLE IF NOT EXISTS Carts (
    CartID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    VariantID INT NOT NULL,
    Quantity INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (VariantID) REFERENCES ProductVariants(VariantID)
);

-- Bảng Orders (Quản lý đơn hàng)
CREATE TABLE IF NOT EXISTS Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    ShippingAddress TEXT,
    OrderStatus ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Bảng OrderDetails (Chi tiết sản phẩm trong đơn hàng)
CREATE TABLE IF NOT EXISTS OrderDetails (
    OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    VariantID INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (VariantID) REFERENCES ProductVariants(VariantID)
);

-- Bảng Payments (Lưu thông tin thanh toán)
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cod', 'banking', 'momo', 'vnpay') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(OrderID) ON DELETE CASCADE
);

-- Bảng Promotions (Quản lý khuyến mãi)
CREATE TABLE IF NOT EXISTS Promotions (
    PromotionID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT NOT NULL,
    DiscountPercentage DECIMAL(5, 2) NOT NULL,
    StartDate TIMESTAMP NOT NULL,
    EndDate TIMESTAMP NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Bảng Reviews (Quản lý đánh giá sản phẩm)
CREATE TABLE IF NOT EXISTS Reviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT NOT NULL,
    UserID INT NOT NULL,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    Comment TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Bảng TransactionHistory (Lịch sử giao dịch)
CREATE TABLE IF NOT EXISTS TransactionHistory (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    OrderID INT NOT NULL,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentMethod ENUM('cod', 'banking', 'momo', 'vnpay') NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

-- Bảng Suppliers (Quản lý nhà cung cấp)
CREATE TABLE IF NOT EXISTS Suppliers (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    ContactInfo TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
