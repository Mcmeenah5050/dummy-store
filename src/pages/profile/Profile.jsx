import { useAuth } from "../../hooks/useStore";

export default function Profile() {
  const { user } = useAuth();
  const { data } = user || {}

  return (
    <div className="max-w-[1024px] mx-auto py-6 px-4">
      <div className="md:flex justify-between">
        <div>
          <img src={data?.image} alt={data?.username} />
          <h1 className="mt-4 font-bold text-3xl">
            {data.firstName.concat(" ", data.lastName)}
          </h1>
          <p className="text-xl">Age: {data.age}</p>
          <p className="text-xl">Address: {data.address.address}</p>
          <p className="text-xl">State: {data.address.state}</p>
          <p className="text-xl">Country: {data.address.country}</p>
        </div>
        <div className="">
          <h1 className="mt-4 font-bold text-xl">Gender: {data?.gender}</h1>
          <p>Phone: {data?.phone}</p>
          <p>Department: {data?.company?.department}</p>
          <p>Title: {data?.company?.title}</p>
          <p>Role: {data?.role}</p>
          <p>Email: {data?.email}</p>
        </div>
      </div>
    </div>
  );
}
