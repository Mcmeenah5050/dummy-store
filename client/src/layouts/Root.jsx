import { Outlet } from "react-router-dom";
import { Nav } from "../components";

export default function Roots() {
  return (
    <>
      <Nav />
      <div className="bg-white min-h-dvh">
      <Outlet />
      </div>
      
    </>
  );
}
