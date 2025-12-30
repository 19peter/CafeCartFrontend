import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './LandingStyles.module.css';
import heroImg from '../../../assets/cafe-1.jpg';
import { Button } from '../../../Components/Button/Button';
import { Coffee, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className={styles.textSection}>
          <motion.h1 variants={itemVariants}>
            Deliciously Simple <br />
            <span className={styles.highlight}>CafeCart</span>
          </motion.h1>

          <motion.p className={styles.subtitle} variants={itemVariants}>
            The best cafes in town, delivered to your doorstep or ready for pickup.
            Experience the finest roasts with zero hassle.
          </motion.p>

          <motion.div className={styles.ctaGroup} variants={itemVariants}>
            <Button
              size="lg"
              onClick={() => navigate('/vendors')}
              rightIcon={<ArrowRight size={20} />}
            >
              Start Exploring
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const element = document.getElementById('how-it-works');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              How it Works
            </Button>
          </motion.div>
        </div>

        <motion.div className={styles.imageSection} variants={itemVariants}>
          <div className={styles.imageContainer}>
            <img
              src={heroImg}
              alt="Cozy Coffee Shop"
              className={styles.heroImage}
            />
            <div className={styles.imageOverlay} />
          </div>
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How it Works</h2>
          <p className={styles.sectionSubtitle}>Your favorite coffee is just three steps away</p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <MapPin size={32} />
            </div>
            <h3>Find a Cafe</h3>
            <p>Browse through our curated list of local coffee shops and vendors.</p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <Coffee size={32} />
            </div>
            <h3>Pick your Roast</h3>
            <p>Select your favorite blends, pastries, and seasonal specialties.</p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <ShoppingBag size={32} />
            </div>
            <h3>Quick Checkout</h3>
            <p>Secure payment and real-time tracking of your order status.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
