import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Login = lazy(() => import("./pages/login"));

function App() {
  return (
    <div className="font-poppins">
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
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </Suspense>
    </div>
  );
}

export default App;
