import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen bg-app-bg-primary flex items-center justify-center">
      <div className="p-4 bg-purple-800 text-white rounded-md text-center">
        <h1 className="text-2xl font-bold mb-2">Oooppss...!!!</h1>
        <p>
          Seems you are hot lost, click{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            here
          </span>{" "}
          to go back
        </p>
      </div>
    </div>
  );
}

export default NotFound;
