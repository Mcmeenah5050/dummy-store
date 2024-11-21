import { Outlet } from "react-router-dom";
import { Nav } from "../components";


export default function Roots() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}
