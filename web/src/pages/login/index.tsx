import { useNavigate } from "solid-app-router";
import { Component, createSignal } from "solid-js";
import SVGAssets from "../../assets/svg";
import { Input } from "../../component/form";

const Login: Component = () => {
  const navigate = useNavigate();

  const emailValidator = (value: string) => {
    return value.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const passwordValidator = (value: string) => {
    return value.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    );
  };

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
              validator={emailValidator}
            />

            <Input
              placeholder="Your Password"
              icon={<SVGAssets.PassowrdIcon />}
              id="password"
              label="Password"
              name="password"
              type="password"
              className="mb-12"
              validator={passwordValidator}
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
