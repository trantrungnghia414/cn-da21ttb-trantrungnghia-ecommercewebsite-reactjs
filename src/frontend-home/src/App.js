import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </AuthProvider>
      <Toaster />
    </Router>
  );
}

export default App;
