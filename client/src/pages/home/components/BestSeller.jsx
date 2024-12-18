
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

export default function BestSeller({ products }) {
  
  const getPrices = products.map((product) => product.price);
  const maxPrice = Math.max(...getPrices);
  const minPrice = Math.min(...getPrices)

  const filterHighPrices = products?.filter(
    (product) => product.price == maxPrice
  );

  const filterLowPrice = products?.filter(
    (product) => product.price == minPrice
  );

  return (
    <div className="mt-32 max-w-[1024px] mx-auto">
      <h1 className="font-semibold text-xl">Best Sellers</h1>
      <div className="md:flex mt-6">
        {filterHighPrices.map((product) => (
          <div className="md: w-[50%] relative" key={product._Id}>
            <Link to={`/product/${product.title}`}>
            <LazyLoadImage
              src={product.images[0]}
              alt={"product.title"}
              className="h-full w-full"
              effect="blur"
            />
            </Link>
            <p className="absolute top-1/2 text-xl font-bold px-4">
              {product.title}
            </p>
          </div>
        ))}
        {filterLowPrice.map((product) => (
          <div className="md: w-[50%] relative" key={product._Id}>
            <Link to={`/product/${product.title}`}>
          <LazyLoadImage
            src={product.images[0]}
            alt={"product.title"}
            className="h-full w-full"
            effect="blur"
          />
          </Link>
          <p className="absolute top-1/2 text-xl font-bold">
            {product.title}
          </p>
        </div>
        ))}
      </div>
      {/* <div className="w-full flex justify-between absolute top-[50%]">
        <MdKeyboardArrowLeft
          size="35px"
          className="cursor-pointer z-30 hover:bg-white"
          onClick={() => scroll("left")}
        />
        <MdKeyboardArrowRight
          size="35px"
          className="cursor-pointer z-30 hover:bg-white"
          onClick={() => scroll("right")}
        />
      </div> */}
    </div>
  );
}
