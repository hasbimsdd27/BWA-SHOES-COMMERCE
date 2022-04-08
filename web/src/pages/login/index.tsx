import { useNavigate } from "solid-app-router";
import type { Component } from "solid-js";
import SVGAssets from "../../assets/svg";
import { Input } from "../../component/form";

const Login: Component = () => {
  const navigate = useNavigate();
  return (
    <div class="h-screen w-screen flex bg-app-background text-app-white flex-col items-center justify-center">
      <div class="w-80">
        <div class="flex items-center justify-center mb-8">
          <SVGAssets.MainLogo />
        </div>
        <div class="text-center mb-10">
          <h1 class="text-3xl font-bold mb-2">Hello Again!</h1>
          <p class="text-app-gray">
            Please enter your email and password to continue using this app
          </p>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input
              placeholder="Your Email Address"
              icon={<SVGAssets.EmailIcon />}
              id="email"
              label="Email"
              name="email"
              type="email"
              className="mb-6"
            />

            <Input
              placeholder="Your Password"
              icon={<SVGAssets.PassowrdIcon />}
              id="password"
              label="Password"
              name="password"
              type="password"
              className="mb-12"
            />

            <div>
              <button
                class="bg-app-primary w-full p-4 rounded-md cursor-pointer"
                type="submit"
              >
                {" "}
                Sign In
              </button>
            </div>
          </form>
          <div class="text-app-gray text-center mt-12">
            Don't have an account?{" "}
            <span
              class="text-app-primary cursor-pointer"
              onClick={() => {
                navigate("/register");
              }}
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
