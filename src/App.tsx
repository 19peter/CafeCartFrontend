import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Vendors } from './Pages/Customer/Vendors/Vendors';
import { Landing } from './Pages/Customer/Landing/Landing';
import { Vendor } from './Pages/Customer/Vendor/Vendor';
import { ProductDetail } from './Pages/Customer/ProductDetail/ProductDetail';
import { SignIn } from './Pages/Auth/SignIn';
import { Register } from './Pages/Auth/Register';
import { ForgotPassword } from './Pages/Auth/ForgotPassword';
import { ResetPassword } from './Pages/Auth/ResetPassword';
import PrivacyPolicy from './Pages/Legal/PrivacyPolicy';
import TermsOfService from './Pages/Legal/TermsOfService';
import { NavigationBar } from './Components/NavigationBar/NavigationBar';
import { NotificationProvider } from './contexts/NotificationContext';
import { CustomerAuthProvider, useCustomerAuth } from './contexts/CustomerAuthContext';
import { ShopAuthProvider, useShopAuth } from './contexts/ShopAuthContext';
import { VendorAuthProvider, useVendorAuth } from './contexts/VendorAuthContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';

import { CartProvider } from './contexts/CartContext';
import Cart from './Pages/Customer/Cart/Cart';
import './App.css';
import type { ReactNode } from 'react';
import { Orders } from './Pages/Customer/Orders/Orders';
import { ShopPage } from './Pages/Shop/ShopPage';
import { VendorAccessPage } from './Pages/VendorAccess/VendorAccessPage';
import { AdminDashboard } from './Pages/Admin/AdminDashboard/AdminDashboard';
import NotFound from './Pages/Shared/NotFound';
import { Footer } from './Components/Footer/Footer';
import { ScrollToTop } from './Components/ScrollToTop/ScrollToTop';
import { OrderSuccess } from './Pages/Customer/OrderSuccess/OrderSuccess';
import { AuthModal } from './Components/AuthModal/AuthModal';

interface ProtectedRouteProps {
  children: ReactNode;
}



function App() {

  const hostname = window.location.hostname;

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useCustomerAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const ShopProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isShopAuthenticated } = useShopAuth();

    if (!isShopAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const VendorProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isVendorAuthenticated } = useVendorAuth();

    if (!isVendorAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  /* Placeholder for Admin Protected Route - can be refined when Admin roles are ready */
  const AdminProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAdminAuthenticated } = useAdminAuth();

    if (!isAdminAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const CustomerApp = () => {
    const { openAuthModal, setOpenAuthModal, login, loading, error, forgotPassword, resetPassword } = useCustomerAuth();
    return (

      <CartProvider>
        <div className='layout'>
          <NavigationBar />
          <AuthModal
            isOpen={openAuthModal}
            onClose={() => setOpenAuthModal(false)} />
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<SignIn login={login} loading={loading} error={error} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword forgotPassword={forgotPassword} loading={loading} error={error} />} />
            <Route path="/reset-password" element={<ResetPassword resetPassword={resetPassword} loading={loading} error={error} />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendor/:vendorId" element={<Vendor />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
            />
          </Routes>
          <Footer />

        </div>
      </CartProvider>
    )
  }

  const ShopApp = () => {
    const { login, loading, error, forgotPassword, resetPassword } = useShopAuth();
    return (
      <div className='layout'>
        <Routes>
          <Route path="/login" element={<SignIn login={login} loading={loading} error={error} />} />
          <Route path="/forgot-password" element={<ForgotPassword forgotPassword={forgotPassword} loading={loading} error={error} />} />
          <Route path="/reset-password" element={<ResetPassword resetPassword={resetPassword} loading={loading} error={error} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/" element={
            <ShopProtectedRoute>
              <ShopPage />
            </ShopProtectedRoute>
          } />
        </Routes>
      </div>
    )
  }

  const VendorApp = () => {
    const { login, loading, error, forgotPassword, resetPassword } = useVendorAuth();
    return (
      <div className='layout'>
        <Routes>
          <Route path="/login" element={<SignIn login={login} loading={loading} error={error} />} />
          <Route path="/forgot-password" element={<ForgotPassword forgotPassword={forgotPassword} loading={loading} error={error} />} />
          <Route path="/reset-password" element={<ResetPassword resetPassword={resetPassword} loading={loading} error={error} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/" element={
            <VendorProtectedRoute>
              <VendorAccessPage />
            </VendorProtectedRoute>
          } />
        </Routes>
      </div>
    )
  }

  const AdminApp = () => {
    const { login, loading, error, forgotPassword, resetPassword } = useAdminAuth();
    return (
      <div className='layout'>
        <Routes>
          <Route path="/login" element={<SignIn login={login} loading={loading} error={error} />} />
          <Route path="/forgot-password" element={<ForgotPassword forgotPassword={forgotPassword} loading={loading} error={error} />} />
          <Route path="/reset-password" element={<ResetPassword resetPassword={resetPassword} loading={loading} error={error} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
        </Routes>
      </div>
    )
  }

  const ActiveApp = () => {
    if (hostname.includes("shop")) {
      return (
        <ShopAuthProvider>
          <ShopApp />
        </ShopAuthProvider>
      )
    } else if (hostname.includes("vendor")) {
      return (
        <VendorAuthProvider>
          <VendorApp />
        </VendorAuthProvider>
      )
    } else if (hostname.includes("admin")) {
      return (
        <AdminAuthProvider>
          <AdminApp />
        </AdminAuthProvider>
      )
    } else {
      return (
        <CustomerAuthProvider>
          <CustomerApp />
        </CustomerAuthProvider>
      )
    }
  }

  return (
    <Router>
      <ScrollToTop />
      <NotificationProvider>
        <ActiveApp />
      </NotificationProvider>
    </Router>
  );
}

export default App;
