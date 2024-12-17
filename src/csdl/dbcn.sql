-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 11, 2024 at 03:48 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbdt`
--
CREATE DATABASE IF NOT EXISTS `dbcn` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `dbcn`;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `created_at`) VALUES
(2, 'Apple', 'apple', 'Thương hiệu cao cấp đến từ Mỹ, nổi tiếng với dòng iPhone, iPad, Apple Watch, và tai nghe AirPods', '2024-12-10 21:17:19'),
(3, 'Samsung', 'samsung', 'Thương hiệu Hàn Quốc với danh mục sản phẩm phong phú từ điện thoại, máy tính bảng đến đồng hồ thông minh và tai nghe', '2024-12-10 21:17:52'),
(6, 'Oppo', 'oppo', 'Thương hiệu tập trung vào điện thoại với khả năng chụp ảnh selfie nổi bật, âm thanh chất lượng, và thiết kế độc đáo', '2024-12-10 21:54:22'),
(9, 'ELIO', 'elio', 'Hãng âm thanh nổi tiếng với các sản phẩm tai nghe và loa di động. Tai nghe JBL thường có âm bass mạnh mẽ, phù hợp cho người yêu nhạc', '2024-12-10 21:56:29'),
(11, 'Havit', 'havit', 'Thương hiệu chuyên về phụ kiện như sạc, pin dự phòng, và thiết bị âm thanh. Sản phẩm Anker có độ bền cao và giá cả hợp lý', '2024-12-10 21:58:19'),
(13, 'MVW', 'mvw', 'Hãng công nghệ Trung Quốc với các sản phẩm giá cả hợp lý nhưng chất lượng tốt. Xiaomi tập trung vào điện thoại, máy tính bảng và các thiết bị đeo tay thông minh', '2024-12-10 21:59:09'),
(14, 'Sony', 'sony', 'Thương hiệu Nhật Bản chuyên về tai nghe và các thiết bị điện tử. Tai nghe Sony nổi bật với công nghệ chống ồn tiên tiến và âm thanh sống động.', '2024-12-10 22:06:14'),
(15, 'Xiaomi', 'xiaomi', 'Thương hiệu trẻ trung, chuyên cung cấp các dòng điện thoại hiệu năng cao trong phân khúc giá rẻ và tầm trung', '2024-12-10 22:06:31');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `created_at`) VALUES
(9, 'Điện thoại di động', 'dien-thoai-di-dong', 'Đây là danh mục tập hợp các dòng điện thoại thông minh với nhiều phân khúc khác nhau từ phổ thông, tầm trung đến cao cấp', '2024-12-10 21:16:48'),
(10, 'Đồng hồ thông minh', 'dong-ho-thong-minh', 'Tập trung vào các thiết bị đeo tay thông minh, danh mục này bao gồm các sản phẩm hỗ trợ theo dõi sức khỏe, đo nhịp tim, đếm bước chân, và đồng bộ với điện thoại', '2024-12-10 21:17:37'),
(11, 'Máy tính bảng', 'may-tinh-bang', 'Danh mục này bao gồm các thiết bị có màn hình lớn, thường sử dụng để đọc sách, giải trí, hoặc làm việc', '2024-12-10 21:53:20'),
(12, 'Tai nghe', 'tai-nghe', 'Danh mục này gồm các loại tai nghe từ tai nghe có dây đến tai nghe không dây với chất lượng âm thanh vượt trội', '2024-12-10 21:53:35');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `shipping_address` text NOT NULL,
  `phone` varchar(15) NOT NULL,
  `payment_status` enum('unpaid','paid','refunded') DEFAULT 'unpaid',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cod','banking','momo','vnpay') NOT NULL,
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL,
  `image_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `description`, `price`, `stock_quantity`, `image_url`, `created_at`) VALUES
(17, 9, 2, 'Iphone 13', 'iphone-13', 'Rất mạnh', '14000000.00', 6, 'assets/uploads/products/iphone-13-6758b9ea4f959.png', '2024-12-10 22:00:10'),
(18, 9, 3, 'Samsung S23', 'samsung-s23', 'Rất to', '32000000.00', 21, 'assets/uploads/products/samsung-s23-6758ba3a0e299.png', '2024-12-10 22:01:30'),
(19, 10, 13, 'Đồng hồ MVW Glory', 'dong-ho-mvw-glory', 'Rất đúng giờ', '35000000.00', 0, 'assets/uploads/products/dong-ho-mvw-glory-6758bbbf7043f.png', '2024-12-10 22:07:59'),
(20, 10, 9, 'Đồng hồ ELIO', 'dong-ho-elio', 'Rất đẹp', '13000000.00', 8, 'assets/uploads/products/dong-ho-elio-6758bbeb93a54.png', '2024-12-10 22:08:43'),
(21, 11, 6, 'Oppo Pad 3 Pro', 'oppo-pad-3-pro', 'Rất nhanh', '23000000.00', 41, 'assets/uploads/products/oppo-pad-3-pro-6758bcabcd947.png', '2024-12-10 22:11:55'),
(22, 11, 15, 'Xiaomi Pad6', 'xiaomi-pad6', 'Rất trẻ trung', '16000000.00', 0, 'assets/uploads/products/xiaomi-pad6-6758bcd657936.png', '2024-12-10 22:12:38'),
(23, 12, 11, 'Tai nghe chụp tay Havit', 'tai-nghe-chup-tay-havit', 'Rất êm', '9000000.00', 49, 'assets/uploads/products/tai-nghe-chup-tay-havit-6758bd9c61807.png', '2024-12-10 22:15:56'),
(24, 12, 14, 'Tai nghe chụp tay Sony', 'tai-nghe-chup-tay-sony', 'Rất đã', '7000000.00', 28, 'assets/uploads/products/tai-nghe-chup-tay-sony-6758bdc30d9c2.png', '2024-12-10 22:16:35');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `fullname`, `phone`, `address`, `role`, `created_at`, `last_activity`) VALUES
(2, 'admin@gmail.com', '$2y$10$KwKZKRskVjVGUn/03hcb0O4hYNTs96wkxKY0QdApCHaXUUOFId8zq', 'admin', '0989898989', '126 Nguyễn Thiện Thành, Phường 5, Trà Vinh, Việt Nam', 'admin', '2024-12-10 15:28:00', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `products_ibfk_2` (`brand_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
