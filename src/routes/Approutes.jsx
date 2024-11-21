import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, ProductDetails, Products } from "../pages";
import { Spinner } from "../components";
import Search from "../pages/search/Search";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import { PrivateRoutes, PublicRoutes } from "./ProtectedRoutes";

const Root = lazy(() => import("../layouts/Root"));
const Auth = lazy(() => import("../layouts/Auth"));
export default function Approutes() {
  const routes = [
    {
      path: "/",
      element: (
        <Suspense fallback={<Spinner />}>
          <Root />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "products/:categoryName",
          element: <Products />,
        },
        {
          path: "product/:productId",
          element: <ProductDetails />,
        },
        {
          path: "search",
          element: <Search />,
        },

        {
          path: "profile",
          element: (
            <PrivateRoutes>
              <Profile />,
            </PrivateRoutes>
          ),
        },
      ],
    },
    {
      element: (
        <Suspense fallback={<Spinner />}>
          <PublicRoutes>
            <Auth />
          </PublicRoutes>
        </Suspense>
      ),
      children: [
        {
          path: "login",
          element: <Login />,
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
