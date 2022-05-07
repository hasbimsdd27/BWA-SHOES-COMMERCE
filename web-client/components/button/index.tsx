import React from "react";

interface IpropsButton {
  className?: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: string | JSX.Element;
  id?: string;
  type?: "button" | "submit" | "reset" | undefined;
}

function Button({
  className,
  onClick,
  loading,
  disabled,
  children,
  id,
  type,
}: IpropsButton) {
  return (
    // </button>
    <button
      type={type || "button"}
      className={[
        "items-center font-semibold rounded-md transition ease-in-out duration-150",
        className,
      ].join(" ")}
      disabled={disabled || loading}
      onClick={onClick}
      id={id || "button" + new Date().getTime()}
    >
      <div className="flex flex-col items-center justify-center overflow-hidden relative">
        <div
          className={` absolute transform ${
            loading ? "translate-y-0" : "translate-y-20"
          }`}
        >
          <svg
            className={`animate-spin h-5 w-5 text-white`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <div
          className={`transform ${
            !loading ? "translate-y-0" : "translate-y-20"
          }`}
        >
          {children}
        </div>
      </div>
    </button>
  );
}

Button.defaultProps = {
  className: "",
  onClick: () => {},
  loading: false,
  disabled: false,
  children: <></>,
  id: "",
  type: "button",
};

export default Button;
