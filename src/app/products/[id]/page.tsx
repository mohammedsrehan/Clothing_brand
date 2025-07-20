// app/product/[id]/page.tsx
import ProductDetails from '@/app/components/ProductDetails/productDetails';
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  // Replace with your actual API or data source
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) return notFound();

  return (
    <div className="p-6">
      <ProductDetails />
    </div>
  );
}
