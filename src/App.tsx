import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Vendors } from './Pages/Customer/Vendors/Vendors';
import { Landing } from './Pages/Customer/Landing/Landing';
import { Vendor } from './Pages/Customer/Vendor/Vendor';
import { ProductDetail } from './Pages/Customer/ProductDetail/ProductDetail';
import { SignIn } from './Pages/Auth/SignIn';
import { Register } from './Pages/Auth/Register';
import { NavigationBar } from './Components/NavigationBar/NavigationBar';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Cart from './Pages/Customer/Cart/Cart';
import './App.css';
import type { ReactNode } from 'react';
import { Orders } from './Pages/Customer/Orders/Orders';
import { ShopPage } from './Pages/Shop/Shop Page/ShopPage';

// Protected route component
interface ProtectedRouteProps {
  children: ReactNode;
}



function App() {

  const hostname = window.location.hostname;

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const ShopProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isShopAuthenticated } = useAuth();

    if (!isShopAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const CustomerApp = () => {
    return (

      <CartProvider>
        <div className='layout'>
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendor/:vendorId" element={<Vendor />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
            />
          </Routes>
        </div>
      </CartProvider>
    )
  }

  const ShopApp = () => {
    return (
      <div className='layout'>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/" element={
            <ShopProtectedRoute>
              <ShopPage />
            </ShopProtectedRoute>
          }>
            
          </Route>
        </Routes>
      </div>
    )
  }

  const ActiveApp = () => {
    if (hostname.includes("shop")) {
      return <ShopApp />
    } else {
      return <CustomerApp />
    }
  }

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ActiveApp />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
