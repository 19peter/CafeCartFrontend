import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>404</h1>
        <h2>Oops! This page is off the menu ☕</h2>
        <p>
          The page you’re looking for doesn’t exist or was moved.
          Let’s get you back to something tasty.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.btn + " primary"}>
            Go Home
          </Link>
  
        </div>
      </div>
    </div>
  );
}
