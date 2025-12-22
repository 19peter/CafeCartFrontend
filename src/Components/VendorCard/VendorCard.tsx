import { Link } from 'react-router-dom';
import styles from './VendorCard.module.css';

interface VendorCardProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const VendorCard = ({ id, name, imageUrl }: VendorCardProps) => {
  return (
    <Link to={`/vendor/${name}`} className={styles.vendorCard}>
        
        <div className={styles.container}>
          <div className={styles.imageContainer}>
            <img src={imageUrl} alt={name} />
            <div className={styles.overlay}></div>
          </div>
          <h3 className={styles.vendorName}>{name}</h3>
        </div>
    </Link>
  );
};
