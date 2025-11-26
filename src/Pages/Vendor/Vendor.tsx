import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../../Components/ProductCard/ProductCard';
import styles from './Vendor.module.css';
// Import images
import cappuccinoImg from '../../assets/cafe-1.jpg';
import { getVendorShopsByVendorId } from '../../services/vendorShopsService';
import { getShopCategories, getVendorShopInventoryByCategory } from '../../services/inventoryService';
import { CategoriesDisplay } from '../../Components/CategoryCard/CategoriesDisplay';


interface Shop {
  id: number;
  name: string;
  address: string;
}

interface Product {
  id: number;
  productId: number
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  rating: number;
}

export const Vendor = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [selectedShop, setSelectedShop] = useState<number>(0);
  const [vendorName, setVendorName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);


  // -------------------------------------------------------
  // 1️⃣ Load vendor shops on first render
  // -------------------------------------------------------
  useEffect(() => {
    const loadShops = async () => {
      try {
        const data = await getVendorShopsByVendorId(Number(vendorId));
        setShops(data);
        if (data.length > 0) {
          setSelectedShop(data[0].id);   // auto-select first shop
        }
      } catch (err) {
        console.error(err);

      }
    };

    loadShops();
  }, [vendorId]);

  // -------------------------------------------------------
  // 2️⃣ When selectedShop changes → load categories
  // -------------------------------------------------------
  useEffect(() => {
    if (!selectedShop) return;

    const loadCategories = async () => {
      try {
        const data = await getShopCategories({ shopId: selectedShop });
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].name);   // auto-select first category
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadCategories();
  }, [selectedShop]);

  // -------------------------------------------------------
  // 3️⃣ When selectedCategory changes → load products
  // -------------------------------------------------------
  useEffect(() => {
    if (!selectedCategory) return;

    const loadInventory = async () => {
      try {
        // setLoading(true);

        const data = await getVendorShopInventoryByCategory({
          shopId: Number(selectedShop),
          category: selectedCategory,
          quantity: 0,
          page: 0,
          size: 10,
        });

        setInventory(data.content ?? data);
      } catch (err) {
        console.error(err);
      }
    };

    loadInventory();
  }, [selectedCategory, selectedShop]);



  const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedShop(Number(e.target.value));
  };

  return (
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
              {shop.name} - {shop.address}
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

      {/* <div className={styles.categorySelector}>
        <label>Browse By Category</label>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.categorySelect}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div> */}

      <div className={styles.productsGrid}>

        {inventory.length > 0 ? (
          inventory.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              productId={product.productId}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              description={product.description}
              rating={product.rating}
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
  );
};
