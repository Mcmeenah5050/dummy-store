import { searchProducts } from "../../api/api";
import { ProductCard, Spinner } from "../../components";
import useFetch from "../../hooks/useFetch";
import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  console.log(query);
  const { data, error, loading } = useFetch(searchProducts, query);
  

  return (
    <div className="max-w-[1024px] mx-auto py-6 px-4">
      <h1 className="text-xl">
        Search results for <strong>{query}:</strong>
        {""}
        <span className="mx-2">{data?.length} product(s) found</span>
      </h1>
      <div className="mt-6">
        {error && <span>{error}</span>}
        {loading ? <Spinner/>: 
        <>
        {data?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data?.map((product) => (
              <ProductCard item = {product} key={product._id} />
          ))}
          </div>
        ) : <p>No results found</p>}
        
        </>}
        </div>
    </div>
  );
}
