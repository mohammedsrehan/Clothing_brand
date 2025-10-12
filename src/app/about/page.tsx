"use client";
import { useState } from "react";
import Navbar from "../components/Navbar/navbar";
import styles from "./about.module.css";

export default function About() {
    const [isCartOpen, setIsCartOpen] = useState(false);
  
  return (
    <div className={styles.container}>
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <main className={styles.aboutPage}>
        <h1 className={styles.aboutTitle}>About Us</h1>
        <section className={styles.aboutSection}>
          <p className={styles.aboutDescription}>
            Welcome to <strong>Bismillah Collection</strong>! We are passionate about
            bringing you the best in stylish, comfortable, and sustainable
            fashion by curating top-quality clothing from leading brands. As a
            trusted reseller, our mission is to empower individuals to express
            themselves through a diverse selection of high-quality apparel.
          </p>
          <h2 className={styles.aboutSubtitle}>Our Story</h2>
          <p className={styles.aboutStory}>
            Founded in 2024, Clothing Brand was created to make the latest
            trends and timeless designs accessible to everyone. By partnering
            with reputable brands, we ensure our customers have access to a wide
            variety of authentic, premium clothing. We believe fashion should be
            accessible, ethical, and fun.
          </p>
          <h2 className={styles.aboutSubtitle}>Our Values</h2>
          <ul className={styles.aboutValues}>
            <li className={styles.aboutValueItem}>
              <strong>Quality:</strong> Our curated selection features products
              made to last, ensuring you get the best value.
            </li>
            <li className={styles.aboutValueItem}>
              <strong>Inclusivity:</strong> We offer a wide range of sizes and
              styles for everyone.
            </li>
            <li className={styles.aboutValueItem}>
              <strong>Authenticity:</strong> As a reseller, we guarantee all
              products are genuine and sourced from trusted partners.
            </li>
          </ul>
          <h2 className={styles.aboutSubtitle}>Contact Us</h2>
          <p className={styles.aboutContact}>
            Have questions or feedback? Reach out to us at{" "}
            <a
              className={styles.aboutEmail}
              href="mailto:info@clothingbrand.com"
            >
              info@clothingbrand.com
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
