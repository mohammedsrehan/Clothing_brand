// src/app/store/cartSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Define the type for a single item in the cart
export interface CartItem {
  id: string;
  collectionName: string;
  productName: string;
  price: number;
  image: string; // The primary image URL
  quantity: number;
  size: string | null; // Selected size for this cart item
  color: string | null; // Selected color for this cart item
}

// 2. Define the type for the entire cart state
interface CartState {
  items: CartItem[];
}

// 3. Initial state
const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Action to add an item to the cart
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const newItem = action.payload;

      // Logic to check if the exact item (by id, size, and color) already exists
      const existingItem = state.items.find(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingItem) {
        // If it exists, just increase the quantity
        existingItem.quantity += 1;
      } else {
        // Otherwise, add the new item with quantity 1
        state.items.push({ ...newItem, quantity: 1 });
      }
    },
    // Action to remove an item from the cart (optional: remove by ID and options)
    removeFromCart: (state, action: PayloadAction<{ id: string; size: string | null; color: string | null }>) => {
      state.items = state.items.filter(
        (item) =>
          !(item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color)
      );
    },
    // Action to clear the entire cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;