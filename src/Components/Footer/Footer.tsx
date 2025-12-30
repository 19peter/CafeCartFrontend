import { useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                {/* Brand Section */}
                <div className={styles.footerSection}>
                    <div className={styles.logo} onClick={() => handleNavigation('/')}>
                        <div className={styles.iconContainer}>
                            <Coffee size={20} className={styles.logoIcon} strokeWidth={2.5} />
                        </div>
                        <div className={styles.logoText}>
                            <span className={styles.logoPart1}>CAFE</span>
                            <span className={styles.logoPart2}>CART</span>
                        </div>
                    </div>
                    <p className={styles.brandDesc}>
                        Bringing the finest local roasts and artisanal pastries directly to your doorstep.
                        Experience the art of coffee with CafeCart.
                    </p>
                </div>

                {/* Quick Links */}
                <div className={styles.footerSection}>
                    <h4 className={styles.sectionHeading}>Explore</h4>
                    <ul className={styles.linkList}>
                        <li><button onClick={() => handleNavigation('/')}>Home</button></li>
                        <li><button onClick={() => handleNavigation('/vendors')}>Our Vendors</button></li>
                        <li><button onClick={() => handleNavigation('/cart')}>My Cart</button></li>
                        <li><button onClick={() => handleNavigation('/orders')}>Orders History</button></li>
                    </ul>
                </div>

                {/* Newsletter/Motto */}
                <div className={styles.footerSection}>
                    <h4 className={styles.sectionHeading}>Our Motto</h4>
                    <p className={styles.mottoText}>
                        "Life is too short for bad coffee. We make sure you only get the best."
                    </p>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>&copy; {new Date().getFullYear()} CafeCart. All rights reserved.</p>
                <div className={styles.footerLegal}>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};
