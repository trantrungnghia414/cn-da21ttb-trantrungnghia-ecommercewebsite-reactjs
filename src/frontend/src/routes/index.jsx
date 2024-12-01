import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart'; 
const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/products',
    element: <Products />
  },
  {
    path: '/products/:id',
    element: <ProductDetail />
  },
  {
    path: '/cart',
    element: <Cart />
  }
];

export default routes;
