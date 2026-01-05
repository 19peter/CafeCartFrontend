import { useState } from 'react';
import styles from './AdminDashboard.module.css';
import { ViewToggler } from '../../../Components/ViewToggler/ViewToggler';
import { VendorManagement } from './components/VendorManagement';
import { ShopViewer } from './components/ShopViewer';
import { CategoryManagement } from './components/CategoryManagement';
import { Users, Store, LayoutGrid, ShieldCheck } from 'lucide-react';

export const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('Vendors');

    const renderContent = () => {
        switch (activeView) {
            case 'Vendors':
                return <VendorManagement />;
            case 'Shops':
                return <ShopViewer />;
            case 'Categories':
                return <CategoryManagement />;
            default:
                return <VendorManagement />;
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.brand}>
                        <ShieldCheck className={styles.adminIcon} />
                        <h1>Admin Control</h1>
                    </div>
                    <p>System-wide management and oversight</p>
                </div>

                <div className={styles.navigation}>
                    <ViewToggler
                        options={[
                            { id: 'Vendors', label: 'Vendors', icon: <Users size={18} /> },
                            { id: 'Shops', label: 'Shops', icon: <Store size={18} /> },
                            { id: 'Categories', label: 'Categories', icon: <LayoutGrid size={18} /> }
                        ]}
                        activeOption={activeView}
                        onChange={setActiveView}
                    />
                </div>
            </header>

            <main className={styles.mainContent}>
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
