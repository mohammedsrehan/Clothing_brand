"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Paper,
  Box,
  Stack,
} from "@mui/material";
import AddProduct from "../components/AddProduct/addProduct";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import Product from "../components/Product/product";
import styles from "./admin.module.css";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("allProducts");
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

  const renderSection = () => {
    switch (activeSection) {
      case "addProduct":
        return <AddProduct />;
      case "allProducts":
        return (
          <Box sx={{ padding: 4 }}>
            <Typography variant="h5" gutterBottom>
              All Products
              </Typography>
              <div className={styles.products}>

              {data.length === 0 ? (
                  <p>No products found</p>
                ) : (
                    data.map((product) => (
                        <Product key={product.id} product={product} />
                    ))
                )}
                </div>
            <Typography variant="body1">
              {/* This is the section where you would display the products from your database. */}
              {/* This section is intentionally left blank for now. */}
            </Typography>
          </Box>
        );
      case "ordersReceived":
        return (
          <Box sx={{ padding: 4 }}>
            <Typography variant="h5" gutterBottom>
              Orders Received
            </Typography>
            <Typography variant="body1">
              List of all newly received orders will be displayed here.
            </Typography>
          </Box>
        );
      case "processingOrders":
        return (
          <Box sx={{ padding: 4 }}>
            <Typography variant="h5" gutterBottom>
              Processing Orders
            </Typography>
            <Typography variant="body1">
              Orders currently being prepared for shipping will be displayed
              here.
            </Typography>
          </Box>
        );
      case "pastOrders":
        return (
          <Box sx={{ padding: 4 }}>
            <Typography variant="h5" gutterBottom>
              Past Orders
            </Typography>
            <Typography variant="body1">
              History of all completed and shipped orders will be displayed
              here.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box sx={{ padding: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Welcome to the admin panel. Manage your clothing brand here.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        sx={{ mb: 4 }}
      >
        <Button
          variant={activeSection === "addProduct" ? "contained" : "outlined"}
          onClick={() => setActiveSection("addProduct")}
        >
          Add Product
        </Button>
        <Button
          variant={activeSection === "allProducts" ? "contained" : "outlined"}
          onClick={() => setActiveSection("allProducts")}
        >
          View All Products
        </Button>
        <Button
          variant={
            activeSection === "ordersReceived" ? "contained" : "outlined"
          }
          onClick={() => setActiveSection("ordersReceived")}
        >
          Orders Received
        </Button>
        <Button
          variant={
            activeSection === "processingOrders" ? "contained" : "outlined"
          }
          onClick={() => setActiveSection("processingOrders")}
        >
          Processing Orders
        </Button>
        <Button
          variant={activeSection === "pastOrders" ? "contained" : "outlined"}
          onClick={() => setActiveSection("pastOrders")}
        >
          Past Orders
        </Button>
      </Stack>
      <Paper elevation={1} sx={{ p: 4 }}>
        {renderSection()}
      </Paper>
    </Container>
  );
};

export default AdminPage;
