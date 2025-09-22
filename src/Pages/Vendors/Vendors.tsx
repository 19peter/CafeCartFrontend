import { VendorCard } from '../../Components/VendorCard/VendorCard';
import styles from './Vendors.module.css';

// Mock data - in a real app, this would come from an API
const vendors = [
  { id: '1', name: 'Brew & Bites', imageUrl: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
  { id: '2', name: 'The Daily Grind', imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
  { id: '3', name: 'Café Aroma', imageUrl: 'https://images.unsplash.com/photo-1495474477477-c8725e6e5e47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
  { id: '4', name: 'Mug Life', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
  { id: '5', name: 'The Roasted Bean', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
  { id: '6', name: 'Espresso Express', imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
];

export const Vendors = () => {
  
  return (
    <div className={styles.vendorsContainer}>
      <h1>Our Vendors</h1>
      <div className={styles.vendorsGrid}>
        {vendors.map((vendor) => (
          <VendorCard 
            key={vendor.id}
            id={vendor.id}
            name={vendor.name}
            imageUrl={vendor.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Vendors;
