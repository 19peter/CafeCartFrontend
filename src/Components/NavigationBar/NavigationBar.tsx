import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './NavigationBar.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { isAuthenticated, logout } = useAuth();
  const { items, shopName } = useCart();
  const navigate = useNavigate();
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle clicks outside user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isMobile]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      logout();
      setShowUserMenu(false);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  const totalItems = items.length;

  return (
    <nav className={styles.container}>
      <div className={styles.navWrapper}>
        {/* Logo */}
        <div 
          className={styles.logo}
          onClick={() => handleNavigation('/')}
          style={{ cursor: 'pointer' }}
        >
          CAFECART
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className={styles.registeration_btns}>
            {isAuthenticated ? (
              <>

                <div className={styles.userMenu} ref={userMenuRef}>
                  <button
                    className={`${styles.userButton} ${styles.register_btn}`}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    My Account
                  </button>

                  {showUserMenu && (
                    <div className={styles.dropdownMenu}>
                      {shopName && (
                        <div className={styles.shopName}>
                          {shopName}
                        </div>
                      )}
                      
                      <a
                        href="/cart"
                        className={styles.dropdownItem}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation('/cart');
                        }}
                      >
                        My Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                      </a>

                      <a
                        href="/orders"
                        className={styles.dropdownItem}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation('/orders');
                        }}
                      >
                        My Orders
                      </a>

                      <div 
                        className={styles.logoutDiv}
                        onClick={handleLogout}
                      >
                        Logout
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  className={`${styles.signin_btn}`}
                  onClick={() => handleNavigation('/login')}
                >
                  Sign In
                </button>
                <button
                  className={`${styles.register_btn}`}
                  onClick={() => handleNavigation('/register')}
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className={`${styles.menuButton} ${isMenuOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <>
          <div
            className={`${styles.mobileMenuOverlay} ${isMenuOpen ? styles.open : ''}`}
            onClick={() => setIsMenuOpen(false)}
          />

          <div
            className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}
            ref={mobileMenuRef}
          >
            <div className={styles.mobileMenuContent}>
              {isAuthenticated ? (
                <>
                  {shopName && (
                    <div className={styles.mobileShopName}>
                      {shopName}
                    </div>
                  )}

                  <button
                    className={styles.mobileMenuItem}
                    onClick={() => handleNavigation('/cart')}
                  >
                    My Cart
                    {totalItems > 0 && (
                      <span className={styles.mobileCartBadge}>
                        {totalItems}
                      </span>
                    )}
                  </button>

                  <button
                    className={styles.mobileMenuItem}
                    onClick={() => handleNavigation('/orders')}
                  >
                    My Orders
                  </button>

                  <div className={styles.mobileDivider} />

                  <button
                    className={styles.mobileMenuItem}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className={styles.mobileAuthButtons}>
                  <button
                    className={styles.signin_btn}
                    onClick={() => handleNavigation('/signin')}
                  >
                    Sign In
                  </button>
                  <button
                    className={styles.register_btn}
                    onClick={() => handleNavigation('/register')}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};