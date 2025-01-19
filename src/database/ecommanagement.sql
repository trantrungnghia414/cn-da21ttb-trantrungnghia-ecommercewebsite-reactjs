-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 19, 2025 at 05:03 PM
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
-- Database: `ecommanagement`
--
CREATE DATABASE IF NOT EXISTS `ecommanagement` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `ecommanagement`;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `BrandID` int NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Slug` varchar(100) NOT NULL,
  `Description` text,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`BrandID`, `Name`, `Slug`, `Description`, `CreatedAt`) VALUES
(25, 'Samsung', 'samsung', 'Samsung là tập đoàn công nghệ đa quốc gia hàng đầu, cung cấp thiết bị điện tử, di động, và gia dụng chất lượng cao, luôn tiên phong trong đổi mới công nghệ.\n', '2025-01-05 10:29:21'),
(26, 'Apple', 'apple', 'Apple nổi tiếng với thiết kế tinh tế, hiệu suất vượt trội và hệ sinh thái sản phẩm đồng bộ.\n', '2025-01-05 10:29:32'),
(27, 'Xiaomi', 'xiaomi', 'Xiaomi mang đến sản phẩm công nghệ cao cấp với mức giá cạnh tranh, phù hợp với nhiều phân khúc.\n', '2025-01-05 10:29:44'),
(28, 'Sony', 'sony', 'Sony tập trung vào trải nghiệm âm thanh, hình ảnh vượt trội và độ bền sản phẩm cao.\n', '2025-01-05 10:29:53'),
(29, 'Oppo', 'oppo', 'Oppo nổi bật với thiết kế thời thượng và công nghệ camera đột phá.\n', '2025-01-05 10:30:02');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `CartID` int NOT NULL,
  `UserID` int NOT NULL,
  `VariantID` int NOT NULL,
  `ColorID` int NOT NULL,
  `Quantity` int NOT NULL DEFAULT '1',
  `Price` decimal(10,2) NOT NULL COMMENT 'Giá tại thời điểm thêm vào giỏ',
  `Status` enum('active','saved_for_later','out_of_stock') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `CategoryID` int NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Slug` varchar(100) NOT NULL,
  `Description` text,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`CategoryID`, `Name`, `Slug`, `Description`, `CreatedAt`) VALUES
(32, 'Điện thoại', 'dien-thoai', 'Điện thoại thông minh là thiết bị di động tích hợp các tính năng như nghe gọi, truy cập internet, chụp ảnh, quay video, và nhiều ứng dụng hỗ trợ công việc lẫn giải trí. Chúng thường có thiết kế nhỏ gọn, màn hình cảm ứng, và hiệu năng cao.\n', '2025-01-05 10:31:32'),
(33, 'Máy tính bảng', 'may-tinh-bang', 'Máy tính bảng là thiết bị có màn hình lớn hơn điện thoại, kết hợp giữa tính di động và hiệu năng làm việc. Chúng được sử dụng phổ biến để học tập, làm việc, hoặc giải trí như xem phim, chơi game. Nhiều sản phẩm hỗ trợ bút cảm ứng hoặc bàn phím rời.\n', '2025-01-05 10:31:43'),
(34, 'Laptop ', 'laptop', 'Laptop là thiết bị phục vụ nhu cầu học tập, làm việc và giải trí với hiệu năng mạnh mẽ trong một thiết kế gọn nhẹ. Các dòng laptop hiện đại thường hỗ trợ màn hình cảm ứng, hiệu suất đồ họa cao, và thời lượng pin dài.\n', '2025-01-05 10:31:52'),
(36, 'Đồng hồ thông minh', 'dong-ho-thong-minh', 'Đồng hồ thông minh không chỉ giúp quản lý thời gian mà còn tích hợp các tính năng theo dõi sức khỏe, nhận thông báo từ điện thoại, và hỗ trợ thể thao. Chúng có thiết kế thời trang và thường đi kèm các tùy chọn dây đeo thay thế.\n', '2025-01-05 10:32:12');

-- --------------------------------------------------------

--
-- Table structure for table `memorysizes`
--

