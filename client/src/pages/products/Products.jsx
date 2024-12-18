import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { getProductsByCategory } from "../../api/api";
import { ProductCard, Spinner } from "../../components";

export default function Products() {
  const { categoryName } = useParams();
  const { error, data, loading } = useFetch(
    getProductsByCategory,
    categoryName,
  );
  

  return (
    <div className="max-w-[1024px] mx-auto py-6 px-4">
      <h1 className="uppercase my-4 font-semibold text-xl">{categoryName}</h1>
      {error && <span>{error}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {data?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data?.map((product) => (
                <ProductCard item={product} key={product._Id} />
              ))}
            </div>
          ) : (
            <p>No products to display for this category.</p>
          )}
          ;
        </>
      )}
    </div>
  );
}
