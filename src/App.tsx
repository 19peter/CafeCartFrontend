import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Vendors } from './Pages/Vendors/Vendors';
import { Landing } from './Pages/Landing/Landing';
import { Vendor } from './Pages/Vendor/Vendor';
import { ProductDetail } from './Pages/ProductDetail/ProductDetail';
import { SignIn } from './Pages/Auth/SignIn';
import { Register } from './Pages/Auth/Register';
import { NavigationBar } from './Components/NavigationBar/NavigationBar';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Cart from './Pages/Cart/Cart';
import './App.css';
import type { ReactNode } from 'react';
import { Orders } from './Pages/Orders/Orders';

// Protected route component
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
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
                <Route 
                  path="/cart" 
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } 
                />
                {/* Add more routes as needed */}
              </Routes>
            </div>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
