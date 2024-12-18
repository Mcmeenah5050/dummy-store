import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useStore";
import { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { formatCurrency } from "../../utils/formatCurrency";
import { createOrder } from "../../api/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [trackStep, setTrackStep] = useState(1);
  const [error, setError] = useState(null);
  const { cartItems, priceTotal, accessToken, cartQuantity, setCartItems } =
    useAuth();
  const [checkoutDetails, setCheckoutDetails] = useLocalStorage("checkout", {});
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullname: checkoutDetails.fullname,
      address: checkoutDetails.address,
      phone: checkoutDetails.phone,
      paymentMethod: checkoutDetails.paymentMethod,
    },
  });

  const navigate = useNavigate();

  const forward = () => {
    setTrackStep((prev) => prev + 1);
  };

  const backward = () => {
    setTrackStep((prev) => prev - 1);
  };

  const onFormSubmit = async (data) => {
    const orderData = {
      ...data,
      total: priceTotal,
      qty: cartQuantity,
      orderItems: cartItems,
    };
    try {
      const res = await createOrder(orderData, accessToken);
      if (res.status === 201) {
        toast.success(res.data.msg);
        setCartItems([]);
        navigate(`/orders/${res.data.order._id}`);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      setError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message
      );
    }
  };

  return (
    <div className="max-w-[1024px] mt-[3rem] mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <form
        className="mt-6 max-w-[400px] mx-auto"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        {error && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! {error}.</span>
          </div>
        )}
        <ul className="steps steps-vertical lg-steps-horizontal my-8 w-full">
          <li className={`step ${trackStep === 1 && "step-primary"} mr-6`}>
            Shipping details
          </li>
          <li className={`step ${trackStep === 2 && "step-primary"}`}>
            Payment method
          </li>
          <li className={`step ${trackStep === 3 && "step-primary"}`}>
            Order summary
          </li>
        </ul>
        {trackStep === 1 && (
          <div>
            <div className="my-4 form-control">
              <label htmlFor="fullname">Full name</label>
              <input
                type="text"
                placeholder="fullname"
                className="w-full h-[48px] border-2 pl-3"
                {...register("fullname", { required: true })}
                name="fullname"
                id="fullname"
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm">
                  Full name of receiver is required
                </p>
              )}
            </div>
            <div className="my-4 form-control">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                placeholder="address"
                className="w-full h-[48px] border-2 pl-3"
                {...register("address", { required: true })}
                name="address"
                id="address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">Address is required</p>
              )}
            </div>
            <div className="my-4 form-control">
              <label htmlFor="phone">Phone number</label>
              <input
                type="tel"
                placeholder="phone number"
                className="w-full h-[48px] border-2 pl-3"
                {...register("phone", { required: true })}
                name="phone"
                id="phone"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">
                  Phone number of the receiver is required
                </p>
              )}
            </div>
            <button
              className="btn w-full"
              type="button"
              onClick={handleSubmit((data) => {
                setCheckoutDetails(data);
                forward();
              })}
            >
              Next
            </button>
          </div>
        )}
        {trackStep === 2 && (
          <>
            <label className="form-control">
              <div className="label mx-auto">
                <span>Choose payment method</span>
              </div>
              <select
                className="mt-6 select select-bordered"
                {...register("paymentMethod", { required: true })}
              >
                <option disabled selected value="">
                  Pick one
                </option>
                <option value="cash">Cash</option>
              </select>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm">
                  Please select a mode of payment
                </p>
              )}
            </label>
            <div className="mt-6">
              <button
                className="btn btn-success w-full text-white"
                type="button"
                onClick={handleSubmit((data) => {
                  setCheckoutDetails(data);
                  forward();
                })}
              >
                Next
              </button>
              <button
                className="btn btn-primary btn-outline w-full text-white mt-4"
                onClick={backward}
              >
                Go Back
              </button>
            </div>
          </>
        )}
        {trackStep === 3 && (
          <div>
            <h1 className="text-center">Your order info</h1>
            <div>
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 mb-4">
                  <img
                    src={item.images[0]}
                    className="w-[70px] h-[70px] alt={item.title}"
                  />
                  <div>
                    <p className="">{item.title}</p>
                    <p>{formatCurrency(item.price)}</p>
                    <p>Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
              <p className="text-right mt04 font-bold">Total: {priceTotal}</p>
            </div>
            <div>
              <h1>Shipping summary</h1>
              <h1>
                <span className="font-bold mr-2">Customer name:</span>{" "}
                {checkoutDetails.fullname}
              </h1>
              <h1>
                <span className="font-bold mr-2">Customer address:</span>{" "}
                {checkoutDetails.address}
              </h1>
              <h1>
                <span className="font-bold mr-2">Customer phone:</span>{" "}
                {checkoutDetails.phone}
              </h1>
            </div>
            <div className="mt-6">
              <button
                className="btn btn-success w-full text-white"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating order" : "Create order"}
              </button>
              <button
                className="btn btn-primary btn-outline w-full text-white mt-4"
                onClick={backward}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
