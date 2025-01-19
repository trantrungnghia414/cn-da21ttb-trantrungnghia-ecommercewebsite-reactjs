import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'react-hot-toast';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderFailed from './pages/OrderFailed';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/order-failed" element={<OrderFailed />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
      <Toaster />
    </Router>
  );
}

export default App;
