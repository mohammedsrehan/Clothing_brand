"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Assuming you have firebase.js/ts file setup
import Product from "./components/Product/product"; // Assuming this component exists
import Navbar from "./components/Navbar/navbar";
import CartModal from "./components/Cart/CartModal"; // Ensure this path is correct

const collections = [
  {
    name: "Pakistani Dresses",
    image: "/pakistani_dress.png",
  },
  {
    name: "Indian Dresses",
    image: "/indian_dress.png",
  },
  {
    name: "Sarees",
    image: "/saree_dress.png",
  },
];

export default function LandingPage() {
  const [data, setData] = useState<any[]>([]);

  // CRITICAL: State to control the visibility of the Cart Modal (Drawer)
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getProducts = async () => {
    // Fetches products from Firestore
    const querySnapshot = await getDocs(collection(db, "products"));
    const fetchedData: any[] = [];
    querySnapshot.forEach((doc) => {
      fetchedData.push({ id: doc.id, ...doc.data() });
    });
    setData(fetchedData);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className={styles.container}>
      {/* 1. Navbar is rendered and given the function to OPEN the cart */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* 2. CartModal is rendered and controls its visibility based on state */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)} // Function to CLOSE the cart
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Elevate Your Style!</h1>
          <p>
            Bismillah Collection Presents the latest trends in fashion with
            Quality, Comfort, and Confidence.
          </p>
          <button className={styles.shopNowButton}>
            <a href="#shop">Shop Now</a>
          </button>
        </div>
        <div className={styles.heroImage}>
          <img
            src="/landing_image.png"
            alt="Model"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
      </section>

      {/* Our Collections Section */}
      <section className={styles.collectionsSection}>
        <h2 className={styles.sectionTitle}>Our Collections</h2>
        <div className={styles.collectionsGrid}>
          {collections.map((collection, index) => (
            <div key={index} className={styles.collectionCard}>
              <div className={styles.collectionImage}>
                <img
                  src={collection.image}
                  alt={collection.name}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <h3>{collection.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredProductsSection} id="shop">
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.productsGrid}>
          {data.length === 0 ? (
            <p>Loading products...</p>
          ) : (
            data.map((product) => (
              <Product key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>©2025 Bismillah Collection. All rights reserved.</p>
      </footer>
    </div>
  );
}
