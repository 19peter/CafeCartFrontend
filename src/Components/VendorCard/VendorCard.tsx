import { Link } from 'react-router-dom';
import styles from './VendorCard.module.css';

interface VendorCardProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const VendorCard = ({ id, name, imageUrl }: VendorCardProps) => {
  return (
    <Link to={`/vendor/${id}`} className={styles.vendorCard}>
      <div 
        className={styles.vendorImage}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className={styles.overlay}></div>
        <h3 className={styles.vendorName}>{name}</h3>
      </div>
    </Link>
  );
};
