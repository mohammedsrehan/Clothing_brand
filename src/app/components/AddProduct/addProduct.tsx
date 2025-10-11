"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  MenuItem,
  Chip,
  CircularProgress,
} from "@mui/material";
// Using standard Firebase SDK imports and global variables for single-file environment
import {
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase";

// Interface reflecting the component's state structure
interface ProductInput {
  collectionName: string;
  productName: string;
  price: number;
  size: string[]; // Array for multi-select
  colorOptions: string; // String for user input (comma-separated)
  description: string;
  top: string;
  bottom: string;
  dupatta: string;
  images: string[];
}

// Interface reflecting the final product structure saved to the DB
interface ProductSaved extends Omit<ProductInput, "colorOptions" | "size"> {
  colorOptions: string[]; // Saved as array
  size: string[]; // Saved as array
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const AddProduct = () => {
  const [product, setProduct] = useState<ProductInput>({
    collectionName: "",
    productName: "",
    price: 0,
    size: [],
    colorOptions: "",
    description: "",
    top: "",
    bottom: "",
    dupatta: "",
    images: [],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // The utility function to add product to DB
  const addProductToDB = async (
    data: Omit<ProductSaved, "images">,
    files: File[]
  ) => {
    if (!db) {
      throw new Error("Database not ready.");
    }
    try {
      // 1. Upload images (Mocking external API call)
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      // In this environment, we rely on the host to handle '/api/upload'.
      // If it fails, we fall back to a placeholder image.
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let imageUrls: string[] = [];
      if (response.ok) {
        const result = await response.json();
        imageUrls = result.urls;
      } else {
        console.warn(
          "Image upload API failed or is mocked. Using placeholder image URL."
        );
        imageUrls = [
          "https://placehold.co/400x400/8c9e99/ffffff?text=Product+Image",
        ];
      }

      // 2. Save product data along with image URLs to Firestore

      const docRef = await addDoc(collection(db, "products"), {
        ...data,
        images: imageUrls,
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const { name, value } = e.target;

    const isMultiSelect = name === "size";

    setProduct((prev) => ({
      ...prev,
      [name]: isMultiSelect ? value : name === "price" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Processing...");

    // 1. Validation Checks
    // if (!db) {
    //   setMessage("Database connection not established.");
    //   setLoading(false);
    //   return;
    // }
    if (product.size.length === 0) {
      setMessage("Please select at least one size.");
      setLoading(false);
      return;
    }
    if (!product.colorOptions || product.colorOptions.trim().length === 0) {
      setMessage("Please enter at least one color option.");
      setLoading(false);
      return;
    }
    if (files.length === 0) {
      setMessage("Please upload at least one image.");
      setLoading(false);
      return;
    }

    try {
      // 2. Data Cleaning and Preparation
      // Convert the comma-separated string into a clean array
      const colorArray = product.colorOptions
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color.length > 0);

      // Final object to be saved to DB
      const productToSave: Omit<ProductSaved, "images"> = {
        collectionName: product.collectionName,
        productName: product.productName,
        price: product.price,
        size: product.size,
        colorOptions: colorArray, // Use the clean array
        description: product.description,
        top: product.top,
        bottom: product.bottom,
        dupatta: product.dupatta,
      };

      // 3. Call DB function
      await addProductToDB(productToSave, files);

      setMessage("Product added successfully!");

      // 4. Reset Form
      setProduct({
        collectionName: "",
        productName: "",
        price: 0,
        size: [],
        colorOptions: "",
        description: "",
        top: "",
        bottom: "",
        dupatta: "",
        images: [],
      });
      setFiles([]);
    } catch (error) {
      console.error("Submission error: ", error);
      setMessage("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Inline styling for the form container since external CSS file is unavailable
  const formContainerStyle = {
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    margin: "20px auto",
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={formContainerStyle}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Add New Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Collection Name */}
          <TextField
            fullWidth
            margin="normal"
            label="Collection Name"
            name="collectionName"
            value={product.collectionName}
            onChange={handleChange}
            required
          />
          {/* Product Name */}
          <TextField
            fullWidth
            margin="normal"
            label="Product Name"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            required
          />
          {/* Price */}
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            required
            inputProps={{ min: "0", step: "0.01" }}
          />

          {/* Sizes - Multi-Select Dropdown */}
          <TextField
            fullWidth
            margin="normal"
            select
            label="Available Sizes"
            name="size"
            value={product.size}
            onChange={handleChange}
            required
            SelectProps={{
              multiple: true,
              renderValue: (selected: any) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              ),
            }}
          >
            {sizes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {/* Color Options - User-Typed, Comma Separated */}
          <TextField
            fullWidth
            margin="normal"
            label="Color Options (comma separated)"
            name="colorOptions"
            value={product.colorOptions}
            onChange={handleChange}
            required
            helperText="Enter custom color names separated by commas (e.g., Cherry Red, Ocean Blue)"
          />

          {/* Description */}
          <TextField
            fullWidth
            margin="normal"
            label="Description of Product Details"
            name="description"
            multiline
            rows={4}
            value={product.description}
            onChange={handleChange}
            required
          />
          {/* Top Fabric Details */}
          <TextField
            fullWidth
            margin="normal"
            label="Top Fabric Details"
            name="top"
            value={product.top}
            onChange={handleChange}
            required
          />
          {/* Bottom Fabric Details */}
          <TextField
            fullWidth
            margin="normal"
            label="Bottom Fabric Details"
            name="bottom"
            value={product.bottom}
            onChange={handleChange}
            required
          />
          {/* Dupatta Fabric Details */}
          <TextField
            fullWidth
            margin="normal"
            label="Dupatta Fabric Details"
            name="dupatta"
            value={product.dupatta}
            onChange={handleChange}
            required
          />

          {/* Image Upload */}
          <Box
            sx={{ mt: 3, p: 2, border: "1px dashed #ccc", borderRadius: "4px" }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Upload Product Images
            </Typography>
            <input type="file" multiple onChange={handleFileChange} />
            {files.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selected **{files.length}** file(s) for upload.
              </Typography>
            )}
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Product"
            )}
          </Button>
          {message && (
            <Typography
              variant="body1"
              align="center"
              color={
                message.includes("Error") || message.includes("Please")
                  ? "error"
                  : "success.main"
              }
            >
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProduct;