CREATE TABLE `memorysizes` (
  `MemorySizeID` int NOT NULL,
  `CategoryID` int NOT NULL,
  `MemorySize` varchar(50) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `memorysizes`
--

INSERT INTO `memorysizes` (`MemorySizeID`, `CategoryID`, `MemorySize`, `CreatedAt`) VALUES
(27, 32, '64GB', '2025-01-05 10:34:19'),
(28, 32, '128GB', '2025-01-05 10:34:24'),
(29, 32, '256GB', '2025-01-05 10:34:31'),
(30, 32, '512GB', '2025-01-05 10:34:36'),
(31, 32, '1TB', '2025-01-05 10:34:42'),
(33, 33, '64GB', '2025-01-05 10:35:04'),
(34, 33, '128GB', '2025-01-05 10:35:10'),
(35, 33, '256GB', '2025-01-05 10:35:15'),
(36, 33, '512GB', '2025-01-05 10:35:20'),
(37, 33, '1TB', '2025-01-05 10:35:28'),
(38, 34, '256GB', '2025-01-05 10:37:36'),
(39, 34, '512GB', '2025-01-05 10:37:43'),
(40, 34, '1TB', '2025-01-05 10:37:48'),
(41, 34, '2TB', '2025-01-05 10:37:55'),
(42, 36, '4GB', '2025-01-05 10:39:43'),
(43, 36, '8GB', '2025-01-05 10:39:49'),
(44, 36, '16GB', '2025-01-05 10:39:54'),
(45, 36, '32GB', '2025-01-05 10:40:00');

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `OrderDetailID` int NOT NULL,
  `OrderID` int NOT NULL,
  `VariantID` int NOT NULL,
  `ColorID` int NOT NULL,
  `Quantity` int NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orderdetails`
--

INSERT INTO `orderdetails` (`OrderDetailID`, `OrderID`, `VariantID`, `ColorID`, `Quantity`, `Price`, `createdAt`, `updatedAt`) VALUES
(172, 180, 504, 628, 1, '18990000.00', '2025-01-16 19:42:44', '2025-01-16 19:42:44'),
(173, 181, 497, 621, 1, '26989999.00', '2025-01-16 19:51:16', '2025-01-16 19:51:16'),
(174, 182, 498, 622, 1, '22490000.00', '2025-01-16 19:58:52', '2025-01-16 19:58:52'),
(176, 184, 495, 619, 1, '25190000.00', '2025-01-16 20:26:25', '2025-01-16 20:26:25'),
(177, 185, 498, 622, 1, '22490000.00', '2025-01-16 21:18:10', '2025-01-16 21:18:10'),
(178, 186, 495, 619, 1, '25190000.00', '2025-01-16 21:37:49', '2025-01-16 21:37:49'),
(179, 186, 501, 625, 1, '65390000.00', '2025-01-16 21:37:49', '2025-01-16 21:37:49'),
(180, 187, 506, 630, 1, '1.00', '2025-01-16 22:14:15', '2025-01-16 22:14:15'),
(181, 188, 502, 626, 1, '43490000.00', '2025-01-16 22:14:41', '2025-01-16 22:14:41'),
(182, 189, 504, 628, 1, '18990000.00', '2025-01-16 22:16:12', '2025-01-16 22:16:12'),
(185, 192, 500, 624, 1, '93790000.00', '2025-01-16 23:02:11', '2025-01-16 23:02:11'),
(186, 193, 506, 630, 1, '1.00', '2025-01-16 23:05:29', '2025-01-16 23:05:29'),
(197, 204, 498, 622, 1, '22490000.00', '2025-01-16 23:27:25', '2025-01-16 23:27:25'),
(198, 205, 499, 623, 1, '3590000.00', '2025-01-16 23:30:00', '2025-01-16 23:30:00'),
(199, 206, 498, 622, 1, '22490000.00', '2025-01-16 23:30:35', '2025-01-16 23:30:35'),
(200, 207, 509, 635, 1, '799999.00', '2025-01-16 23:32:33', '2025-01-16 23:32:33'),
(201, 208, 498, 622, 1, '22490000.00', '2025-01-16 23:37:25', '2025-01-16 23:37:25'),
(202, 209, 499, 623, 1, '3590000.00', '2025-01-16 23:37:49', '2025-01-16 23:37:49'),
(203, 210, 498, 622, 1, '22490000.00', '2025-01-16 23:40:32', '2025-01-16 23:40:32'),
(204, 211, 495, 619, 1, '25190000.00', '2025-01-16 23:44:21', '2025-01-16 23:44:21'),
(205, 212, 498, 622, 1, '22490000.00', '2025-01-16 23:44:46', '2025-01-16 23:44:46'),
(206, 213, 502, 626, 1, '43490000.00', '2025-01-17 03:03:13', '2025-01-17 03:03:13'),
(207, 214, 499, 623, 1, '3590000.00', '2025-01-17 03:09:13', '2025-01-17 03:09:13'),
(208, 215, 499, 623, 1, '3590000.00', '2025-01-17 03:11:32', '2025-01-17 03:11:32'),
(209, 216, 499, 623, 2, '3590000.00', '2025-01-17 03:19:56', '2025-01-17 03:19:56'),
(210, 217, 499, 623, 1, '3590000.00', '2025-01-17 03:26:41', '2025-01-17 03:26:41'),
(211, 218, 497, 621, 1, '26989999.00', '2025-01-17 03:28:23', '2025-01-17 03:28:23'),
(215, 222, 498, 622, 3, '22490000.00', '2025-01-17 03:46:36', '2025-01-17 03:46:36'),
(216, 223, 498, 622, 2, '22490000.00', '2025-01-17 04:28:09', '2025-01-17 04:28:09'),
(217, 224, 497, 621, 1, '26989999.00', '2025-01-17 04:28:19', '2025-01-17 04:28:19'),
(218, 225, 498, 622, 1, '22490000.00', '2025-01-17 04:58:42', '2025-01-17 04:58:42'),
(219, 226, 496, 620, 6, '22990000.00', '2025-01-17 05:09:06', '2025-01-17 05:09:06'),
(220, 227, 499, 623, 1, '3590000.00', '2025-01-17 05:10:19', '2025-01-17 05:10:19'),
(221, 228, 499, 623, 1, '3590000.00', '2025-01-17 05:10:21', '2025-01-17 05:10:21'),
(222, 229, 496, 620, 1, '22990000.00', '2025-01-17 05:26:31', '2025-01-17 05:26:31'),
(223, 230, 498, 622, 1, '22490000.00', '2025-01-17 05:34:30', '2025-01-17 05:34:30'),
(224, 231, 498, 622, 2, '22490000.00', '2025-01-17 05:44:22', '2025-01-17 05:44:22'),
(225, 232, 499, 623, 1, '3590000.00', '2025-01-17 05:45:25', '2025-01-17 05:45:25'),
(226, 233, 499, 623, 1, '3590000.00', '2025-01-17 05:45:26', '2025-01-17 05:45:26'),
(227, 234, 499, 623, 1, '3590000.00', '2025-01-17 05:52:42', '2025-01-17 05:52:42'),
(228, 235, 492, 607, 1, '34990000.00', '2025-01-17 07:17:54', '2025-01-17 07:17:54'),
(229, 236, 499, 623, 1, '3590000.00', '2025-01-17 07:18:07', '2025-01-17 07:18:07');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `OrderID` int NOT NULL,
  `UserID` int NOT NULL,
  `OrderDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `TotalAmount` decimal(15,2) NOT NULL,
  `ShippingFee` decimal(15,2) NOT NULL DEFAULT '0.00',
  `ShippingAddress` text NOT NULL,
  `ShippingPhone` varchar(15) NOT NULL,
  `PaymentMethod` enum('cod','vnpay') NOT NULL DEFAULT 'cod',
  `PaymentStatus` enum('Pending','Processing','Completed','Failed','Unpaid') NOT NULL DEFAULT 'Pending',
  `OrderStatus` enum('pending','processing','shipping','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `ProvinceCode` varchar(20) DEFAULT NULL,
  `DistrictCode` varchar(20) DEFAULT NULL,
  `WardCode` varchar(20) DEFAULT NULL,
  `ProvinceName` varchar(100) DEFAULT NULL,
  `DistrictName` varchar(100) DEFAULT NULL,
  `WardName` varchar(100) DEFAULT NULL,
  `ShippingCode` varchar(50) DEFAULT NULL,
  `ExpectedDeliveryTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`OrderID`, `UserID`, `OrderDate`, `TotalAmount`, `ShippingFee`, `ShippingAddress`, `ShippingPhone`, `PaymentMethod`, `PaymentStatus`, `OrderStatus`, `createdAt`, `updatedAt`, `ProvinceCode`, `DistrictCode`, `WardCode`, `ProvinceName`, `DistrictName`, `WardName`, `ShippingCode`, `ExpectedDeliveryTime`) VALUES
(180, 2, '2025-01-16 19:42:44', '19010500.00', '20500.00', '111, Xã Tống Phan, Huyện Phù Cừ, Hưng Yên', '0398539955', 'cod', 'Completed', 'delivered', '2025-01-16 19:42:44', '2025-01-16 19:42:44', '268', '2194', '220713', 'Hưng Yên', 'Huyện Phù Cừ', 'Xã Tống Phan', NULL, NULL),
(181, 2, '2025-01-16 19:51:16', '27010499.00', '20500.00', '111, Xã Tống Phan, Huyện Phù Cừ, Hưng Yên', '0398539955', 'cod', 'Completed', 'delivered', '2025-01-16 19:51:16', '2025-01-16 19:51:16', '268', '2194', '220713', 'Hưng Yên', 'Huyện Phù Cừ', 'Xã Tống Phan', NULL, NULL),
(182, 2, '2025-01-16 19:58:52', '22510500.00', '20500.00', '111, Xã Tống Phan, Huyện Phù Cừ, Hưng Yên', '0398539955', 'cod', 'Completed', 'delivered', '2025-01-16 19:58:52', '2025-01-16 19:58:52', '268', '2194', '220713', 'Hưng Yên', 'Huyện Phù Cừ', 'Xã Tống Phan', NULL, NULL),
(184, 2, '2025-01-16 20:26:25', '25210500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-16 20:26:25', '2025-01-16 20:26:25', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', NULL, NULL),
(185, 2, '2025-01-16 21:18:10', '22510500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'vnpay', 'Processing', 'pending', '2025-01-16 21:18:10', '2025-01-16 21:18:10', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', NULL, NULL),
(186, 2, '2025-01-16 21:37:49', '90600500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-16 21:37:49', '2025-01-16 21:37:49', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', NULL, NULL),
(187, 7, '2025-01-16 22:14:15', '20501.00', '20500.00', '3, Xã Lùng Thẩn, Huyện Si Ma Cai, Lào Cai', '0398765432', 'cod', 'Pending', 'pending', '2025-01-16 22:14:15', '2025-01-16 22:14:15', '269', '2264', '800248', 'Lào Cai', 'Huyện Si Ma Cai', 'Xã Lùng Thẩn', NULL, NULL),
(188, 7, '2025-01-16 22:14:41', '43510500.00', '20500.00', '3, Xã Lùng Thẩn, Huyện Si Ma Cai, Lào Cai', '0398765432', 'vnpay', 'Completed', 'pending', '2025-01-16 22:14:41', '2025-01-16 22:15:24', '269', '2264', '800248', 'Lào Cai', 'Huyện Si Ma Cai', 'Xã Lùng Thẩn', NULL, NULL),
(189, 7, '2025-01-16 22:16:12', '19010500.00', '20500.00', '3, Xã Lùng Thẩn, Huyện Si Ma Cai, Lào Cai', '0398765432', 'vnpay', 'Completed', 'pending', '2025-01-16 22:16:12', '2025-01-16 22:17:07', '269', '2264', '800248', 'Lào Cai', 'Huyện Si Ma Cai', 'Xã Lùng Thẩn', NULL, NULL),
(192, 7, '2025-01-16 23:02:11', '93810500.00', '20500.00', '3, Xã Lùng Thẩn, Huyện Si Ma Cai, Lào Cai', '0398765432', 'cod', 'Pending', 'pending', '2025-01-16 23:02:11', '2025-01-16 23:02:11', '269', '2264', '800248', 'Lào Cai', 'Huyện Si Ma Cai', 'Xã Lùng Thẩn', NULL, NULL),
(193, 7, '2025-01-16 23:05:29', '20501.00', '20500.00', '3, Xã Lùng Thẩn, Huyện Si Ma Cai, Lào Cai', '0398765432', 'cod', 'Pending', 'pending', '2025-01-16 23:05:29', '2025-01-16 23:05:29', '269', '2264', '800248', 'Lào Cai', 'Huyện Si Ma Cai', 'Xã Lùng Thẩn', NULL, NULL),
(204, 7, '2025-01-16 23:27:25', '22510500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-16 23:27:25', '2025-01-16 23:27:27', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGWUH', '2025-01-18 16:59:59'),
(205, 7, '2025-01-16 23:30:00', '3610500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-16 23:30:00', '2025-01-16 23:30:02', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGWUX', '2025-01-18 16:59:59'),
(206, 7, '2025-01-16 23:30:35', '22510500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'vnpay', 'Processing', 'pending', '2025-01-16 23:30:35', '2025-01-16 23:30:36', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGWUA', '2025-01-18 16:59:59'),
(207, 7, '2025-01-16 23:32:33', '820499.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'vnpay', 'Processing', 'pending', '2025-01-16 23:32:33', '2025-01-16 23:32:34', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGWU8', '2025-01-18 16:59:59'),
(208, 7, '2025-01-16 23:37:25', '22510500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-16 23:37:25', '2025-01-16 23:37:27', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGWUY', '2025-01-18 16:59:59'),
(209, 7, '2025-01-16 23:37:49', '3610500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'vnpay', 'Processing', 'pending', '2025-01-16 23:37:49', '2025-01-16 23:37:50', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGWUR', '2025-01-18 16:59:59'),
(210, 7, '2025-01-16 23:40:32', '22510500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'vnpay', 'Processing', 'pending', '2025-01-16 23:40:32', '2025-01-16 23:40:33', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGWUM', '2025-01-18 16:59:59'),
(211, 7, '2025-01-16 23:44:21', '25210500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-16 23:44:21', '2025-01-16 23:44:23', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGWUE', '2025-01-18 16:59:59'),
(212, 7, '2025-01-16 23:44:46', '22510500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'vnpay', 'Completed', 'pending', '2025-01-16 23:44:46', '2025-01-16 23:45:17', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGWCQ', '2025-01-18 16:59:59'),
(213, 7, '2025-01-17 03:03:13', '43510500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-17 03:03:13', '2025-01-17 03:03:14', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGHF7', '2025-01-18 16:59:59'),
(214, 7, '2025-01-17 03:09:13', '3610500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-17 03:09:13', '2025-01-17 03:09:15', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGHFC', '2025-01-18 16:59:59'),
(215, 7, '2025-01-17 03:11:32', '3610500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-17 03:11:32', '2025-01-17 03:11:34', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGHF9', '2025-01-18 16:59:59'),
(216, 7, '2025-01-17 03:19:56', '7200500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-17 03:19:56', '2025-01-17 03:19:58', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGHFD', '2025-01-18 16:59:59'),
(217, 7, '2025-01-17 03:26:41', '3610500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-17 03:26:41', '2025-01-17 03:26:42', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGHGQ', '2025-01-18 16:59:59'),
(218, 7, '2025-01-17 03:28:23', '27010499.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-17 03:28:23', '2025-01-17 03:28:25', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGHGL', '2025-01-18 16:59:59'),
(222, 7, '2025-01-17 03:46:36', '67490500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-17 03:46:36', '2025-01-17 03:46:38', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGHG6', '2025-01-18 16:59:59'),
(223, 7, '2025-01-17 04:28:09', '45000500.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'cod', 'Pending', 'pending', '2025-01-17 04:28:09', '2025-01-17 04:28:10', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGHUX', '2025-01-18 16:59:59'),
(224, 7, '2025-01-17 04:28:19', '27010499.00', '20500.00', '3, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre', '0398765432', 'vnpay', 'Completed', 'pending', '2025-01-17 04:28:19', '2025-01-17 04:33:35', '213', '1975', '560901', 'Bến Tre', 'Huyện Mỏ Cày Nam', 'Thị trấn Mỏ Cày', 'LPGHUA', '2025-01-18 16:59:59'),
(225, 2, '2025-01-17 04:58:42', '22510500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-17 04:58:42', '2025-01-17 04:58:43', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGHCR', '2025-01-18 16:59:59'),
(226, 2, '2025-01-17 05:09:06', '137460500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'shipping', '2025-01-17 05:09:06', '2025-01-17 05:09:28', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGHCM', '2025-01-18 16:59:59'),
(227, 2, '2025-01-17 05:10:19', '3251500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-17 05:10:19', '2025-01-17 05:10:21', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGHCE', '2025-01-18 16:59:59'),
(228, 2, '2025-01-17 05:10:21', '3251500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-17 05:10:21', '2025-01-17 05:10:22', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGH9Q', '2025-01-18 16:59:59'),
(229, 2, '2025-01-17 05:26:31', '23010500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-17 05:26:31', '2025-01-17 05:26:33', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGH9F', '2025-01-18 16:59:59'),
(230, 2, '2025-01-17 05:34:30', '22010500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-17 05:34:30', '2025-01-17 05:34:32', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGH97', '2025-01-18 16:59:59'),
(231, 2, '2025-01-17 05:44:22', '44500500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-17 05:44:22', '2025-01-17 05:44:24', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGH9G', '2025-01-18 16:59:59'),
(232, 2, '2025-01-17 05:45:25', '3251500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-17 05:45:25', '2025-01-17 05:45:27', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGH9U', '2025-01-18 16:59:59'),
(233, 2, '2025-01-17 05:45:26', '3251500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-17 05:45:26', '2025-01-17 05:45:27', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGH9C', '2025-01-18 16:59:59'),
(234, 2, '2025-01-17 05:52:42', '3610500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-17 05:52:42', '2025-01-17 05:52:43', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGH9V', '2025-01-18 16:59:59'),
(235, 2, '2025-01-17 07:17:54', '34510500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'cod', 'Pending', 'pending', '2025-01-17 07:17:54', '2025-01-17 07:17:55', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGHX7', '2025-01-18 16:59:59'),
(236, 2, '2025-01-17 07:18:07', '3251500.00', '20500.00', '111, Phường 5, Thành phố Trà Vinh, Trà Vinh', '0398539955', 'vnpay', 'Completed', 'delivered', '2025-01-17 07:18:07', '2025-01-17 07:24:24', '214', '1560', '580105', 'Trà Vinh', 'Thành phố Trà Vinh', 'Phường 5', 'LPGHXG', '2025-01-18 16:59:59');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `ID` int NOT NULL,
  `OrderID` int DEFAULT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `PaymentMethod` enum('cod','banking','momo','vnpay') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PaymentStatus` enum('pending','completed','failed','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `TransactionID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `PaymentDate` timestamp NULL DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productcolors`
--

CREATE TABLE `productcolors` (
  `ColorID` int NOT NULL,
  `VariantID` int NOT NULL,
  `ColorName` varchar(50) NOT NULL,
  `ColorCode` varchar(10) NOT NULL,
  `Stock` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `productcolors`
--

INSERT INTO `productcolors` (`ColorID`, `VariantID`, `ColorName`, `ColorCode`, `Stock`) VALUES
(607, 492, 'Titan Sa Mạc', '#b0a093', 47),
(608, 492, 'Titan Trắng', '#f0f0f0', 99),
(609, 492, 'Titan Đen', '#393939', 99),
(610, 492, 'Titan Tự Nhiên', '#97948d', 99),
(611, 493, 'Titan Sa Mạc', '#b0a093', 99),
(612, 493, 'Titan Trắng', '#f0f0f0', 99),
(613, 493, 'Titan Đen', '#393939', 97),
(614, 493, 'Titan Tự Nhiên', '#97948d', 98),
(615, 494, 'Titan Sa Mạc', '#b0a093', 99),
(616, 494, 'Titan Trắng', '#f0f0f0', 96),
(617, 494, 'Titan Đen', '#393939', 99),
(618, 494, 'Titan Tự Nhiên', '#97948d', 99),
(619, 495, 'Hồng', '#eb9fd0', 68),
(620, 496, 'Xanh lá nhạt', '#f0f5e5', 64),
(621, 497, 'Tím', '#4f4c69', 86),
(622, 498, 'Titanium', '#6b6362', 51),
(623, 499, 'Đen', '#232428', 70),
(624, 500, 'Đen', '#000000', 98),
(625, 501, 'Trắng', '#f2f2f2', 97),
(626, 502, 'Bạc', '#c4c5c7', 95),
(627, 503, 'Bạc', '#d5d6d8', 99),
(628, 504, 'Tím', '#a59acc', 96),
(629, 505, 'Đen', '#3d3d3d', 96),
(630, 506, '11', '#333', 3),
(631, 506, '22', '#222', 7),
(632, 507, '22', ' #111', 7),
(633, 507, '11', '#444', 7),
(634, 508, 'Be', '#ggg', 3),
(635, 509, 'Đen', '#333', 2);

-- --------------------------------------------------------

--
-- Table structure for table `productimages`
--

CREATE TABLE `productimages` (
  `ImageID` int NOT NULL,
  `ColorID` int NOT NULL,
  `ImageURL` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `productimages`
--

INSERT INTO `productimages` (`ImageID`, `ColorID`, `ImageURL`) VALUES
(1749, 608, '1736074638255-1txrgph.jpg'),
(1750, 608, '1736074638258-aiia4p.jpg'),
(1751, 608, '1736074638261-fa59fd.jpg'),
(1752, 608, '1736074638262-eh87l.jpg'),
(1753, 608, '1736074638263-xjn4y8.jpg'),
(1754, 608, '1736074638266-er7tfa.jpg'),
(1755, 608, '1736074638267-fv5rn.jpg'),
(1756, 608, '1736074638269-v4yixy.jpg'),
(1757, 608, '1736074638270-lqvoai.jpg'),
(1758, 608, '1736074638272-j3b9zw.jpg'),
(1759, 609, '1736074716155-zglcuj.jpg'),
(1760, 609, '1736074716157-18pp5.jpg'),
(1761, 609, '1736074716159-4b9a7n.jpg'),
(1762, 609, '1736074716160-54b7n.jpg'),
(1763, 609, '1736074716162-rv6k6.jpg'),
(1764, 609, '1736074716163-a40uck.jpg'),
(1765, 609, '1736074716165-3uzugc.jpg'),
(1766, 609, '1736074716166-loa818.jpg'),
(1767, 609, '1736074716168-41wczk.jpg'),
(1768, 609, '1736074716169-yic8kd.jpg'),
(1769, 610, '1736074716172-173vhk.jpg'),
(1770, 610, '1736074716173-5i6etx.jpg'),
(1771, 610, '1736074716175-rmw67p.jpg'),
(1772, 610, '1736074716176-glbzq9.jpg'),
(1773, 610, '1736074716177-ucvvya.jpg'),
(1774, 610, '1736074716178-nmpffp.jpg'),
(1775, 610, '1736074716179-p5cbg8.jpg'),
(1776, 610, '1736074716180-azu4f.jpg'),
(1777, 610, '1736074716181-17qh25.jpg'),
(1778, 610, '1736074716182-6ecs22.jpg'),
(1779, 607, '1736074851319-dy0off.jpg'),
(1780, 607, '1736074851321-ckfj89.jpg'),
(1781, 607, '1736074851323-ottbcm.jpg'),
(1782, 607, '1736074851324-nbv1s.jpg'),
(1783, 607, '1736074851326-mxgc9q.jpg'),
(1784, 607, '1736074851327-2jz7ka.jpg'),
(1785, 607, '1736074851327-2ef38r.jpg'),
(1786, 607, '1736074851328-rtw0ap.jpg'),
(1787, 607, '1736074851330-cxcowd.jpg'),
(1788, 607, '1736074851330-th41hd.jpg'),
(1789, 611, '1736074996106-ybva2g.jpg'),
(1790, 611, '1736074996109-9o50dt.jpg'),
(1791, 611, '1736074996110-74rh2e.jpg'),
(1792, 611, '1736074996111-qvhsh9i.jpg'),
(1793, 611, '1736074996112-05j3y4.jpg'),
(1794, 611, '1736074996113-o7u7l.jpg'),
(1795, 611, '1736074996114-h5g7b1.jpg'),
(1796, 611, '1736074996115-9gnex.jpg'),
(1797, 611, '1736074996116-u17jq.jpg'),
(1798, 611, '1736074996117-ch5d5.jpg'),
(1799, 612, '1736074996120-rpsbkg.jpg'),
(1800, 612, '1736074996121-ysin99.jpg'),
(1801, 612, '1736074996122-l9zjv.jpg'),
(1802, 612, '1736074996123-2qxbew.jpg'),
(1803, 612, '1736074996125-too6nn.jpg'),
(1804, 612, '1736074996126-pthuz.jpg'),
(1805, 612, '1736074996127-zf0m4d.jpg'),
(1806, 612, '1736074996127-59mxm7.jpg'),
(1807, 612, '1736074996129-ian8x9.jpg'),
(1808, 612, '1736074996130-vqmg3a.jpg'),
(1809, 613, '1736074996132-f0dwju.jpg'),
(1810, 613, '1736074996134-waie1l.jpg'),
(1811, 613, '1736074996136-my7pcj.jpg'),
(1812, 613, '1736074996137-n0ushq.jpg'),
(1813, 613, '1736074996138-sunuo8.jpg'),
(1814, 613, '1736074996139-3ty4ph.jpg'),
(1815, 613, '1736074996140-bl6g4c.jpg'),
(1816, 613, '1736074996141-8e63wo.jpg'),
(1817, 613, '1736074996142-6ps3d3.jpg'),
(1818, 613, '1736074996143-2yihipf.jpg'),
(1819, 614, '1736074996145-xeu5zk.jpg'),
(1820, 614, '1736074996146-b6rkbl.jpg'),
(1821, 614, '1736074996147-7g58o9.jpg'),
(1822, 614, '1736074996149-vfx20l.jpg'),
(1823, 614, '1736074996150-8mkut.jpg'),
(1824, 614, '1736074996151-rseqrk.jpg'),
(1825, 614, '1736074996152-kr6gor.jpg'),
(1826, 614, '1736074996153-oeuu59.jpg'),
(1827, 614, '1736074996154-9nomhm.jpg'),
(1828, 614, '1736074996155-nesavd.jpg'),
(1829, 615, '1736079834978-24un8c.jpg'),
(1830, 615, '1736079834985-vp829pn.jpg'),
(1831, 615, '1736079834986-91mvt.jpg'),
(1832, 615, '1736079834988-sj1c1e.jpg'),
(1833, 615, '1736079834989-z5uaro.jpg'),
(1834, 615, '1736079834990-w02ckl.jpg'),
(1835, 615, '1736079834992-cytowy.jpg'),
(1836, 615, '1736079834994-c7b13n.jpg'),
(1837, 615, '1736079834995-92d219.jpg'),
(1838, 615, '1736079834997-681xvs.jpg'),
(1839, 616, '1736079834999-yy0a2.jpg'),
(1840, 616, '1736079835001-qax1pm.jpg'),
(1841, 616, '1736079835003-74gxua.jpg'),
(1842, 616, '1736079835005-ku2dmy.jpg'),
(1843, 616, '1736079835006-8399r.jpg'),
(1844, 616, '1736079835007-b3qcrm.jpg'),
(1845, 616, '1736079835008-b84s1d.jpg'),
(1846, 616, '1736079835009-buupbh.jpg'),
(1847, 616, '1736079835010-rrgnvo.jpg'),
(1848, 616, '1736079835012-ejdozq.jpg'),
(1849, 617, '1736079835014-9szsxp.jpg'),
(1850, 617, '1736079835016-gtg0ts.jpg'),
(1851, 617, '1736079835017-qabrq.jpg'),
(1852, 617, '1736079835018-pf3p5h.jpg'),
(1853, 617, '1736079835019-48wzpd.jpg'),
(1854, 617, '1736079835020-verzlp.jpg'),
(1855, 617, '1736079835022-dvis5.jpg'),
(1856, 617, '1736079835024-nhpxhq.jpg'),
(1857, 617, '1736079835025-xfygac.jpg'),
(1858, 617, '1736079835027-s3ko0y.jpg'),
(1859, 618, '1736079835029-6oofdo6.jpg'),
(1860, 618, '1736079835030-ha8fn4.jpg'),
(1861, 618, '1736079835031-tqo0qg.jpg'),
(1862, 618, '1736079835032-vvaqhc6.jpg'),
(1863, 618, '1736079835034-awpswc.jpg'),
(1864, 618, '1736079835035-9ag5.jpg'),
(1865, 618, '1736079835036-duim8j.jpg'),
(1866, 618, '1736079835037-1v2t75.jpg'),
(1867, 618, '1736079835038-w41tyy.jpg'),
(1868, 618, '1736079835040-f5zbae.jpg'),
(1869, 619, '705f69f3b4de97164abd08bd7a09ebcf-9786533823.jpg'),
(1870, 619, '0fab16410b4361099c4452ffc1270840-8885564557.jpg'),
(1871, 619, '269835470ea7fed1c26db558bb14ffc5-5865866803.jpg'),
(1872, 619, '3db76e3216280931a2a9dfe8f79781a6-3681386274.jpg'),
(1873, 619, '5fe60159e7c12e23bde1a259ecf149db-8776684278.jpg'),
(1874, 619, '21d9cb08fe4ead0f90bb147a65dbc623-8275841040.jpg'),
(1875, 619, 'bbcdef640c7a5683e487e1e89c67b6de-2043552101.jpg'),
(1876, 619, 'cd0782e062963cc9322698ebd7a8c457-4340356103.jpg'),
(1877, 619, '53186a442abee25aa8a416649c88b14f-8621539405.jpg'),
(1878, 619, '2fdc3a76417dc3d5d60c73e293202d65-6920572122.jpg'),
(1884, 620, '1736143065432-cyjdp6.jpg'),
(1885, 620, '1736143065435-2g1fq.jpg'),
(1886, 620, '1736143065437-wozaqa.jpg'),
(1887, 620, '1736143065438-mcy6ha.jpg'),
(1888, 620, '1736143065439-c9d31.jpg'),
(1889, 621, '42ee89ace82657447960a1d5283aa73e-2838918943.jpg'),
(1890, 621, '1c49d80380c30a2a58d68ddfab302c25-2261997664.jpg'),
(1891, 621, '8b59a83eb61e0c75806e60895eadaf83-9285809261.jpg'),
(1892, 621, '9532d9d65ad27c9436fb0892ea2415c7-1046056517.jpg'),
(1893, 621, '32997d169fe40a0b0e62b9896f58a3d6-4087882119.jpg'),
(1894, 621, 'ca37c0cde37f5338204eb30451fe4d2f-8527895870.jpg'),
(1895, 621, '246ccd43d9df6814e72fcad4db4abb9e-3495657920.jpg'),
(1896, 621, '9fa21c9a114cd9b181cb5d8bc14ddb91-1012212166.jpg'),
(1897, 621, '1dfdcf27d7a6688847e36f46be1fd739-7733640642.jpg'),
(1898, 621, '34b3e6528f414b88b8297313f91beb4c-7378447577.jpg'),
(1899, 622, '73453124e17735d2175be563ba8dbf3b-5457779074.jpg'),
(1900, 622, '773a24007d55935182dbe9b1d7a8dc3b-9950136080.jpg'),
(1901, 622, '9a987331956bc1cc01dd0033bc4af591-6708653951.jpg'),
(1902, 622, 'f84607a91d1958afdd6bc8a1c064062a-9847017155.jpg'),
(1903, 623, '564c94fdede48cfa945499e62cc4788d-2337861269.jpg'),
(1904, 623, '9309ee81711870dda3b8142776dabffb-7019807512.jpg'),
(1905, 623, '6b46544132ea570e3e5574df9e87f303-3699470379.jpg'),
(1906, 623, '30d2afb33826bf15d6199b67b35edaf6-5045799640.jpg'),
(1907, 623, '803b0259da774c3ed6014a5aaa20bd0c-5113090591.jpg'),
(1908, 623, '932079affa0c9c4c28d5428843da0625-1598901963.jpg'),
(1909, 623, '2072e12a308a4b9bea4033a4c7917579-3132644074.jpg'),
(1910, 623, 'c6ed1a031390b17a23d2d84d517a8b17-3731144711.jpg'),
(1911, 623, '2117b5cd2683e92b7fa3904c7672cdd2-1137120370.jpg'),
(1912, 623, '4b76b2fd644374b6b3a87d4d0e2fec6d-1955674648.jpg'),
(1913, 624, '686dff0c04827869ee76f897df6ca147-6775480383.jpg'),
(1914, 624, '7293740351ad7708ee7a85071b1b702d-4113711676.jpg'),
(1915, 624, '5e9d76b759ba059acbc9621e52b398eb-3300119479.jpg'),
(1916, 624, '9f6d6f433b0379527772c11b159cd101-4820468202.jpg'),
(1917, 624, 'c7aa59dd700a58ab752a13aa32e60592-6834624861.jpg'),
(1918, 624, '9206aa99bd2a69443871ff9f43aa6450-9426372214.jpg'),
(1919, 624, '93e996a4751abeb95f97b493f646cb03-1295788923.jpg'),
(1920, 624, 'fc6b25f2663abb85aaff3eb13dc748fc-4458868944.jpg'),
(1921, 624, 'be126d5a9df003712508d30afa5fc7f9-4615977221.jpg'),
(1922, 625, 'aa87d690180d681fed9ce005968383d9-6276508098.jpg'),
(1923, 625, '31b966021941a83981a7b380b4f0046e-9361359102.jpg'),
(1924, 625, '4a0cd53b22aea0dbe9547c3d8f4faf1f-7965283474.jpg'),
(1925, 625, '0bce8baed8842c5c474a2a4969f72fef-5770542271.jpg'),
(1926, 625, 'e5fee447b1a5137b324c3b7cf65ba83c-5237257481.jpg'),
(1927, 625, 'baa5e8f6ffdfd70438133848c4ca2e90-1804569270.jpg'),
(1928, 625, 'e0273bef0f72441aa11bc8ebdb9e10d8-1901219512.jpg'),
(1929, 625, '29776f9f5680407b99d11cf31db81c5b-2519040260.jpg'),
(1930, 625, 'bdb81d81f4f12e99af6b75962339832b-4055403415.jpg'),
(1931, 625, 'aa1d89872124eb2e001aebceaf94364f-6539310799.jpg'),
(1932, 626, 'c61656d95fb2835c35081230be898ae9-2361150642.jpg'),
(1933, 626, 'a8d46991d37defd0a4e41c3fe441b299-3628496716.jpg'),
(1934, 626, 'a54ec216f50214eb9216d063d89a9263-3620230838.jpg'),
(1935, 626, 'a975be918d72faa93b20496a1f0ad6c2-6457469876.jpg'),
(1936, 627, 'e7905b12d104b4ab9c7989ca3668d363-9453110352.jpg'),
(1937, 627, 'e5aba2a57ee7e5ef735db12a7235129e-2148222953.jpg'),
(1938, 627, 'cc3a2d779440289a027b77a7c71794de-5657175657.jpg'),
(1939, 627, '017787be9faca4a9d4c876291f4def3b-8687106424.jpg'),
(1940, 627, '1dbf61bab540b0172458cb9ea36d28ec-1497406345.jpg'),
(1941, 627, '8a019b9bc2ae4a5215de9a7e5d998964-6526881884.jpg'),
(1942, 627, '52319068ff8ea2fa01287f88bd7a6eda-2197148946.jpg'),
(1953, 628, '1736150153396-tepbwr.jpg'),
(1954, 628, '1736150153398-xgnsm4.jpg'),
(1955, 628, '1736150153400-sgdg3l.jpg'),
(1956, 628, '1736150153402-ugcppa.jpg'),
(1957, 628, '1736150153403-ewyni.jpg'),
(1958, 628, '1736150153404-4clgut.jpg'),
(1959, 628, '1736150153406-h3xpk3.jpg'),
(1960, 628, '1736150153407-sgvw4.jpg'),
(1961, 628, '1736150153408-votbi.jpg'),
(1962, 628, '1736150153409-js4rs5.jpg'),
(1963, 629, '38b49e67575202b3a0806e85db70aeb2-6364528632.jpg'),
(1964, 629, '4fcb53ce0f6de8f63859afaca9a75183-2767015730.jpg'),
(1965, 629, 'e22977900a5ea096a6ce01f794a9603f-9699115549.jpg'),
(1966, 629, 'b943a2f6cb7690f0da3c509c84fa7048-6507615107.jpg'),
(1967, 629, 'd50247757386c6ce489c525b897cb569-9065010430.jpg'),
(1968, 629, '332d5b7798371b90857e40455cc2bb80-2498085967.jpg'),
(1969, 629, '15b40a2fc88937a2cde401d5b694e621-4237834596.jpg'),
(1970, 629, '5f31199b73b6a2a7ba265fadbfea1cd5-8014626410.jpg'),
(1971, 629, '745280b7725bc469c0c3df510cfcc640-4449302526.jpg'),
(1972, 629, '5759c6c33eea646241cb5a0f3a296bcc-2615314816.jpg'),
(1973, 630, '91beadc83c98ec57b299907ffb6247c2-7458626577.png'),
(1974, 631, '1736316132022-m4pnjq.png'),
(1975, 632, '1736316132030-dze0io.png'),
(1976, 633, '1736316132034-bh41t.png'),
(1977, 634, '04e82c5902b4907699bbd0be1237dd18-4284767528.jpg'),
(1978, 634, '558698b8e67268e68b214cb4621af386-7541277594.jpg'),
(1979, 634, '997904ade827e2a3b5c21042d3f6c24f-5229480576.jpg'),
(1980, 634, '7912d0b6c96de47f723e19f8e041f880-4898439177.jpg'),
(1981, 634, '4f778dfa8ba585b1027261fcb9b6189b-1869010030.jpg'),
(1982, 635, 'c021cad7b29bf8739faff1659ff5c3b7-5637802707.jpg'),
(1983, 635, '22f1a85806553795b1973260adc6bd0d-1255985798.jpg'),
(1984, 635, 'b7cf00122743acdd10e8e794c2aa830b-1463571052.jpg'),
(1985, 635, 'b58f5e60e23132b7c3867708ced4ce5c-2706432351.jpg'),
(1986, 635, '625ac5144fcf646a38b964407ba71d90-9838415978.jpg'),
(1987, 635, '10b81beab4c02328db52db9537278110-8081723819.jpg'),
(1988, 635, '8c87ec1699870570a7e5c6c38f887d33-1881722750.jpg'),
(1989, 635, '3d04078c940e6f2605961600d1798407-7422165824.jpg'),
(1990, 635, '1dfb188503ae55a6b77b84ae42de4cfc-9674842613.jpg'),
(1991, 635, 'b96c56b37e1e9c4e242f6dfb9ededcfa-2998280554.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `ProductID` int NOT NULL,
  `CategoryID` int NOT NULL,
  `BrandID` int NOT NULL,
  `SupplierID` int NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Slug` varchar(255) NOT NULL,
  `Description` text,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Thumbnail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `CategoryID`, `BrandID`, `SupplierID`, `Name`, `Slug`, `Description`, `CreatedAt`, `Thumbnail`) VALUES
(418, 32, 26, 15, 'Điện Thoại iPhone 16 Pro Max', 'dien-thoai-iphone-16-pro-max', '<figure class=\"table\"><table><tbody><tr><td>Thông tin</td><td>Chi tiết</td></tr><tr><td>Hệ điều hành</td><td>iOS 18</td></tr><tr><td>Chip xử lý (CPU)</td><td>Apple A18 Pro 6 nhân</td></tr><tr><td>RAM</td><td>8 GB</td></tr><tr><td>Dung lượng lưu trữ</td><td>256 GB (khả dụng khoảng 241 GB)</td></tr><tr><td>Camera sau</td><td>Chính 48 MP &amp; Phụ 48 MP, 12 MP; hỗ trợ quay 4K 120fps, HDR, Night Mode, Cinematic, Macro</td></tr><tr><td>Camera trước</td><td>12 MP; hỗ trợ quay 4K, Cinematic, Night Mode</td></tr><tr><td>Màn hình</td><td>OLED, Super Retina XDR (1320 x 2868 Pixels), 6.9\", tần số quét 120 Hz, độ sáng tối đa 2000 nits</td></tr><tr><td>Dung lượng pin</td><td>Sử dụng 33 giờ; hỗ trợ sạc nhanh 20 W, sạc không dây MagSafe</td></tr><tr><td>Kết nối</td><td>5G, Wi-Fi 7, Bluetooth 5.3, Type-C, 1 Nano SIM &amp; 1 eSIM</td></tr><tr><td>Thiết kế &amp; Chất liệu</td><td>Nguyên khối, khung Titan, mặt lưng kính cường lực; kích thước: 163 x 77.6 x 8.25 mm, nặng 227 g</td></tr></tbody></table></figure>', '2025-01-05 10:56:04', 'c03c5bac554c54e39934c2a20e1f775c-2330404927.png'),
(419, 32, 26, 15, 'Điện Thoại iPhone 16 Plus', 'dien-thoai-iphone-16-plus', '<figure class=\"table\"><table><tbody><tr><td>Thông tin</td><td>Chi tiết</td></tr><tr><td>Hệ điều hành</td><td>iOS 18</td></tr><tr><td>Chip xử lý (CPU)</td><td>Apple A18 Pro 6 nhân</td></tr><tr><td>RAM</td><td>8 GB</td></tr><tr><td>Dung lượng lưu trữ</td><td>256 GB (khả dụng khoảng 241 GB)</td></tr><tr><td>Camera sau</td><td>Chính 48 MP &amp; Phụ 48 MP, 12 MP; hỗ trợ quay 4K 120fps, HDR, Night Mode, Cinematic, Macro</td></tr><tr><td>Camera trước</td><td>12 MP; hỗ trợ quay 4K, Cinematic, Night Mode</td></tr><tr><td>Màn hình</td><td>OLED, Super Retina XDR (1320 x 2868 Pixels), 6.9\", tần số quét 120 Hz, độ sáng tối đa 2000 nits</td></tr><tr><td>Dung lượng pin</td><td>Sử dụng 33 giờ; hỗ trợ sạc nhanh 20 W, sạc không dây MagSafe</td></tr><tr><td>Kết nối</td><td>5G, Wi-Fi 7, Bluetooth 5.3, Type-C, 1 Nano SIM &amp; 1 eSIM</td></tr><tr><td>Thiết kế &amp; Chất liệu</td><td>Nguyên khối, khung Titan, mặt lưng kính cường lực; kích thước: 163 x 77.6 x 8.25 mm, nặng 227 g</td></tr></tbody></table></figure>', '2025-01-06 03:12:41', '40ef2182a291e09b359088e1be603442-9726598527.png'),
(420, 32, 26, 15, 'Điện Thoại iPhone 15 Plus', 'dien-thoai-iphone-15-plus', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Hệ điều hành</td><td>iOS 17</td></tr><tr><td>Chip xử lý (CPU)</td><td>Apple A16 Bionic</td></tr><tr><td>Tốc độ CPU</td><td>3.46 GHz</td></tr><tr><td>Chip đồ họa (GPU)</td><td>Apple GPU 5 nhân</td></tr><tr><td>RAM</td><td>6 GB</td></tr><tr><td>Dung lượng lưu trữ</td><td>128 GB</td></tr><tr><td>Dung lượng khả dụng</td><td>Khoảng 113 GB</td></tr><tr><td>Danh bạ</td><td>Không giới hạn</td></tr></tbody></table></figure>', '2025-01-06 05:56:02', '95460aaf588b60f7495dc7db664e8a80-3145465819.png'),
(421, 32, 25, 14, 'Điện thoại Samsung Galaxy S24+ 5G', 'dien-thoai-samsung-galaxy-s24-5g', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Hệ điều hành</td><td>Android 14</td></tr><tr><td>Chip xử lý (CPU)</td><td>Exynos 2400</td></tr><tr><td>Tốc độ CPU</td><td>3.2 GHz</td></tr><tr><td>Chip đồ họa (GPU)</td><td>Xclipse 940</td></tr><tr><td>RAM</td><td>12 GB</td></tr><tr><td>Dung lượng lưu trữ</td><td>256 GB</td></tr><tr><td>Dung lượng khả dụng</td><td>Khoảng 231.2 GB</td></tr><tr><td>Danh bạ</td><td>Không giới hạn</td></tr></tbody></table></figure>', '2025-01-06 06:02:22', 'eefc5895f4dc9588ab62e112956e58e0-1129554492.png'),
(422, 36, 26, 15, 'Apple Watch Ultra 2 GPS + Cellular 49mm viền Titanium đen dây Alpine', 'apple-watch-ultra-2-gps-cellular-49mm-vien-titanium-den-day-alpine', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Công nghệ màn hình</td><td>OLED</td></tr><tr><td>Kích thước màn hình</td><td>1.92 inch</td></tr><tr><td>Độ phân giải</td><td>410 x 502 pixels</td></tr><tr><td>Kích thước mặt</td><td>49 mm</td></tr><tr><td>Chất liệu mặt</td><td>Kính Sapphire</td></tr><tr><td>Chất liệu khung viền</td><td>Titanium</td></tr><tr><td>Chất liệu dây</td><td>Dây vải</td></tr><tr><td>Độ rộng dây</td><td>Hãng không công bố</td></tr><tr><td>Chu vi cổ tay phù hợp</td><td>15.5 - 18.5 cm (Size M)</td></tr><tr><td>Khả năng thay dây</td><td>Có</td></tr><tr><td>Kích thước, khối lượng</td><td>Dài 49 mm - Ngang 44 mm - Dày 14.4 mm - Nặng 61.8 g</td></tr></tbody></table></figure>', '2025-01-06 06:07:16', 'bd7dbfc3c9acdf612cc574237d34afdb-9616932272.png'),
(423, 36, 27, 16, 'Đồng hồ thông minh Xiaomi Watch 2 47.8mm', 'dong-ho-thong-minh-xiaomi-watch-2-47-8mm', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Công nghệ màn hình</td><td>AMOLED</td></tr><tr><td>Kích thước màn hình</td><td>1.43 inch</td></tr><tr><td>Độ phân giải</td><td>466 x 466 pixels</td></tr><tr><td>Kích thước mặt</td><td>47.8 mm</td></tr><tr><td>Chất liệu mặt</td><td>Kính cường lực Gorilla Glass 3</td></tr><tr><td>Chất liệu khung viền</td><td>Nhôm</td></tr><tr><td>Chất liệu dây</td><td>Silicone</td></tr><tr><td>Độ rộng dây</td><td>2 cm</td></tr><tr><td>Chu vi cổ tay phù hợp</td><td>14 - 21 cm</td></tr><tr><td>Khả năng thay dây</td><td>Có</td></tr><tr><td>Kích thước, khối lượng</td><td>Dài 47.8 mm - Ngang 47.8 mm - Dày 14 mm - Nặng 36.68 g</td></tr></tbody></table></figure>', '2025-01-06 06:11:14', '501a5e59591ad84bd70e408b9de2c58b-8062028420.png'),
(424, 34, 26, 15, 'Laptop Apple MacBook Pro 16 inch Nano M4 Max 36GB/1TB', 'laptop-apple-macbook-pro-16-inch-nano-m4-max-36gb-1tb', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Công nghệ CPU</td><td>Apple M4 Max - Hãng không công bố</td></tr><tr><td>Số nhân</td><td>14</td></tr><tr><td>Số luồng</td><td>Hãng không công bố</td></tr><tr><td>Tốc độ CPU</td><td>410 GB/s memory bandwidth</td></tr><tr><td>Tốc độ tối đa</td><td>Hãng không công bố</td></tr><tr><td>RAM</td><td>36 GB</td></tr><tr><td>Loại RAM</td><td>Hãng không công bố</td></tr><tr><td>Tốc độ Bus RAM</td><td>Hãng không công bố</td></tr><tr><td>Hỗ trợ RAM tối đa</td><td>Hãng không công bố</td></tr><tr><td>Ổ cứng</td><td>1 TB SSD</td></tr></tbody></table></figure>', '2025-01-06 06:16:11', '100a6a44edae96ff9caa045009a64df6-4280373030.png'),
(425, 34, 29, 18, 'Laptop HP Envy 16 h0205TX i9 12900H/32GB/512GB/6GB RTX3060/Touch/Win11', 'laptop-hp-envy-16-h0205tx-i9-12900h-32gb-512gb-6gb-rtx3060-touch-win11', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Công nghệ CPU</td><td>Intel Core i9 Alder Lake - 12900H</td></tr><tr><td>Số nhân</td><td>14</td></tr><tr><td>Số luồng</td><td>20</td></tr><tr><td>Tốc độ CPU</td><td>2.5 GHz</td></tr><tr><td>Tốc độ tối đa</td><td>Turbo Boost 5.0 GHz</td></tr><tr><td>RAM</td><td>32 GB</td></tr><tr><td>Loại RAM</td><td>DDR5 (2 khe: 1 khe 16 GB + 1 khe 16 GB)</td></tr><tr><td>Tốc độ Bus RAM</td><td>4800 MHz</td></tr><tr><td>Hỗ trợ RAM tối đa</td><td>32 GB</td></tr><tr><td>Ổ cứng</td><td>512 GB SSD NVMe PCIe</td></tr><tr><td>Hỗ trợ mở rộng ổ cứng</td><td>Thêm 1 khe cắm SSD M.2 PCIe</td></tr></tbody></table></figure>', '2025-01-06 06:58:14', 'ad2f20e6368e7d0ff2b3f61726146d12-9492265298.png'),
(426, 33, 26, 15, 'Máy tính bảng iPad Pro M4 13 inch 5G', 'may-tinh-bang-ipad-pro-m4-13-inch-5g', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Công nghệ màn hình</td><td>Ultra Retina XDR</td></tr><tr><td>Độ phân giải</td><td>2064 x 2752 Pixels</td></tr><tr><td>Màn hình rộng</td><td>13\" - Tần số quét 120 Hz</td></tr><tr><td>Hệ điều hành</td><td>iPadOS 17</td></tr><tr><td>Chip xử lý (CPU)</td><td>Apple M4 9 nhân</td></tr><tr><td>Tốc độ CPU</td><td>Hãng không công bố</td></tr><tr><td>Chip đồ họa (GPU)</td><td>Apple GPU 10 nhân</td></tr></tbody></table></figure>', '2025-01-06 07:02:16', '6d049c3950045dd2842cd76288a159f4-9375636928.png'),
(427, 33, 25, 14, 'Máy tính bảng Samsung Galaxy Tab S10 Ultra 5G', 'may-tinh-bang-samsung-galaxy-tab-s10-ultra-5g', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Công nghệ màn hình</td><td>Dynamic AMOLED 2X</td></tr><tr><td>Độ phân giải</td><td>1848 x 2960 Pixels</td></tr><tr><td>Màn hình rộng</td><td>14.6\" - Tần số quét 120 Hz</td></tr><tr><td>Hệ điều hành</td><td>Android 14</td></tr><tr><td>Chip xử lý (CPU)</td><td>MediaTek Dimensity 9300+ 8 nhân</td></tr><tr><td>Tốc độ CPU</td><td>3.4 GHz</td></tr><tr><td>Chip đồ họa (GPU)</td><td>ARM Immortalis G720</td></tr></tbody></table></figure>', '2025-01-06 07:05:28', 'c79f0b8d40adc1670228351efe1e4835-5933112776.png'),
(428, 32, 29, 18, 'Điện Thoại OPPO Reno13 Pro 5G', 'dien-thoai-oppo-reno13-pro-5g', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Màn hình</td><td>AMOLED 6.67\" Full HD+</td></tr><tr><td>Hệ điều hành</td><td>Android 15</td></tr><tr><td>Camera sau</td><td>Chính 50 MP &amp; Phụ 8 MP, 2 MP</td></tr><tr><td>Camera trước</td><td>32 MP</td></tr><tr><td>Chip xử lý (CPU)</td><td>MediaTek Helio G100 8 nhân</td></tr><tr><td>RAM</td><td>8 GB</td></tr><tr><td>Dung lượng lưu trữ</td><td>256 GB</td></tr><tr><td>SIM</td><td>2 Nano SIM, Hỗ trợ 4G</td></tr><tr><td>Pin, Sạc</td><td>5800 mAh, Sạc nhanh 45 W</td></tr><tr><td>Hãng</td><td>OPPO</td></tr></tbody></table></figure>', '2025-01-06 07:54:41', '382107fb14fdf209c6cfc475382871db-9706266797.png'),
(430, 34, 28, 17, 'Laptop Asus ROG Flow X16 GV601VV i9 13900H/16GB/1TB/8GB RTX4060/240Hz/Touch/Pen/Win11', 'laptop-asus-rog-flow-x16-gv601vv-i9-13900h-16gb-1tb-8gb-rtx4060-240hz-touch-pen-win11', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Công nghệ CPU</td><td>Intel Core i9 Raptor Lake - 13900H</td></tr><tr><td>Số nhân</td><td>14</td></tr><tr><td>Số luồng</td><td>20</td></tr><tr><td>Tốc độ CPU</td><td>2.6 GHz</td></tr><tr><td>Tốc độ tối đa</td><td>Turbo Boost 5.40 GHz</td></tr><tr><td>RAM</td><td>16 GB</td></tr><tr><td>Loại RAM</td><td>DDR5 (2 khe: 1 khe 16 GB + 1 khe rời)</td></tr><tr><td>Tốc độ Bus RAM</td><td>4800 MHz</td></tr><tr><td>Hỗ trợ RAM tối đa</td><td>64 GB</td></tr><tr><td>Ổ cứng</td><td>1 TB SSD NVMe PCIe Gen 4</td></tr></tbody></table></figure>', '2025-01-06 13:51:15', '66982a6acdc1a9ceda575d7131376929-6716456539.png'),
(431, 32, 26, 15, 'test ', 'test', '<p>test1</p>', '2025-01-08 06:01:23', '91beadc83c98ec57b299907ffb6247c2-5040357998.png'),
(432, 32, 26, 15, 'One of your dependencies, babel-preset-react-app, is importing the', 'one-of-your-dependencies-babel-preset-react-app-is-importing-the', '<p>Thử</p>', '2025-01-16 03:59:18', '1c174e736d70bb30823af58cf79a9afe-5270072690.png'),
(433, 36, 29, 18, 'Đồng hồ CASIO 42 mm Nam MTP-1374D-1AVDF', 'dong-ho-casio-42-mm-nam-mtp-1374d-1avdf', '<figure class=\"table\"><table><tbody><tr><td>Thông số</td><td>Chi tiết</td></tr><tr><td>Thương hiệu</td><td>Apple</td></tr><tr><td>Model</td><td>Apple Watch Series 9</td></tr><tr><td>Kích thước màn hình</td><td>1.9 inch, Always-On Retina LTPO OLED, 396 x 484 pixels</td></tr><tr><td>Chất liệu màn hình</td><td>Sapphire Crystal</td></tr><tr><td>Chất liệu vỏ</td><td>Nhôm / Thép không gỉ / Titanium</td></tr><tr><td>Vi xử lý (CPU)</td><td>Apple S9 SiP</td></tr><tr><td>Bộ nhớ trong</td><td>64 GB</td></tr><tr><td>Hệ điều hành</td><td>watchOS 10</td></tr><tr><td>Kết nối</td><td>Wi-Fi, Bluetooth 5.3, GPS, NFC, Ultra-Wideband (UWB)</td></tr><tr><td>Chống nước</td><td>WR50 (Chịu nước ở độ sâu 50m)</td></tr><tr><td>Cảm biến</td><td>Cảm biến nhịp tim, oxy trong máu (SpO2), ECG, nhiệt độ</td></tr><tr><td>Thời lượng pin</td><td>Lên đến 18 giờ</td></tr><tr><td>Sạc nhanh</td><td>Có (USB-C Magnetic Fast Charger)</td></tr><tr><td>Tính năng nổi bật</td><td>SOS khẩn cấp, đo chu kỳ kinh nguyệt, phát hiện ngã, theo dõi giấc ngủ</td></tr><tr><td>Trọng lượng</td><td>32g (vỏ nhôm)</td></tr><tr><td>Màu sắc</td><td>Đen, Bạc, Hồng, Xanh lá, Vàng</td></tr></tbody></table></figure>', '2025-01-16 22:32:45', 'be6e30e4b59135fbd73be64139b8ba1f-5866554726.png');

-- --------------------------------------------------------

--
-- Table structure for table `productvariants`
--

CREATE TABLE `productvariants` (
  `VariantID` int NOT NULL,
  `ProductID` int NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `MemorySizeID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `productvariants`
--

INSERT INTO `productvariants` (`VariantID`, `ProductID`, `Price`, `MemorySizeID`) VALUES
(492, 418, '34990000.00', 29),
(493, 418, '40990000.00', 30),
(494, 418, '46990000.00', 31),
(495, 419, '25190000.00', 29),
(496, 420, '22990000.00', 28),
(497, 421, '26989999.00', 29),
(498, 422, '22490000.00', 45),
(499, 423, '3590000.00', 45),
(500, 424, '93790000.00', 31),
(501, 425, '65390000.00', 30),
(502, 426, '43490000.00', 29),
(503, 427, '35990000.00', 29),
(504, 428, '18990000.00', 29),
(505, 430, '50990000.00', 31),
(506, 431, '1.00', 31),
(507, 431, '2.00', 30),
(508, 432, '34990000.00', 31),
(509, 433, '799999.00', 45);

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `PromotionID` int NOT NULL,
  `Code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` text COLLATE utf8mb4_unicode_ci,
  `DiscountType` enum('Percentage','Fixed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `DiscountValue` decimal(10,2) NOT NULL,
  `MinimumOrder` decimal(10,2) NOT NULL,
  `MaximumDiscount` decimal(10,2) DEFAULT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL,
  `UsageLimit` int NOT NULL,
  `UsageCount` int DEFAULT '0',
  `Status` tinyint(1) DEFAULT '1',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`PromotionID`, `Code`, `Name`, `Description`, `DiscountType`, `DiscountValue`, `MinimumOrder`, `MaximumDiscount`, `StartDate`, `EndDate`, `UsageLimit`, `UsageCount`, `Status`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'SUMMER2024', 'Khuyến mãi hè 2024', 'Giảm giá 10% cho tất cả sản phẩm', 'Percentage', '10.00', '1000000.00', '500000.00', '2025-01-17 00:00:00', '2025-12-31 00:00:00', 100, 2, 1, '2025-01-17 04:52:39', '2025-01-17 07:15:23'),
(2, 'NEWUSER', 'Chào mừng thành viên mới', 'Giảm 200,000đ cho đơn hàng đầu tiên', 'Fixed', '200000.00', '500000.00', '200000.00', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1000, 0, 1, '2025-01-17 04:52:39', '2025-01-17 04:52:39');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `ReviewID` int NOT NULL,
  `ProductID` int NOT NULL,
  `UserID` int NOT NULL,
  `Rating` int DEFAULT NULL,
  `Comment` text,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `SupplierID` int NOT NULL,
  `Name` varchar(100) NOT NULL,
  `ContactInfo` text,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`SupplierID`, `Name`, `ContactInfo`, `CreatedAt`) VALUES
(14, 'Samsung Electronics', 'Samsung Electronics là một trong những tập đoàn công nghệ hàng đầu thế giới, chuyên cung cấp các sản phẩm điện tử và thiết bị di động với chất lượng vượt trội.', '2025-01-05 10:25:29'),
(15, 'Apple Inc', 'Apple nổi tiếng với các sản phẩm thiết kế sang trọng và hệ sinh thái độc quyền, mang lại trải nghiệm người dùng tuyệt vời.', '2025-01-05 10:25:45'),
(16, 'Xiaomi Corporation', 'Xiaomi cung cấp các sản phẩm công nghệ với giá cả phải chăng nhưng vẫn đảm bảo chất lượng và hiệu năng mạnh mẽ.', '2025-01-05 10:25:58'),
(17, 'Sony Corporation', 'Sony là thương hiệu hàng đầu về các thiết bị điện tử với sự chú trọng vào chất lượng âm thanh và hình ảnh vượt trội.', '2025-01-05 10:26:10'),
(18, 'Oppo Electronics', 'Oppo là thương hiệu nổi bật trong ngành công nghiệp smartphone, với thiết kế thời thượng và tính năng sáng tạo.', '2025-01-05 10:26:20');

-- --------------------------------------------------------

--
-- Table structure for table `transactionhistory`
--

CREATE TABLE `transactionhistory` (
  `TransactionID` int NOT NULL,
  `UserID` int NOT NULL,
  `OrderID` int NOT NULL,
  `TransactionDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Amount` decimal(10,2) NOT NULL,
  `PaymentMethod` enum('cod','banking','momo','vnpay') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int NOT NULL,
  `FullName` varchar(100) DEFAULT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Address` text,
  `Role` enum('Customer','Admin') DEFAULT 'Customer',
  `Status` varchar(50) DEFAULT 'active',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FullName`, `Email`, `PasswordHash`, `PhoneNumber`, `Address`, `Role`, `Status`, `CreatedAt`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$10$2qLEIfeuuvnYoryyk95MleMY0aybbrdWw7XGdJ93lNRa5wp3PyL.K', '0398989898', 'Trà Vinh', 'Admin', 'active', '2025-01-03 19:18:57'),
(2, 'Trần Trung Nghĩa', 'trantrungnghia@gmail.com', '$2b$10$tVc0jj/rl2PTl7uDohI02..wGFMKP994ASW3RW84XThsLYw8HhjxW', '0398539955', 'Trà Vinh', 'Customer', 'active', '2025-01-03 19:40:59'),
(7, 'Nghĩa', 'nghiatrandtnt2018@gmail.com', '$2b$10$UmnESoTp9NeMV6yGtwOK5OMmdBdHJFUjC3cA347c2CAbt.CCCc.q2', NULL, NULL, 'Customer', 'active', '2025-01-16 18:44:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`BrandID`),
  ADD UNIQUE KEY `Slug` (`Slug`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`CartID`),
  ADD UNIQUE KEY `unique_cart_item` (`UserID`,`VariantID`,`ColorID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `VariantID` (`VariantID`),
  ADD KEY `ColorID` (`ColorID`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CategoryID`),
  ADD UNIQUE KEY `Slug` (`Slug`);

--
-- Indexes for table `memorysizes`
--
ALTER TABLE `memorysizes`
  ADD PRIMARY KEY (`MemorySizeID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`OrderDetailID`),
  ADD KEY `OrderID` (`OrderID`),
  ADD KEY `VariantID` (`VariantID`),
  ADD KEY `ColorID` (`ColorID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `order_id` (`OrderID`);

--
-- Indexes for table `productcolors`
--
ALTER TABLE `productcolors`
  ADD PRIMARY KEY (`ColorID`),
  ADD KEY `productcolors_ibfk_1` (`VariantID`);

--
-- Indexes for table `productimages`
--
ALTER TABLE `productimages`
  ADD PRIMARY KEY (`ImageID`),
  ADD KEY `ColorID` (`ColorID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`),
  ADD UNIQUE KEY `Slug` (`Slug`),
  ADD KEY `CategoryID` (`CategoryID`),
  ADD KEY `BrandID` (`BrandID`),
  ADD KEY `products_ibfk_3` (`SupplierID`);

--
-- Indexes for table `productvariants`
--
ALTER TABLE `productvariants`
  ADD PRIMARY KEY (`VariantID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `MemorySizeID` (`MemorySizeID`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`PromotionID`),
  ADD UNIQUE KEY `Code` (`Code`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`ReviewID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`SupplierID`);

--
-- Indexes for table `transactionhistory`
--
ALTER TABLE `transactionhistory`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `OrderID` (`OrderID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `BrandID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `CartID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=244;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `CategoryID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `memorysizes`
--
ALTER TABLE `memorysizes`
  MODIFY `MemorySizeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `OrderDetailID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=230;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=237;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productcolors`
--
ALTER TABLE `productcolors`
  MODIFY `ColorID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=642;

--
-- AUTO_INCREMENT for table `productimages`
--
ALTER TABLE `productimages`
  MODIFY `ImageID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2052;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=434;

--
-- AUTO_INCREMENT for table `productvariants`
--
ALTER TABLE `productvariants`
  MODIFY `VariantID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=510;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `PromotionID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `ReviewID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `SupplierID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `transactionhistory`
--
ALTER TABLE `transactionhistory`
  MODIFY `TransactionID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`VariantID`) REFERENCES `productvariants` (`VariantID`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_ibfk_3` FOREIGN KEY (`ColorID`) REFERENCES `productcolors` (`ColorID`) ON DELETE CASCADE;

--
-- Constraints for table `memorysizes`
--
ALTER TABLE `memorysizes`
  ADD CONSTRAINT `memorysizes_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`);

--
-- Constraints for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  ADD CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`VariantID`) REFERENCES `productvariants` (`VariantID`),
  ADD CONSTRAINT `orderdetails_ibfk_3` FOREIGN KEY (`ColorID`) REFERENCES `productcolors` (`ColorID`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE CASCADE;

--
-- Constraints for table `productcolors`
--
ALTER TABLE `productcolors`
  ADD CONSTRAINT `productcolors_ibfk_1` FOREIGN KEY (`VariantID`) REFERENCES `productvariants` (`VariantID`);

--
-- Constraints for table `productimages`
--
ALTER TABLE `productimages`
  ADD CONSTRAINT `productimages_ibfk_1` FOREIGN KEY (`ColorID`) REFERENCES `productcolors` (`ColorID`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`BrandID`) REFERENCES `brands` (`BrandID`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`SupplierID`) REFERENCES `suppliers` (`SupplierID`);

--
-- Constraints for table `productvariants`
--
ALTER TABLE `productvariants`
  ADD CONSTRAINT `productvariants_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`),
  ADD CONSTRAINT `productvariants_ibfk_2` FOREIGN KEY (`MemorySizeID`) REFERENCES `memorysizes` (`MemorySizeID`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `transactionhistory`
--
ALTER TABLE `transactionhistory`
  ADD CONSTRAINT `transactionhistory_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `transactionhistory_ibfk_2` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
