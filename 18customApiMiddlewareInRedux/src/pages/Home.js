import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import {
  getAllProducts,
  getProductsError,
  getProductsLoadingState,
} from "../store/slices/productSlice";

function Home() {
  const productsState = useSelector(getAllProducts);
  const isProductsStateLoading = useSelector(getProductsLoadingState);
  const isError = useSelector(getProductsError);
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
