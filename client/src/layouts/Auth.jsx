import { Outlet } from "react-router-dom";

export default function Auth() {
  return (
    <>
      <div className="max-w-screen mx-auto md:flex items-center">
        <div className="md:w-[55%] lg:w-[65%] bg-gradient-to-r from-cyan-500 to-blue-500 h-screen hidden md:flex items-center justify-center text-slate-50 ">
          <div>
            <h1 className="text-6xl font-bold">Dummy Store</h1>
            <h1 className="text-2xl font-semibold">
              Login to continue your purchase
            </h1>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
