import { getASingleProduct } from "../../api/api";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import Spinner from "../../components/Spinner";
import Recommended from "./components/Recommended";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useAuth } from "../../hooks/useStore";
import { toast } from "sonner";

export default function ProductDetails() {
  const { productTitle } = useParams();
  const { data, error, loading } = useFetch(getASingleProduct, productTitle);
  const { addToCart } = useAuth();

  const addItemsToCart = (product) => {
    addToCart(product);
    toast.success(`${product.title} added to your cart`);
  };

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
                  data?.product?.images?.length > 1
                    ? "grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {data?.product?.images?.map((item, index) => (
                  <LazyLoadImage
                    key={index}
                    src={item}
                    alt={data.product.title}
                    className="w-full md:h-[400px] mb-4 object-contain"
                    effect="blur"
                  />
                ))}
              </div>
            </div>
            <div className="lg:w-[40%] text-center">
              <h1 className="text-3xl font-semibold">{data?.product?.title}</h1>
              <p className="mt-8 text-xl">
                {formatCurrency(data?.product?.price)}
              </p>

              <p className="text-xl mt-4">
                Status:{" "}
                <span>
                  {data?.product?.inStock ? "inStock" : "Out of Stock"}
                </span>
              </p>
              <p className="text-xl mt-4">
                Category: <span>{data?.product?.category}</span>
              </p>
              <button
                className="mt-6 bg-slate-600 text-white w-[200px] h-[48px] border-0"
                onClick={() => addItemsToCart(data?.product)}
              >
                Add To Cart
              </button>

              <div className="text-start md:px-8">
                <hr className="my-8" />
                <h1 className="text-xl">Description</h1>
                <p className="mt-4">{data?.product?.description}</p>
              </div>
            </div>
          </div>
          <>
            <Recommended recommendedProducts={data.getRecommended} />
          </>
        </>
      )}
    </div>
  );
}
