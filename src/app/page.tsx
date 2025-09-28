"use client";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import styles from "./page.module.css";
// import Navbar from "./components/Navbar/navbar";
// import Product from "./components/Product/product";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "./firebase";

// export default function Home() {
//   const [data, setData] = useState<any[]>([]);
//   const getProducts = async () => {
//     // This function would typically fetch products from your database
//     const querySnapshot = await getDocs(collection(db, "products"));
//     const fetchedData: any[] = [];
//     querySnapshot.forEach((doc) => {
//       // setData =
//       fetchedData.push({ id: doc.id, ...doc.data() });
//     });
//     setData(fetchedData);
//     console.log(fetchedData);
//   };

//   useEffect(() => {
//     getProducts();
//   }, []);

//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Navbar />
//         <section className={styles.hero}>
//           <div className={styles.hero_image}>
//             <Image
//               fill
//               objectFit="cover"
//               src="/landing_image.svg"
//               alt="Landing image"
//               // sizes="(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw"
//               // width={200}
//               // height={200}
//               className={styles.brandLogo}
//             />
//           </div>
//           <div className={styles.hero_content}>
//             <h1 className={styles.title}>Elevate Your Style</h1>
//             <p className={styles.tagline}>
//               Bismillah Collection Presents the latest trends in fashion with
//               Quality, Comfort, and Confidence.
//             </p>
//             <a href="#shop" className={styles.shop_button}>
//               Shop Now
//             </a>
//           </div>
//         </section>
//         <section id="shop" className={styles.featured}>
//           <h2>Featured Products</h2>
//           <div className={styles.featured_products}>
//             {data.length === 0 ? (
//               <p>No products found</p>
//             ) : (
//               data.map((product) => (
//                 <Product key={product.id} product={product} />
//               ))
//             )}
//           </div>
//         </section>
//       </main>
//       <footer className={styles.footer}>
//         &copy; {new Date().getFullYear()} Your Clothing Brand. All rights
//         reserved.
//       </footer>
//     </div>
//   );
// }

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Product from "./components/Product/product";
import Navbar from "./components/Navbar/navbar";
// import { FaShoppingCart, FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";

// Dummy data for featured products and collections
const featuredProducts = [
  {
    name: "Pakistani Dress",
    price: 1500,
    image: "https://placehold.co/400x500/E8E3E6/B296A2?text=Product",
  },
  {
    name: "Indian Dress",
    price: 2500,
    image: "https://placehold.co/400x500/C8BFE2/796B8F?text=Product",
  },
  {
    name: "Indian Dress",
    price: 3000,
    image: "https://placehold.co/400x500/E1B8A0/A58B78?text=Product",
  },
  {
    name: "Casual Kurta",
    price: 900,
    image: "https://placehold.co/400x500/A2B495/68775B?text=Product",
  },
];

const collections = [
  {
    name: "Pakistani Dresses",
    image: "/pakistani.png",
  },
  {
    name: "Indian Dresses",
    image: "/indian.png",
  },
  {
    name: "Sarees",
    image: "/saree.png",
  },
];

export default function LandingPage() {
  const [data, setData] = useState<any[]>([]);
  const getProducts = async () => {
    // This function would typically fetch products from your database
    const querySnapshot = await getDocs(collection(db, "products"));
    const fetchedData: any[] = [];
    querySnapshot.forEach((doc) => {
      // setData =
      fetchedData.push({ id: doc.id, ...doc.data() });
    });
    setData(fetchedData);
    console.log(fetchedData);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Elevate Your Style!</h1>
          <p>
            Bismillah Collection Presents the latest trends in fashion with
            Quality, Comfort, and Confidence.
          </p>
          <button className={styles.shopNowButton}>Shop Now</button>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/hero.png"
            alt="Model"
            layout="fill"
            objectFit="cover"
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
                <Image
                  src={collection.image}
                  alt={collection.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h3>{collection.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredProductsSection}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.productsGrid}>
          {data.length === 0 ? (
            <p>No products found</p>
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
