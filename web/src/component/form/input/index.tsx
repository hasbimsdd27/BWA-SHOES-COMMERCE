import { Component, createSignal, JSX } from "solid-js";

import { onMount } from "solid-js";

interface IPropsInput {
  label: string;
  icon: JSX.Element;
  name: string;
  type: string;
  placeholder: string;
  value?: string;
  id: string;
  className?: string;
}

const Input: Component<IPropsInput> = ({
  label,
  icon,
  name,
  type,
  placeholder,
  value,
  id,
  className,
}) => {
  const [focus, setFocus] = createSignal(false);
  const [error, setError] = createSignal(false);
  onMount(() => {
    if (!!value) {
      setTimeout(() => {
        if (!!document.querySelector(`#${id}`)) {
          (document.querySelector(`#${id}`) as HTMLInputElement).value = value;
        }
      }, 100);
    }
  });

  const checkValue = (id: string) => {
    const value = (document.querySelector(`#${id}`) as HTMLInputElement).value;
    if (
      value.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div class={[className, "transition-all duration-500"].join(" ")}>
      <div class="text-white mb-3">{label}</div>
      <div
        class={`flex flex-row w-full bg-app-input rounded-md p-4 items-center border-2 ${
          focus()
            ? error()
              ? "border-app-danger"
              : "border-app-primary"
            : "border-app-input"
        }`}
      >
        <div class="mr-2">{icon}</div>
        <div class="flex flex-1">
          {" "}
          <input
            class="w-full border-none outline-none bg-transparent"
            placeholder={placeholder}
            name={name}
            type={type}
            id={id}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            onInput={(e) => checkValue(e.target.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default Input;
