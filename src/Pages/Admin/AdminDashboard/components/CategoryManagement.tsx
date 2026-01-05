import { useState, useEffect } from 'react';
import { adminService, type Category } from '../../../../services/adminService';
import styles from '../AdminDashboard.module.css';
import { Tag, Plus, LayoutGrid } from 'lucide-react';

export const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await adminService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.addCategory(newCategory);
            setNewCategory({ name: '' });
            setShowAddForm(false);
            loadCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category. Please try again.');
        }
    };

    return (
        <div className={styles.managementSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.headerInfo}>
                    <LayoutGrid className={styles.headerIcon} />
                    <div>
                        <h2>Category Management</h2>
                        <p>Organize products into logical groups</p>
                    </div>
                </div>
                <button
                    className={styles.addBtn}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            {showAddForm && (
                <form className={styles.addForm} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <input
                            type="text"
                            placeholder="Category Name (e.g., Brewed Coffee)"
                            value={newCategory.name}
                            onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn}>Create Category</button>
                </form>
            )}

            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <div className={styles.categoryGrid}>
                    {categories.map(category => (
                        <div key={category.id} className={styles.categoryCard}>
                            <div className={styles.categoryIcon}>
                                <Tag size={20} />
                            </div>
                            <div className={styles.categoryInfo}>
                                <h3>{category.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
