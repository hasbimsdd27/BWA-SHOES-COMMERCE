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

  const wrapperRef = useRef<any>(null);
  const isShowed = useRef<boolean>(false);

  const toggleShow = () => {
    setShow((prev) => {
      isShowed.current = !prev;
      return !prev;
    });
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
        className={`absolute right-0 overflow-hidden mt-2 transition-all duration-200`}
        style={{ width, height: show ? "300px" : "0px", maxHeight: "300px" }}
        id={id}
      >
        <div className="bg-white rounded-md py-2">{children}</div>
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
