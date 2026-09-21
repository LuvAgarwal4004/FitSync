import CollectionClient from "@/components/CollectionClient";

export default async function ProductPage({ params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/products?collectionId=${id}`,
    { cache: "no-store" }
  );

  const products = await res.json();

  return (
    <CollectionClient
      products={products}
      collectionId={id}
    />
  );
}