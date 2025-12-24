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




export const Vendor = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [selectedShop, setSelectedShop] = useState<number>(0);
  const [vendorName, setVendorName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [notFoundError, setNotFoundError] = useState(false);

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
        console.log(inventoryData);
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

  // Optional: only handle category changes for filtering
  useEffect(() => {
    if (!selectedCategory) return;
    setFilteredInventory(
      inventory.filter((product: Product) => product.categoryName === selectedCategory)
    );
  }, [selectedCategory, inventory]);



  const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedShop(Number(e.target.value));
  };


  return (
    <>
    {notFoundError ? <NotFound /> : (
    <div className={styles.vendorContainer}>
      <h1>{vendorName}</h1>

      <div className={styles.shopSelector}>
        <label htmlFor="shop-select">Select a shop:</label>
        <select
          id="shop-select"
          value={selectedShop}
          onChange={handleShopChange}
          className={styles.selectDropdown}
        >
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.categorySelector}>
        <h3>Browse By Category</h3>
        <CategoriesDisplay
          handleCategoryChange={setSelectedCategory}
          categories={categories} />
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
    </div>
    )}
    </>
  );
};
