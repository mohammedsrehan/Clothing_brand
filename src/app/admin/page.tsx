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
import AddEditProductForm from "../components/AddProduct/addEditProduct";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import AdminProductCard from "../components/adminProductCard/adminProductCard";
import AddEditProduct from "../components/AddProduct/addEditProduct";
import styles from "./admin.module.css";

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [authLoading, setAuthLoading] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("allProducts");
  const [data, setData] = useState<any[]>([]);

  // ✅ Fetch products ordered by creation time (newest first)
  const getProducts = async () => {
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedData: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() });
      });
      setData(fetchedData);
      console.log("Fetched Products:", fetchedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Sign-in failed. Please check your email and password.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setData([]);
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
      console.log(
        "Auth State Changed: User is now:",
        currentUser ? currentUser.email || "Anonymous" : "Logged Out"
      );
    });
    return () => unsubscribe();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "addProduct":
        return <AddEditProductForm onComplete={getProducts} />;

      case "allProducts":
        return (
          <Box sx={{ padding: 4 }}>
            <Typography variant="h5" gutterBottom>
              All Products
            </Typography>
            {editProductId ? (
              <AddEditProduct
                productId={editProductId}
                onComplete={() => {
                  setEditProductId(null);
                  getProducts();
                }}
              />
            ) : (
              <div className={styles.products}>
                {data.length === 0 ? (
                  <p>No products found</p>
                ) : (
                  data.map((product) => (
                    <AdminProductCard
                      key={product.id}
                      product={product}
                      onEdit={(id) => setEditProductId(id)}
                      onDelete={getProducts}
                    />
                  ))
                )}
              </div>
            )}
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

  // ✅ Auth Loading Spinner
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

  // ✅ Login Page
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

  // ✅ Admin Dashboard
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
