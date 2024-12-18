import { Link, useLocation, useParams } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function ProductCard({ item }) {
  const location = useLocation()
  const {categoryName} = useParams ()
  return (
    <div className={`${location.pathname === `/>products/${categoryName}` ? "w-full" : "w-[180px] lg:w-[220px]"} mb-4`}>
      <Link to={`/product/${item.title}`}>
        <div className="bg-gray-200">
          <LazyLoadImage
            src={item.images[0]}
            className="mx-auto h-[200px] py-6 object-contain"
            effect="blur"
            width="100%"
          />
        </div>
      </Link>

      <div className="bg-zinc-200 py-6 px-3">
        <h1 className="font-semibold">
          {item.title.length > 20
            ? item.title.slice(0, 25) + "..."
            : item.title}
        </h1>
        <p className="text-sm">{formatCurrency(item.price)}</p>
      </div>
    </div>
  );
}
