import { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

export const ShopNavigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // const {  logout } = useAuth();
    // const navigate = useNavigate();

    const userMenuRef = useRef<HTMLDivElement>(null);
    // const mobileMenuRef = useRef<HTMLDivElement>(null);

    // const toggleMenu = () => {
    //     setIsMenuOpen(!isMenuOpen);
    // };

    // const handleLogout = async () => {
    //     try {
    //         logout();
    //         setShowUserMenu(false);
    //         setIsMenuOpen(false);
    //         navigate('/');
    //     } catch (error) {
    //         console.error('Failed to log out', error);
    //     }
    // };

    // const handleNavigation = (path: string) => {
    //     navigate(path);
    //     setIsMenuOpen(false);
    //     setShowUserMenu(false);
    // };

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



    return (
        <div>
            <h1>Shop Navigation</h1>
        </div>
    );
};

export default ShopNavigation;