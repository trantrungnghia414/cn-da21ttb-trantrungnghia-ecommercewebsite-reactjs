
import Login from '~/pages/auth/Login';
import Register from '~/pages/auth/Register';
import Cart from '~/pages/Cart';
import Home from '~/pages/Home';
import ProductDetail from '~/pages/ProductDetail';
import Products from '~/pages/Products';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/products',
    element: <Products />,
  },
  {
    path: '/products/:id',
    element: <ProductDetail />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
];

export default routes;
