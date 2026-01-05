import React from 'react';
import styles from './Legal.module.css';

const TermsOfService: React.FC = () => {
    return (
        <div className={styles.legalContainer}>
            <h1 className={styles.legalTitle}>📜 Terms of Service</h1>
            <p className={styles.lastUpdated}>Last updated: January 2026</p>

            <section className={styles.legalSection}>
                <p>By using CafeCart, you agree to these Terms of Service. If you do not agree, please do not use the app.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>1. About the Service</h2>
                <p>CafeCart is an application that allows users to interact with shops and place orders.</p>
                <p>The app is operated by an individual developer based in Egypt as a personal project.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>2. User Accounts</h2>
                <ul>
                    <li>You must provide accurate information when creating an account</li>
                    <li>You are responsible for keeping your login credentials secure</li>
                    <li>You are responsible for all activity under your account</li>
                </ul>
            </section>

            <section className={styles.legalSection}>
                <h2>3. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul>
                    <li>Use the app for illegal purposes</li>
                    <li>Attempt to access other users’ accounts</li>
                    <li>Abuse, spam, or disrupt the service</li>
                    <li>Reverse engineer or exploit the app</li>
                </ul>
                <p>We reserve the right to suspend or terminate accounts that violate these rules.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>4. Payments</h2>
                <p>CafeCart does not handle or process payments.</p>
                <p>Any payment links shared by shops redirect users to third-party services. We are not responsible for payment processing, failures, refunds, or disputes related to those services.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>5. Availability</h2>
                <p>We aim to keep the app available, but we do not guarantee uninterrupted or error-free operation. The service may be modified or discontinued at any time.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>6. Account Termination</h2>
                <p>We may suspend or terminate accounts if:</p>
                <ul>
                    <li>These terms are violated</li>
                    <li>The app is misused</li>
                    <li>Required by law</li>
                </ul>
                <p>Users may request account deletion by contacting support.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>7. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law:</p>
                <ul>
                    <li>The app is provided “as is”</li>
                    <li>We are not liable for indirect or consequential damages</li>
                    <li>Use of the app is at your own risk</li>
                </ul>
            </section>

            <section className={styles.legalSection}>
                <h2>8. Governing Law</h2>
                <p>These Terms are governed by the laws of Egypt.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>9. Changes to These Terms</h2>
                <p>We may update these Terms from time to time. Continued use of the app means you accept the updated terms.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>10. Contact</h2>
                <div className={styles.contactInfo}>
                    <p>For questions about these Terms, contact:</p>
                    <p>📧 cafecart.shop@gmail.com</p>
                </div>
            </section>
        </div>
    );
};

export default TermsOfService;
