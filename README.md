# Website Thương mại điện tử bán đồ công nghệ

![ReactJS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

## Thông tin dự án

-   **Tên dự án**: Website Thương mại điện tử bán đồ công nghệ
-   **Công nghệ**: ReactJS, NodeJS, ExpressJS, MySQL
-   **Người thực hiện**: Trần Trung Nghĩa
-   **MSSV**: 110121066
-   **Lớp**: DA21TTB (Công nghệ thông tin B)
-   **Email**: trungnghia414345@gmail.com
-   **Giảng viên hướng dẫn**: ThS. Nguyễn Ngọc Đan Thanh

## Mô tả dự án

Website thương mại điện tử chuyên bán các sản phẩm công nghệ với đầy đủ tính năng cho cả người dùng và quản trị viên.

### Tính năng chính

#### Phần người dùng (Client)

-   Đăng ký, đăng nhập, quên mật khẩu
-   Xem danh sách sản phẩm và tìm kiếm
-   Lọc sản phẩm theo danh mục, giá, thương hiệu
-   Xem chi tiết sản phẩm
-   Giỏ hàng và thanh toán
-   Theo dõi đơn hàng
-   Đánh giá và bình luận sản phẩm
-   Quản lý thông tin cá nhân

#### Phần quản trị (Admin)

-   Quản lý sản phẩm (CRUD)
-   Quản lý danh mục
-   Quản lý đơn hàng
-   Quản lý người dùng
-   Thống kê doanh thu
-   Quản lý khuyến mãi

## Cấu trúc dự án

-   **Client**: ReactJS
-   **Server**: NodeJS, ExpressJS
-   **Database**: MySQL

## Cài đặt và Chạy dự án

### Yêu cầu hệ thống

-   Node.js (v14 trở lên)
-   MySQL (v8.0 trở lên)

### Các bước cài đặt

1. Clone dự án

```bash
git clone https://github.com/trantrungnghia414/cn-da21ttb-trantrungnghia-ecommercewebsite-reactjs
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

5. Cấu hình database

-   Import file `src/database/ecommanagement.sql` vào MySQL
-   Cấu hình thông tin kết nối trong file `.env`

### Chạy dự án

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

Chi tiết API có thể xem trong file `src/database/structure_api.txt`

## Công nghệ sử dụng

### Frontend

-   ReactJS
-   TailwindCSS
-   Axios
-   React Router
-   React Hot Toast
-   CKEditor
-   Swiper

### Backend

-   Node.js
-   Express.js
-   MySQL
-   Sequelize ORM
-   JWT Authentication
-   Multer
-   CORS

## Tính năng nổi bật

1. **Quản lý sản phẩm đa dạng**

    - Hỗ trợ nhiều biến thể sản phẩm (màu sắc, dung lượng)
    - Upload nhiều hình ảnh cho mỗi màu sắc
    - Mô tả sản phẩm với rich text editor

2. **Thanh toán đa dạng**

    - Thanh toán khi nhận hàng (COD)
    - Thanh toán qua VNPay

3. **Tích hợp giao hàng**

    - Tích hợp API Giao Hàng Nhanh (GHN)
    - Tính phí vận chuyển tự động
    - Theo dõi đơn hàng realtime

4. **Bảo mật**
    - JWT Authentication
    - Phân quyền admin/user
    - Bảo vệ route

## Người đóng góp

<div>
    <a href="https://github.com/trantrungnghia414">
        <img src="https://avatars.githubusercontent.com/trantrungnghia414" width="100px;" alt="Trần Trung Nghĩa" style="border-radius: 50%;"/>
        <br />
        <sub style="text-decoration: none; color: white; font-size: 16px;"><b>Trần Trung Nghĩa</b></sub>
      </a>
</div>

## License

[MIT License](LICENSE)
