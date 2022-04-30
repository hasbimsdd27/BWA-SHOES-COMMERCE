import React, { useEffect, useRef, useState } from "react";
import MakeId from "../../utils/GenerateRandomString";

interface IDropdownProps {
  renderLabel: JSX.Element | string;
  children: JSX.Element[] | JSX.Element;
  width: string;
  id: string;
}

const Dropdown = ({ renderLabel, children, width, id }: IDropdownProps) => {
  const [show, setShow] = useState(false);

  const heightRef = useRef<number>(0);
  const wrapperRef = useRef<any>(null);
  const isShowed = useRef<boolean>(false);

  const toggleShow = () => {
    isShowed.current = !show;
    setShow((prev) => !prev);
  };

  const handleClickOutside = (event: any) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target) &&
      isShowed.current
    ) {
      toggleShow();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const element = document.querySelector(`#${id}`);
      if (!!element) {
        heightRef.current =
          (document.querySelector(`#${id}`) as HTMLDivElement).scrollHeight +
          16;
      }
    }, 100);

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative select-none" id={`${id}-wrapper`} ref={wrapperRef}>
      <div onClick={() => toggleShow()}>{renderLabel}</div>
      <div
        className={`absolute right-0 bg-app-white overflow-hidden mt-2 transition-all rounded-md duration-200 ${
          show ? "py-2" : ""
        }`}
        style={{ width, height: (show ? heightRef.current : 0) + "px" }}
        id={id}
      >
        {children}
      </div>
    </div>
  );
};

Dropdown.defaultProps = {
  renderLabel: <></>,
  children: <></>,
  width: "100%",
};
export default Dropdown;
