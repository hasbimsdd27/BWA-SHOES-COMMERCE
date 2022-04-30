import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import SVGAssets from "../assets/svg";

function Login() {
  const router = useRouter();
  const [focus, setFocus] = useState<{ [name: string]: boolean }>({});
  const [error, setError] = useState<{ [name: string]: boolean }>({});

  const RegexRef = useRef<{ [name: string]: RegExp }>({
    email: /\S+@\S+\.\S+/,
  });

  const HandleValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!!RegexRef.current[event.target.name]) {
      if (
        error[event.target.name] !==
        !RegexRef.current[event.target.name].test(event.target.value)
      ) {
        setError((prev) => ({
          ...prev,
          [event.target.name]: !RegexRef.current[event.target.name].test(
            event.target.value
          ),
        }));
      }
    } else {
      if (event.target.value === "") {
        setError((prev) => ({
          ...prev,
          [event.target.name]: true,
        }));
      } else {
        setError((prev) => ({
          ...prev,
          [event.target.name]: false,
        }));
      }
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-app-bg-primary text-white">
      <div className="">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Login</h1>
          <p className="text-app-secondary">Sign In to Countinue</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mb-8">
            <div className="font-bold mb-2">Email Address</div>
            <div
              className={[
                "flex flex-row border-2 rounded-md p-4 items-center",
                (() => {
                  if (error.email) {
                    return "border-app-danger";
                  } else if (focus.email) {
                    return "border-app-primary";
                  } else {
                    return "border-app-secondary";
                  }
                })(),
              ].join(" ")}
              id="email-input"
            >
              <div className="mr-2">
                <SVGAssets.EmailIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-1">
                <input
                  className="bg-transparent outline-none w-full"
                  placeholder="Your Email Address"
                  name="email"
                  type="email"
                  onFocus={() => {
                    setFocus((prev) => ({ ...prev, email: true }));
                  }}
                  onBlur={() => {
                    setFocus((prev) => ({ ...prev, email: false }));
                  }}
                  onChange={HandleValidation}
                />
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="font-bold mb-2">Password</div>
            <div
              className={[
                "flex flex-row border-2 rounded-md p-4 items-center",
                (() => {
                  if (error.password) {
                    return "border-app-danger";
                  } else if (focus.password) {
                    return "border-app-primary";
                  } else {
                    return "border-app-secondary";
                  }
                })(),
              ].join(" ")}
              id="password-input"
            >
              <div className="mr-2">
                <SVGAssets.PasswordIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-1">
                <input
                  className="bg-transparent outline-none w-full"
                  placeholder="Your Password"
                  name="password"
                  type="password"
                  onFocus={() => {
                    setFocus((prev) => ({ ...prev, password: true }));
                  }}
                  onBlur={() => {
                    setFocus((prev) => ({ ...prev, password: false }));
                  }}
                  onChange={HandleValidation}
                />
              </div>
            </div>
          </div>
          <div>
            <button className="w-full p-4 bg-app-primary rounded-md">
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-4 text-sm text-center text-app-secondary">
          Doesn't have account?{" "}
          <span
            onClick={() => {
              router.push("/register");
            }}
            className="text-app-info cursor-pointer"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
