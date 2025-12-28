import { Link } from 'react-router-dom';
import styles from './VendorCard.module.css';

interface VendorCardProps {
  id: string;
  name: string;
  imageUrl: string | null;
}

export const VendorCard = ({ name, imageUrl }: VendorCardProps) => {
  return (
    <Link to={`/vendor/${name}`} className={styles.vendorCard}>
        
        <div className={styles.container}>
          <div className={styles.imageContainer}>
            {imageUrl ? (
              <img src={imageUrl} alt={name} />
            ) : (
              <div className={styles.imagePlaceholder}>
                <p>No Image</p>
              </div>
            )}
            <div className={styles.overlay}></div>
          </div>
          <h3 className={styles.vendorName}>{name}</h3>
        </div>
    </Link>
  );
};
