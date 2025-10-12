"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Paper,
  Box,
  Stack,
  CircularProgress,
  TextField,
  Alert,
} from "@mui/material";
import AddProduct from "../components/AddProduct/addProduct";
import { collection, getDocs, query } from "firebase/firestore";
import { db, auth } from "../firebase";
import Product from "../components/Product/product";
import styles from "./admin.module.css";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [authLoading, setAuthLoading] = useState(false);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!auth) return;
    // setLoginError("null");

    try {
      // HIGHLIGHT: Sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);

      console.log("running");
      // setAuthLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
      // Display a user-friendly error message
      setLoginError("Sign-in failed. Please check your email and password.");
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
      setData([]); // Clear product data on logout
      setActiveSection("allProducts");
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      getProducts();
    }
  }, [user, authLoading]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // HIGHLIGHT: Sets initialization complete and also stops the login spinner
      // if it was triggered by a successful login.
      // setIsAppInitializing(false);
      // setIsSigningIn(false); // Clear the button spinner on any auth change

      console.log(
        "Auth State Changed: User is now:",
        currentUser ? currentUser.email || "Anonymous" : "Logged Out"
      );
      console.log("Is user anonymous?", currentUser?.isAnonymous);
    });

    return () => unsubscribe();
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

  if (authLoading) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading authentication...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: "8px" }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            Admin Login
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Please sign in to access the dashboard.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignIn}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {loginError && <Alert severity="error">{loginError}</Alert>}
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={authLoading}
              sx={{ py: 1.5, mt: 1 }}
            >
              {authLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        sx={{ mb: 4 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Button variant="outlined" color="error" onClick={handleSignOut}>
            Sign Out ({user.email || "User"})
          </Button>
        </Box>
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
