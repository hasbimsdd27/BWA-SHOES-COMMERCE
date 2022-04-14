import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Login = lazy(() => import("./pages/login"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Order = lazy(() => import("./pages/order"));
const Category = lazy(() => import("./pages/category"));
const Product = lazy(() => import("./pages/product"));
const Chat = lazy(() => import("./pages/chat"));
const NotFound = lazy(() => import("./pages/notFound"));

function App() {
  return (
    <div className="font-poppins overflow-y-hidden">
      <Suspense
        fallback={
          <div className="w-screen h-screen bg-app-bg-primary flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/category" element={<Category />} />
            <Route path="/product" element={<Product />} />
            <Route path="/order" element={<Order />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </Suspense>
    </div>
  );
}

export default App;
