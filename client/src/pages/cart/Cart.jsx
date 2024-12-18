import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { CiCircleMinus, CiCirclePlus, CiShoppingCart } from "react-icons/ci";

export default function Cart() {
  const { cartItems, decreaseCartQty, priceTotal, removeFromCart, addToCart } = useAuth();

  return (
    <div className="max-w-[1024px] mt-[3rem] mx-auto py-6 px-4">
      {cartItems?.length > 0 ? (
        <>
          <div className="mt-4 text-center">
            <h1 className="text-2xl">
              Your cart total is {formatCurrency(priceTotal)}{" "}
            </h1>
            <Link to="/checkout">
              <button className="btn btn-success mt-4 w-[200px] text-white">
                Checkout
              </button>
            </Link>
            <div className="mt-10">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="md:flex justify-between md:justify-start mb-4 gap-4"
                >
                  <div className="md:flex flex-wrap md:flex-nowrap gap-2 md:gap-4">
                    <Link to={`/product/${item.title}`}>
                      <img
                        src={item?.images[0]}
                        alt={item.title}
                        className="w-[130px] h-[130px]"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                  <div>
                    <Link to={`/product/${item.title}`} className="text-xl">
                      <p className="text-start">{item.title}</p>
                    </Link>
                    <div className="flex justify-between md:justify-start gap-4 items-center">
                      <p>{formatCurrency(item.price)}</p>
                      <div className="flex gap-2 items-center p-2">
                        <CiCircleMinus
                          className="cursor-pointer"
                          onClick={() => decreaseCartQty(item)}
                        />
                        <span>{item.qty}</span>
                        <CiCirclePlus
                          className="cursor-pointer"
                          onClick={() => addToCart(item)}
                        />
                      </div>
                    </div>
                  </div>
                  <p
                    className="flex-grow text-right cursor-pointer"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </p>
                </div>
              ))}
            </div>
            <Link to="/checkout">
              <button className="btn btn-success mt-4 w-[200px] text-white">
                Checkout
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div className="mt-5 flex flex-col justify-center items-center">
            <CiShoppingCart size="50px"/>
            <p className="text-xl font-semibold">Your cart is currently empty</p>
            <Link to="/">
            <button className="btn btn-primary mt-4 text-white"> Start Shopping</button>
            </Link>
        </div>
      )}
    </div>
  );
}
