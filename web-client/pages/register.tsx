import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import SVGAssets from "../assets/svg";

function Login() {
  const router = useRouter();
  const [focus, setFocus] = useState<{ [name: string]: boolean }>({});
  const [error, setError] = useState<{ [name: string]: boolean }>({});

  const RegexRef = useRef<{ [name: string]: RegExp }>({
    email: /\S+@\S+\.\S+/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    phoneNumber: /\+?([ -]?\d+)+|\(\d+\)([ -]\d+)/,
    fullname: /^.{3,}$/,
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
    } else if (event.target.name === "repeatPassword") {
      const passwordValue = (
        document.querySelector('input[name="password"]') as HTMLInputElement
      ).value;
      setError((prev) => ({
        ...prev,
        [event.target.name]: passwordValue !== event.target.value,
      }));
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
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Register</h1>
          <p className="text-app-secondary">Create your account</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mb-8">
            <div className="font-bold mb-2">Fullname</div>
            <div
              className={[
                "flex flex-row border-2 rounded-md p-4 items-center",
                (() => {
                  if (error.fullname) {
                    return "border-app-danger";
                  } else if (focus.fullname) {
                    return "border-app-primary";
                  } else {
                    return "border-app-secondary";
                  }
                })(),
              ].join(" ")}
              id="fullname-input"
            >
              <div className="mr-2">
                <SVGAssets.FullnameIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-1">
                <input
                  className="bg-transparent outline-none w-full"
                  placeholder="Your fullname"
                  name="fullname"
                  type="text"
                  onFocus={() => {
                    setFocus((prev) => ({ ...prev, fullname: true }));
                  }}
                  onBlur={() => {
                    setFocus((prev) => ({ ...prev, fullname: false }));
                  }}
                  onChange={HandleValidation}
                />
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="font-bold mb-2">Phone Number</div>
            <div
              className={[
                "flex flex-row border-2 rounded-md p-4 items-center",
                (() => {
                  if (error.phoneNumber) {
                    return "border-app-danger";
                  } else if (focus.phoneNumber) {
                    return "border-app-primary";
                  } else {
                    return "border-app-secondary";
                  }
                })(),
              ].join(" ")}
              id="phoneNumber-input"
            >
              <div className="mr-2">
                <SVGAssets.PhoneIcon className="fill-app-primary h-4 w-4" />
              </div>
              <div className="flex flex-1">
                <input
                  className="bg-transparent outline-none w-full"
                  placeholder="Your phone number"
                  name="phoneNumber"
                  type="tel"
                  onFocus={() => {
                    setFocus((prev) => ({ ...prev, phoneNumber: true }));
                  }}
                  onBlur={() => {
                    setFocus((prev) => ({ ...prev, phoneNumber: false }));
                  }}
                  onChange={HandleValidation}
                />
              </div>
            </div>
          </div>
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
            <div className="font-bold ">Password</div>
            <div className="text-xs mb-2 text-app-secondary">
              Min 8 char, must includes at least 1 number and 1 Uppercase
            </div>
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
          <div className="mb-8">
            <div className="font-bold ">Repeat Password</div>
            <div className="text-xs mb-2 text-app-secondary">
              Min 8 char, must includes at least 1 number and 1 Uppercase
            </div>
            <div
              className={[
                "flex flex-row border-2 rounded-md p-4 items-center",
                (() => {
                  if (error.repeatPassword) {
                    return "border-app-danger";
                  } else if (focus.repeatPassword) {
                    return "border-app-primary";
                  } else {
                    return "border-app-secondary";
                  }
                })(),
              ].join(" ")}
              id="repeat-password-input"
            >
              <div className="mr-2">
                <SVGAssets.PasswordIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-1">
                <input
                  className="bg-transparent outline-none w-full"
                  placeholder="Repeat Your Password"
                  name="repeatPassword"
                  type="password"
                  onFocus={() => {
                    setFocus((prev) => ({ ...prev, repeatPassword: true }));
                  }}
                  onBlur={() => {
                    setFocus((prev) => ({ ...prev, repeatPassword: false }));
                  }}
                  onChange={HandleValidation}
                />
              </div>
            </div>
          </div>
          <div>
            <button className="w-full p-4 bg-app-primary rounded-md">
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-4 text-sm text-center text-app-secondary">
          Doesn't have account?{" "}
          <span
            onClick={() => {
              router.push("/login");
            }}
            className="text-app-info cursor-pointer"
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
