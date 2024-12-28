import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';

// Pages
import Home from '../pages/Dashboard/Home';
import ProductList from '../pages/Products/ProductList';
import ProductCreate from '../pages/Products/ProductCreate';
import ProductDetail from '../pages/Products/ProductDetail';
import ProductEdit from '../pages/Products/ProductEdit';
import CategoryList from '../pages/Categories/CategoryList';
import CategoryForm from '../pages/Categories/CategoryForm';
import OrderList from '../pages/Orders/OrderList';
import OrderDetail from '../pages/Orders/OrderDetail';
import UserList from '../pages/Users/UserList';
import PromotionList from '../pages/Promotions/PromotionList';
import PromotionForm from '../pages/Promotions/PromotionForm';
import BrandList from '~/pages/Brands/BrandList';
import BrandForm from '~/pages/Brands/BrandForm';
import SupplierList from '~/pages/Suppliers/SupplierList';
import SupplierForm from '~/pages/Suppliers/SupplierForm';
import MemorySizeList from '~/pages/MemorySize/MemorySizeList';
import MemorySizeForm from '~/pages/MemorySize/MemorySizeForm';

// Error Page
const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-lg text-gray-600 mb-8">Trang bạn đang tìm kiếm không tồn tại.</p>
        <a href="/admin" className="text-blue-600 hover:text-blue-800">
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin" replace />
  },
  {
    path: '/admin',
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />
      },
      // Products
      {
        path: 'products',
        children: [
          {
            path: '',
            element: <ProductList />
          },
          {
            path: 'create',
            element: <ProductCreate />
          },
          {
            path: 'edit/:slug',
            element: <ProductEdit />
          },
          {
            path: 'detail/:slug',
            element: <ProductDetail />
          }
        ]
      },
      // Categories
      {
        path: 'categories',
        children: [
          {
            path: '',
            element: <CategoryList />
          },
          {
            path: 'create',
            element: <CategoryForm />
          },
          {
            path: 'edit/:slug',
            element: <CategoryForm />
          }
        ]
      },
      // Memory Sizes
      {
        path: 'memorysizes',
        children: [
          {
            path: '',
            element: <MemorySizeList />
          },
          {
            path: 'create',
            element: <MemorySizeForm />
          },
          {
            path: 'edit/:memorySizeID',
            element: <MemorySizeForm />
          }
        ]
      },
      // Brands
      {
        path: 'brands',
        children: [
          {
            path: '',
            element: <BrandList />
          },
          {
            path: 'create',
            element: <BrandForm />
          },
          {
            path: 'edit/:slug',
            element: <BrandForm />
          }
        ]
      },
      // Suppliers
      {
        path: 'suppliers',
        children: [
          {
            path: '',
            element: <SupplierList />
          },
          {
            path: 'create',
            element: <SupplierForm />
          },
          {
            path: 'edit/:id',
            element: <SupplierForm />
          }
        ]
      },
      // Orders
      {
        path: 'orders',
        children: [
          {
            path: '',
            element: <OrderList />
          },
          {
            path: ':id',
            element: <OrderDetail />
          }
        ]
      },
      // Users
      {
        path: 'users',
        element: <UserList />
      },
      // Promotions
      {
        path: 'promotions',
        children: [
          {
            path: '',
            element: <PromotionList />
          },
          {
            path: 'create',
            element: <PromotionForm />
          },
          {
            path: 'edit/:id',
            element: <PromotionForm />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <ErrorPage />
  }
]);

export default router;
