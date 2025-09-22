import { useState, useEffect } from 'react';
import styles from './NavigationBar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (

    <nav className={styles.container}>
      <div className={styles.navWrapper}>
        <Link to="/">
          <div className={styles.logo}>
            <h2>CAFECART</h2>
          </div>
        </Link>

        {isMobile && (
          <button
            className={`${styles.menuButton} ${isMenuOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}

        <div className={`${styles.registeration_btns} ${isMobile ? (isMenuOpen ? styles.menuOpen : styles.menuClosed) : ''}`}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                {user?.email || 'My Account'}
              </button>
              {showUserMenu && (
                <div className={styles.dropdownMenu}>
                  <Link to="/cart" className={styles.dropdownItem}>
                    My Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </Link>
                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.signin_btn}>
                Sign In
              </Link>
              <Link to="/register" className={styles.register_btn}>
                Register
              </Link>
              {/* {isAuthenticated && <Link
                to="/cart"
                className={styles.cartLink}
                aria-label={`Shopping Cart (${items.length} items)`}
              >
                <span className={styles.cartIcon}>🛒</span>
                {items.length > 0 && (
                  <span className={styles.cartBadge}>{items.length}</span>
                )}
              </Link>} */}
            </>
          )}
        </div>
      </div>
    </nav>

  );
}
