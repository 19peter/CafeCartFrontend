import { useNavigate } from 'react-router-dom';
import styles from './LandingStyles.module.css';
import img from '../../assets/cafe-1.jpg';

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <main className={styles.container}>
      <section className={styles.image_sec} aria-label="Cafe showcase">
        <img 
          className={styles.cafe_img}  
          src={img} 
          alt="A cozy cafe with warm lighting and comfortable seating" 
          loading="eager"
        />
      </section>

      <section className={styles.text_sec} aria-label="Welcome message">
        <h1>Welcome to <span className={styles.highlight}>CafeCart</span></h1>
        
        <p className={styles.subtitle}>Discover the best cafes in town</p>

        {/* <div className={styles.buttonContainer}> */}
        <button 
          className={styles.browse_btn}
          onClick={() => navigate('/vendors')}
        >
          Browse Vendors
        </button>
          {/* <CustomButton 
            text='Browse Vendors' 
            backgroundColor='#7F5539' 
            fontColor='white' 
          /> */}
        {/* </div> */}
      </section>
    </main>
  );
}
