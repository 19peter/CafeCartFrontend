import { useEffect, useState } from 'react';
import { VendorCard } from '../../../Components/VendorCard/VendorCard';
import styles from './Vendors.module.css';
import { getVendors } from '../../../services/vendorsService';
import type { VendorType, VendorResponse } from './VendorType';

export const Vendors = () => {

  const [vendors, setVendors] = useState<VendorType[]>([]);
  const url = 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'

  useEffect(() => {
    const fetchVendors = async () => {
      const vendors = await getVendors({ page: 0, size: 10 }) ;
      setVendors(vendors.content);
    };
    fetchVendors();
  }, []);

  console.log(vendors);
  
  return (
    <div className={styles.vendorsContainer}>
      <h1>Our Vendors</h1>
      <div className={styles.vendorsGrid}>
        {vendors?.map((vendor) => (
          <VendorCard 
            key={vendor.id}
            id={vendor.id}
            name={vendor.name}
            imageUrl={vendor.imageUrl || url}
          />
        ))}
      </div>
    </div>
  );
};

export default Vendors;
