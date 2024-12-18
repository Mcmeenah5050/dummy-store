import { useState } from "react";
import { getAllOrders, deleteAnOrder } from "../../api/api";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../hooks/useStore";
import { Spinner } from "../../components";
import { formatCurrency } from "../../utils/formatCurrency";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Orders() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeBtn, setActiveBtn] = useState(0);
  const [err, setError] = useState(null);
  const { accessToken } = useAuth();
  const { error, data, loading, setData } = useFetch(getAllOrders, accessToken);

  console.log(data);

  const deleteOrder = async (orderId) => {
    setIsDeleting(true);
    try {
      const res = await deleteAnOrder(orderId, accessToken);
      if (res.status === 200) {
        toast.success(res.data);
        setData((prev) => prev.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.log(error);
      setError(
        error.response.data.message ||
          error?.response.data?.error ||
          error?.message
      );
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="max-w-[1024px] mt-[3rem] mx-auto py-6 px-4">
      <h1 className="text-3xl mb-4">Customer orders</h1>
      {error || (err && <span>{error || err}</span>)}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {data?.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Order Id</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {data.map((item, index) => (
                  <tbody key={item._id}>
                    <tr className="hover">
                      <th>{index + 1}</th>
                      <th>{item._id}</th>
                      <th>
                        {item.orderItems.map((product) => (
                          <div
                            className="flex justify-between items-center mb-4"
                            key={product._id}
                          >
                            <div className="flex gap-2 items-center">
                              <img
                                src={product.images[0]}
                                alt="productimg"
                                className="w-[50px] h-[50px]"
                              />
                              <div>
                                <p className="text-sm">{product.title}</p>
                                <p>x {product.qty}</p>
                              </div>
                            </div>
                            <p>{formatCurrency(product.price)}</p>
                          </div>
                        ))}
                      </th>
                      <th>{item.qty}</th>
                      <th>{formatCurrency(item.total)}</th>
                      <th>
                        <Link to={`/orders/${item._id}`}>
                        <button className="btn btn-xs btn-success mr-2">
                          View
                        </button>
                        </Link>
                        <button className="btn btn-xs btn-error text-white" onClick={() => {
                            deleteOrder(item?._id);
                            setActiveBtn(index);
                          }}>
                           {activeBtn === index && isDeleting ? "Deleting..." : "Delete" }
                        </button>
                      </th>
                    </tr>
                  </tbody>
                ))}
              </div>
            </div>
          ) : (
            <p>No orders created yet</p>
          )}
        </>
      )}
    </div>
  );
}
