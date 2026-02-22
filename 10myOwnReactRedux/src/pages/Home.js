import ProductCard from "../components/ProductCard";
import { useSelector } from "../react-redux";

function Home() {
  const productsState = useSelector((allState) => allState.products);
  console.log("rendering");
  return (
    <div>
      <h1 className="text-center text-3xl">Products List</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        {productsState.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}

export default Home;
