import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../../Components/ProductCard/ProductCard';
import { SearchAndFilter } from '../../Components/SearchAndFilter/SearchAndFilter';
import styles from './Vendor.module.css';

interface Shop {
  id: string;
  name: string;
  location: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  rating: number;
}

// Import images
import cappuccinoImg from '../../assets/cafe-1.jpg';


// Mock data - replace with API calls in a real application
const mockShops: Shop[] = [
  { id: '1', name: 'Downtown Branch', location: '123 Main St' },
  { id: '2', name: 'Uptown Branch', location: '456 Oak Ave' },
  { id: '3', name: 'Westside Branch', location: '789 Pine Rd' },
];

const mockProducts: Record<string, Product[]> = {
  '1': [
    { id: 'p1', name: 'Cappuccino', rating: 4.5, price: 4.5, imageUrl: cappuccinoImg, description: 'Rich espresso with steamed milk' },
    { id: 'p2', name: 'Latte', rating: 4.0, price: 4.0, imageUrl: cappuccinoImg, description: 'Smooth espresso with lots of milk' },
    { id: 'p3', name: 'Mocha', rating: 4.75, price: 4.75, imageUrl: cappuccinoImg, description: 'Chocolatey coffee delight' },
  ],
  '2': [
    { id: 'p4', name: 'Iced Coffee', rating: 3.5, price: 3.5, imageUrl: cappuccinoImg, description: 'Chilled coffee perfection' },
    { id: 'p5', name: 'Americano', rating: 3.0, price: 3.0, imageUrl: cappuccinoImg, description: 'Strong black coffee' },
  ],
  '3': [
    { id: 'p6', name: 'Espresso', rating: 3.0, price: 3.0, imageUrl: cappuccinoImg, description: 'Strong and concentrated' },
    { id: 'p7', name: 'Macchiato', rating: 3.5, price: 3.5, imageUrl: cappuccinoImg, description: 'Espresso with a dash of milk' },
    { id: 'p8', name: 'Flat White', rating: 4.25, price: 4.25, imageUrl: cappuccinoImg, description: 'Creamy and smooth' },
  ],
};

export const Vendor = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [selectedShop, setSelectedShop] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [vendorName, setVendorName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Mock categories - in a real app, this would come from an API
  const categories = useMemo(() => [
    'Coffee',
    'Tea',
    'Pastries',
    'Breakfast',
    'Lunch',
    'Desserts'
  ], []);

  useEffect(() => {
    if (vendorId) {
      // In a real app, fetch vendor details using the vendorId
      // Example: const vendorData = await fetchVendorById(vendorId);
      console.log('Fetching vendor with ID:', vendorId);
      
      // For now, we'll just use a mock name
      setVendorName('Coffee Haven');
      
      // Set the first shop as default
      if (mockShops.length > 0) {
        setSelectedShop(mockShops[0].id);
      }
    }
  }, [vendorId]);

  // Filter products based on search term and category
  useEffect(() => {
    if (selectedShop) {
      const shopProducts = mockProducts[selectedShop] || [];
      let results = [...shopProducts];
      
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          product => product.name.toLowerCase().includes(term) || 
                    product.description.toLowerCase().includes(term)
        );
      }
      
      // Apply category filter
      if (selectedCategory) {
        // In a real app, products would have categories
        // For now, we'll just filter by name/description containing the category
        const category = selectedCategory.toLowerCase();
        results = results.filter(
          product => product.name.toLowerCase().includes(category) || 
                    product.description.toLowerCase().includes(category)
        );
      }
      
      setFilteredProducts(results);
    }
  }, [selectedShop, searchTerm, selectedCategory]);
  
  const handleSearch = (term: string, category: string) => {
    setSearchTerm(term);
    setSelectedCategory(category);
  };

  const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedShop(e.target.value);
  };

  // In a real app, you would fetch vendor details using the vendorId
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
          {mockShops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name} - {shop.location}
            </option>
          ))}
        </select>
      </div>

      <SearchAndFilter 
        onSearch={handleSearch} 
        categories={categories} 
      />
      
      <div className={styles.productsGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              description={product.description}
              rating={product.rating}
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
