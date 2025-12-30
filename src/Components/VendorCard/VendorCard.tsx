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
      <div className={styles.cardContent}>
        <div className={styles.imageSection}>
          {imageUrl ? (
            <img src={imageUrl} alt={name} className={styles.vendorImage} />
          ) : (
            <div className={styles.imagePlaceholder}>
              <p>No Image</p>
            </div>
          )}
          <div className={styles.imageOverlay} />
        </div>
        <div className={styles.infoSection}>
          <h3 className={styles.vendorName}>{name.toUpperCase()}</h3>
          <div className={styles.actionRow}>
            <span className={styles.viewShop}>View Shop</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
