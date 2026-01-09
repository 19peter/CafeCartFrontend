import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../../../Components/ProductCard/ProductCard';
import styles from './Vendor.module.css';
// Import images
import { getVendorShopsByVendorId } from '../../../services/vendorShopsService';
import { getShopCategories } from '../../../services/productService';
import { CategoriesDisplay } from '../../../Components/CategoryDisplay/CategoriesDisplay';
import { getVendorShopProducts } from '../../../services/shopProductService';
import type { Product } from '../../../shared/types/product/ProductTypes';
import NotFound from '../../Shared/NotFound';
import type { Shop } from '../../../shared/types/Shop/Shop';
import { LocationSelector } from './LocationSelector';
import { Search, Layers } from 'lucide-react';
import { StickyCartButton } from '../../../Components/StickyCartButton/StickyCartButton';




export const Vendor = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [selectedShop, setSelectedShop] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [notFoundError, setNotFoundError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1️⃣ Load shops on vendorId change
  useEffect(() => {
    const loadShops = async () => {
      try {
        if (!vendorId) return;
        const parsedId = Number(vendorId);

        const data = await getVendorShopsByVendorId(
          Number.isNaN(parsedId) ? vendorId : parsedId
        );

        setShops(data);

        if (data.length > 0) {
          setSelectedShop(data[0].id); // auto-select first shop
        }
      } catch (err) {
        if (err instanceof Error && err.name == '404') {
          setNotFoundError(true);
        }
      }
    };

    if (vendorId) loadShops();
  }, [vendorId]);

  // 2️⃣ Load categories & inventory whenever selectedShop changes
  useEffect(() => {
    if (!selectedShop) return;

    const loadShopData = async () => {
      try {
        // Load categories
        const categoriesData = await getShopCategories({ shopId: selectedShop });
        setCategories(categoriesData);

        const firstCategory = categoriesData.length > 0 ? categoriesData[0].name : '';
        setSelectedCategory(firstCategory);

        // Load inventory
        const res = await getVendorShopProducts({ shopId: Number(selectedShop) });
        const inventoryData = res.content ?? res;
        setInventory(inventoryData);

        // Filter inventory by selectedCategory
        if (firstCategory) {
          setFilteredInventory(
            inventoryData.filter((p: Product) => p.categoryName === firstCategory)
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadShopData();
  }, [selectedShop]);

  // 3️⃣ Filter whenever selectedCategory, inventory, or searchQuery changes
  useEffect(() => {
    let filtered = inventory;

    if (selectedCategory) {
      filtered = filtered.filter((product: Product) => product.categoryName === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInventory(filtered);
  }, [selectedCategory, inventory, searchQuery]);






  return (
    <>
      {notFoundError ? <NotFound /> : (
        <div className={styles.vendorContainer}>
          <LocationSelector
            shops={shops}
            selectedShopId={selectedShop}
            onShopChange={setSelectedShop}
          />

          <div className={styles.categorySelector}>
            <div className={styles.sectionHeader}>
              <Layers className={styles.sectionIcon} size={20} />
              <h3 className={styles.sectionTitle}>Browse By Category</h3>
            </div>
            <CategoriesDisplay
              handleCategoryChange={setSelectedCategory}
              categories={categories} />
          </div>

          <div className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search products in this shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>


          <div className={styles.productsGrid}>

            {filteredInventory.length > 0 ? (
              filteredInventory.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  vendorShopId={Number(selectedShop)}
                />
              ))
            ) : (
              <div className={styles.noResults}>
                <p>No products found matching your search criteria.</p>
              </div>
            )}
          </div>
          <StickyCartButton />
        </div>
      )}
    </>
  );
};
