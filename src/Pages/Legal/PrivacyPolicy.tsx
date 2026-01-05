import React from 'react';
import styles from './Legal.module.css';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className={styles.legalContainer}>
            <h1 className={styles.legalTitle}>🔐 Privacy Policy</h1>
            <p className={styles.lastUpdated}>Last updated: January 2026</p>

            <section className={styles.legalSection}>
                <p>This Privacy Policy explains how CafeCart (“we”, “us”, or “the app”) collects, uses, and protects your personal data when you use our application.</p>
                <p>We are an individual developer based in Egypt, operating this app as a personal project.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>1. Information We Collect</h2>
                <p>When you sign up or use the app, we collect the following personal information:</p>
                <ul>
                    <li>First name</li>
                    <li>Last name</li>
                    <li>Email address</li>
                    <li>Password (stored in encrypted/hashed form)</li>
                    <li>Phone number</li>
                </ul>
                <p>We do not collect payment information.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>2. How We Use Your Information</h2>
                <p>We use your data to:</p>
                <ul>
                    <li>Create and manage your user account</li>
                    <li>Verify your email address</li>
                    <li>Communicate with you regarding your account</li>
                    <li>Provide and improve the app’s functionality</li>
                    <li>Respond to support requests</li>
                </ul>
                <p>We do not use your data for advertising or analytics.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>3. Emails</h2>
                <p>We send verification and account-related emails using a business email service. These emails are strictly for operational purposes (e.g., account verification).</p>
            </section>

            <section className={styles.legalSection}>
                <h2>4. Payments</h2>
                <p>CafeCart does not process payments directly.</p>
                <p>If a shop shares a payment link with a customer, the payment is completed through a third-party service outside of our app. We do not collect, store, or have access to any payment details.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>5. Data Storage and Security</h2>
                <p>Your data is stored securely in our database. We take reasonable technical measures to protect your information from unauthorized access, loss, or misuse.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>6. Data Retention</h2>
                <p>We keep your personal data only as long as necessary to provide the service.</p>
                <p>Account deletion functionality may be added in the future. Until then, users may request account deletion by contacting us (see Section 10).</p>
            </section>

            <section className={styles.legalSection}>
                <h2>7. Children’s Privacy</h2>
                <p>The app is not intended for children under the age of 13. We do not knowingly collect personal data from children.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>8. Your Rights</h2>
                <p>Depending on applicable laws, you may have the right to:</p>
                <ul>
                    <li>Access your personal data</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data</li>
                </ul>
                <p>You can exercise these rights by contacting us.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>9. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.</p>
            </section>

            <section className={styles.legalSection}>
                <h2>10. Contact Us</h2>
                <div className={styles.contactInfo}>
                    <p>If you have any questions about this Privacy Policy or your data, contact us at:</p>
                    <p>📧 cafecart.shop@gmail.com</p>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
