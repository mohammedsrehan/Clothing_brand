"use client"; // CRITICAL: This makes the component a client component, allowing hooks like useState

import { useState } from 'react';
import Navbar from '@/app/components/Navbar/navbar';
import ProductDetails from '@/app/components/ProductDetails/productDetails';
import CartModal from '@/app/components/Cart/CartModal'; // Import the CartModal component

// Removed async keyword since we are using client state now
export default function Page({ params }: { params: { id: string } }) {
    
    // 1. Initialize the state to control the visibility of the Cart Modal
    const [isCartOpen, setIsCartOpen] = useState(false);

    // If you need to fetch data on the client side, you would use useEffect here, 
    // but for now, we focus on the UI connection.

    return (
        <div className="p-6">
            
            {/* 2. Pass the state setter function to the Navbar */}
            <Navbar onOpenCart={() => setIsCartOpen(true)} /> 

            <ProductDetails />

            {/* 3. Render the CartModal and control its visibility */}
            <CartModal 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
            />
        </div>
    );
}
