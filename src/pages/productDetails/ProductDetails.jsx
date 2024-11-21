import { getAllProducts, getASingleProduct } from "../../api/api";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import Spinner from "../../components/Spinner";
import Recommended from "./components/Recommended";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function ProductDetails() {
  const { productId } = useParams();
  const { data, error, loading } = useFetch(getASingleProduct, productId);
  const { data: allProducts, error: err } = useFetch(getAllProducts);
  console.log(data);
  console.log("all, allProducts");

  const filterRecommendedProducts = allProducts?.products
    ?.filter((item) => item.category !== data.category)
    .sort(() => 0.5 - Math.random())
    .slice(0, 15);

  console.log(filterRecommendedProducts);

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4">
      {error && <span>{error}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="lg:flex">
            <div className="lg:w-[60%]">
              <div
                className={`grid ${
                  data?.images?.length > 1 ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                {data?.images?.map((item, index) => (
                  <LazyLoadImage
                    key={index}
                    src={item}
                    alt={data.title}
                    className="w-full md:h-[400px] mb-4 object-contain"
                    effect="blur"
                  />
                ))}
              </div>
            </div>
            <div className="lg:w-[40%] text-center">
              <h1 className="text-3xl font-semibold">{data.title}</h1>
              <p className="mt-8 text-xl">{formatCurrency(data.price)}</p>
              <p className="text-xl mt-4">
                Rating: <span>{data.rating}</span>
              </p>
              <p className="text-xl mt-4">
                Status: <span>{data.availabilityStatus}</span>
              </p>
              <p className="text-xl mt-4">
                Category: <span>{data.category}</span>
              </p>
              <button className="mt-6 bg-slate-600 text-white w-[200px] h-[48px] border-0">
                Add To Cart
              </button>

              <div className="text-start md:px-8">
                <hr className="my-8" />
                <h1 className="text-xl">Description</h1>
                <p className="mt-4">{data.description}</p>
                <p className="font-semibold mr-2">
                  <span>Shipping:</span>
                  {data.shippingInformation}
                </p>
              </div>
            </div>
          </div>
          <>
            {err && <span>{err}</span>}
            <Recommended recommendedProducts={filterRecommendedProducts} />
          </>
        </>
      )}
    </div>
  );
}
