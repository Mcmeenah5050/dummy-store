import { Link } from "react-router-dom";
import { getAllProducts } from "../../api/api";
import useFetch from "../../hooks/useFetch";
import { formatCurrency } from "../../utils/formatCurrency";
import { useEffect, useState } from "react";
import { Spinner } from "../../components";
import BestSeller from "./components/BestSeller";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Home() {
  const [product, setProduct] = useState([]);
  const { error, data, loading } = useFetch(getAllProducts);

  useEffect(() => {
    const lastSelected = localStorage.getItem("lastSelected");
    const lasTimeStamp = localStorage.getItem("lastItemStamp");
    const now = Date.now();

    if (data?.length > 0) {
      if (
        !lastSelected ||
        !lasTimeStamp ||
        now - lasTimeStamp > 20 * 60 * 1000
      ) {
        const randomProductIndex = Math.floor(Math.random() * data?.length);
        setProduct([data[randomProductIndex]]);
        localStorage.setItem("lastSelected", randomProductIndex);
        localStorage.setItem("lastTimeStamp", now);
      } else {
        setProduct([data[lastSelected]]);
      }
    }
  }, [data]);

  return (
    <div className="max-w-[1024px] mt-[3rem] mx-auto py-6 px-4">
      {error && <span>{error}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {product?.map((item) => (
            <div
              className="flex flex-col-reverse md:flex-row h-[500px]"
              key={item._id}
            >
              <div className="md:w-[50%] flex items-center justify-center">
                <div className="text-center px-4">
                  <h1 className="text-xl mb-4">Product of the day</h1>
                  <h1 className="text-5xl font-bold mb-4">{item.title}</h1>
                  <h1 className="text-2xl">{formatCurrency(item.price)}</h1>
                  <Link to={`/product/${item.title}`}>
                    <button className="bg-green-700 text-zinc-50 font-semibold p-3 rounded-full w-[200px] hover:opacity-90 mt-6">
                      View product
                    </button>
                  </Link>
                </div>
              </div>
              <div className="md:w-[50%]">
                <LazyLoadImage
                  src={item.images[0]}
                  alt={"item.title"}
                  className="h-[450px] lg:h-[600px] w-full"
                  effect="blur"
                />
              </div>
            </div>
          ))}
        </>
      )}
      <BestSeller products={data} />
    </div>
  );
}
