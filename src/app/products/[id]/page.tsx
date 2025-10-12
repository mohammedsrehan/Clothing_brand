"use client"; // Must be a client component to use useState

import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar/navbar';
import ProductDetails from '@/app/components/ProductDetails/productDetails';
import CartModal from '@/app/components/Cart/CartModal';

// The component now accepts the correctly typed props
export default function Page() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="p-6">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* We pass the product ID from the route params to the details component. 
        Note: You will need to update ProductDetails to accept this prop.
      */}
      <ProductDetails /> 
      
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}
