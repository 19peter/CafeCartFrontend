import { useEffect, useState } from 'react';
import { VendorCard } from '../../../Components/VendorCard/VendorCard';
import styles from './Vendors.module.css';
import { getVendors } from '../../../services/vendorsService';
import type { VendorType } from './VendorType';

export const Vendors = () => {

  const [vendors, setVendors] = useState<VendorType[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      const vendors = await getVendors({ page: 0, size: 10 }) ;
      setVendors(vendors.content);
    };
    fetchVendors();
  }, []);

  
  return (
    <div className={styles.vendorsContainer}>
      <h1>Our Vendors</h1>
      <div className={styles.vendorsGrid}>
        {vendors?.map((vendor) => (
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
