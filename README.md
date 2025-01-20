# Website Thương mại điện tử bán đồ công nghệ

![Logo](src/frontend-dashboard/src/assets/images/logo.png)

Một website thương mại điện tử hiện đại để bán các sản phẩm công nghệ, với đầy đủ tính năng cho cả người dùng và quản trị viên.

## Tính năng chính

### 🛍️ Phần người dùng (Client)

-   Đăng ký, đăng nhập và quên mật khẩu
-   Xem danh sách sản phẩm và tìm kiếm
-   Lọc sản phẩm theo danh mục, giá, thương hiệu
-   Xem chi tiết sản phẩm với nhiều biến thể (màu sắc, dung lượng)
-   Giỏ hàng và thanh toán
-   Theo dõi đơn hàng
-   Đánh giá và bình luận sản phẩm
-   Quản lý thông tin cá nhân

### 👨‍💼 Phần quản trị (Admin)

-   Quản lý sản phẩm (CRUD)
-   Quản lý danh mục
-   Quản lý đơn hàng
-   Quản lý người dùng
-   Thống kê doanh thu
-   Quản lý khuyến mãi

## Công nghệ sử dụng

### Frontend

-   React.js
-   Tailwind CSS
-   CKEditor 5
-   Swiper
-   Axios

### Backend

-   Node.js
-   Express.js
-   MySQL
-   Sequelize ORM
-   Multer

## Cấu trúc dự án

```bash
src/
├── frontend-home/ # Frontend cho người dùng
├── frontend-dashboard/ # Frontend cho admin
└── backend/ # Backend API
├── assets/ # Static files
├── controllers/ # Logic xử lý
├── middlewares/ # Middleware
├── models/ # Database models
└── routes/ # API routes
```

## Cài đặt

1. Clone repository

```bash
git clone https://github.com/your-username/cn-da21ttb-trantrungnghia-ecommercewebsite-reactjs.git
```

2. Cài đặt dependencies cho backend

```bash
cd backend
npm install
```

3. Cài đặt dependencies cho frontend người dùng

```bash
cd frontend-home
npm install
```

4. Cài đặt dependencies cho frontend admin

```bash
cd frontend-dashboard
npm install
```

5. Tạo file .env trong thư mục backend và cấu hình các biến môi trường

6. Import database

```bash
mysql src/database/ecommanagement.sql
```

## Khởi chạy dự án

1. Chạy backend

```bash
cd backend
npm start
```

2. Chạy frontend người dùng

```bash
cd frontend-home
npm start
```

3. Chạy frontend admin

```bash
cd frontend-dashboard
npm start
```

## API Documentation

Chi tiết về các API endpoints có thể được tìm thấy trong `src/database/structure_api.txt`

## Database Schema

Chi tiết về cấu trúc database có thể được tìm thấy trong `src/database/describe_db.txt`

## Contributing

Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết về quy trình đóng góp cho dự án.

## License

[MIT](LICENSE)