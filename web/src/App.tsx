import { Component, lazy } from "solid-js";
import { useRoutes } from "solid-app-router";

const routes = [
  {
    path: "/login",
    component: lazy(() => import("./pages/login")),
  },
  {
    path: "/register",
    component: lazy(() => import("./pages/register")),
  },
];

const App: Component = () => {
  const Routes = useRoutes(routes);
  return (
    <div class="w-screen h-screen font-poppins">
      <Routes />
    </div>
  );
};

export default App;
