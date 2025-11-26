import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './LandingStyles.module.css';
import img from '../../assets/cafe-1.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 * i,
      duration: 1
    }
  })
};

export const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <motion.main 
      className={styles.container}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.section 
        className={styles.image_sec} 
        aria-label="Cafe showcase"
        variants={itemVariants}
        custom={0}
      >
        <motion.img 
          className={styles.cafe_img}
          src={img}
          alt="A cozy cafe with warm lighting and comfortable seating"
          loading="eager"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        />
      </motion.section>

      <motion.section 
        className={styles.text_sec} 
        aria-label="Welcome message"
        variants={containerVariants}
      >
        <motion.h1 
          variants={itemVariants}
          custom={1}
        >
          Welcome to <span className={styles.highlight}>CafeCart</span>
        </motion.h1>
        
        <motion.p 
          className={styles.subtitle}
          variants={itemVariants}
          custom={2}
        >
          Discover the best cafes in town
        </motion.p>

        <motion.button 
          className={styles.browse_btn}
          onClick={() => navigate('/vendors')}
          variants={itemVariants}
          custom={3}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
          whileTap={{ scale: 0.98 }}
        >
          Browse Vendors
        </motion.button>
      </motion.section>
    </motion.main>
  );
}
