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
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/firebase";

import imageCompression from "browser-image-compression";

interface ProductInput {
  collectionName: string;
  productName: string;
  price: number;
  size: string[];
  colorOptions: string;
  description: string;
  top: string;
  bottom: string;
  dupatta: string;
  images: string[];
  stitchingType: string;
}

interface ProductSaved extends Omit<ProductInput, "colorOptions" | "size"> {
  colorOptions: string[];
  size: string[];
}

const sizes = [
  "Free-size Material",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
  "7XL",
  "8XL",
];
const stitchingOptions = ["Stitched", "Unstitched", "semi-Stitched"];

interface Props {
  productId?: string;
  onComplete?: () => void;
}

const AddEditProduct: React.FC<Props> = ({ productId, onComplete }) => {
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
    stitchingType: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(productId);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as ProductSaved;

        setProduct({
          ...data,
          colorOptions: data.colorOptions.join(", "),
        });
      }
    };

    fetchProduct();
  }, [productId]);

  // ---------------------------
  // COMPRESS IMAGES HERE
  // ---------------------------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1500,
      useWebWorker: true,
    };

    try {
      const compressedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          try {
            return await imageCompression(file, options);
          } catch (err) {
            console.error("Compression failed:", err);
            return file;
          }
        })
      );

      setFiles(compressedFiles);
    } catch (error) {
      console.error("Compression error:", error);
      setMessage("Error compressing images.");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // -------------------------------------
  // HANDLE SUBMIT + API ERROR LOG DISPLAY
  // -------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(isEditMode ? "Updating product..." : "Adding product...");

    try {
      const colorArray = product.colorOptions
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      const productData = {
        ...product,
        colorOptions: colorArray,
        size: product.size,
      };

      // -------------------------
      // UPLOAD IMAGES
      // -------------------------
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await uploadResponse.json();

        // If API returned error → show to user
        if (!uploadResponse.ok) {
          const apiError = result?.error || "Image upload failed";
          setMessage(`Upload error: ${apiError}`);
          throw new Error(apiError);
        }

        // Filter undefined URLs
        let urls = result.urls || [];
        urls = urls.filter((u: string | undefined) => u && u !== "");

        if (urls.length === 0) {
          throw new Error("No valid images returned from Cloudinary.");
        }

        productData.images = urls;
      }

      // -------------------------
      // SAVE TO FIRESTORE
      // -------------------------
      if (isEditMode && productId) {
        await updateDoc(doc(db, "products", productId), productData);
        setMessage("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: serverTimestamp(),
        });
        setMessage("Product added successfully!");
      }

      if (onComplete) onComplete();
      setFiles([]);
    } catch (err: any) {
      console.error("Product save error:", err);
      setMessage(`Error: ${err.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          {isEditMode ? "Edit Product" : "Add Product"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Collection Name"
            name="collectionName"
            value={product.collectionName}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Product Name"
            name="productName"
            value={product.productName}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
          />

          <TextField
            select
            fullWidth
            margin="normal"
            label="Stitching Type"
            name="stitchingType"
            value={product.stitchingType}
            onChange={handleChange}
          >
            {stitchingOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Sizes"
            name="size"
            value={product.size}
            onChange={(e: any) =>
              setProduct((p) => ({ ...p, size: e.target.value }))
            }
            SelectProps={{
              multiple: true,
              renderValue: (selected: any) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((v) => (
                    <Chip key={v} label={v} size="small" />
                  ))}
                </Box>
              ),
            }}
          >
            {sizes.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Color Options"
            name="colorOptions"
            value={product.colorOptions}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            margin="normal"
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Top Fabric"
            name="top"
            value={product.top}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Bottom Fabric"
            name="bottom"
            value={product.bottom}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Dupatta Fabric"
            name="dupatta"
            value={product.dupatta}
            onChange={handleChange}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Upload New Images</Typography>
            <input type="file" multiple onChange={handleFileChange} />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : isEditMode ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </Button>

          {message && (
            <Typography
              align="center"
              sx={{ mt: 2 }}
              color={message.includes("Error") ? "error" : "success.main"}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AddEditProduct;
