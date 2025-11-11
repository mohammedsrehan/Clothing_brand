"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  updateDoc,
  Timestamp,
  doc,
} from "firebase/firestore";
import { db } from "./firebase"; // your firebase config file
import Product from "./components/Product/product";
import Navbar from "./components/Navbar/navbar";
import CartModal from "./components/Cart/CartModal";

const collections = [
  { name: "Pakistani Dresses", image: "/pakistani_dress.png" },
  { name: "Indian Dresses", image: "/indian_dress.png" },
  { name: "Sarees", image: "/saree_dress.png" },
];

export default function LandingPage() {
  const [data, setData] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch initial 20 products (latest first)
  const getProducts = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "products"),
        // Sort by date (latest first)
        orderBy("createdAt", "desc"), 
        limit(18)
      );

      const querySnapshot = await getDocs(q);
      const fetchedData: any[] = [];
      querySnapshot.forEach((doc) => fetchedData.push({ id: doc.id, ...doc.data() }));

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      setData(fetchedData);
      setLastDoc(lastVisible);
      setHasMore(querySnapshot.docs.length === 18);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load more products (next 20)
  const loadMoreProducts = async () => {
    if (!lastDoc) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(18)
      );

      const querySnapshot = await getDocs(q);
      const fetchedData: any[] = [];
      querySnapshot.forEach((doc) => fetchedData.push({ id: doc.id, ...doc.data() }));

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      setData((prev) => [...prev, ...fetchedData]);
      setLastDoc(lastVisible);
      setHasMore(querySnapshot.docs.length === 18);
    } catch (err) {
      console.error("Error loading more products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className={styles.container}>
      {/* Navbar with cart toggle */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

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

      {/* Our Collections */}
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

      {/* Featured Products */}
      <section className={styles.featuredProductsSection} id="shop">
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.productsGrid}>
          {data.length === 0 && !loading && <p>No products found.</p>}
          {data.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          {loading && <p>Loading...</p>}
          {!loading && hasMore && (
            <button className={styles.shopNowButton} onClick={loadMoreProducts}>
              Load More
            </button>
          )}
          {!hasMore && data.length > 0 && (
            <p style={{ color: "#666", marginTop: "1rem" }}>No more products to load</p>
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
