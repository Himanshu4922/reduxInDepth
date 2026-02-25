import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

function Home() {
  const productsState = useSelector((allState) => allState.products.list);
  const isProductsStateLoading = useSelector(
    (allState) => allState.products.loading,
  );
  const isError = useSelector((allState) => allState.products.error);
  return (
    <div>
      <h1 className="text-center text-3xl">Products List</h1>
      {isProductsStateLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>{isError}</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {productsState.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Home;
