import { useCallback, useEffect } from "react";
import { SVGAssets } from "../../assets";

interface IModalProps {
  modalTitle: string;
  toggleModal: () => void;
  children: JSX.Element | string;
  exitOnEscape?: boolean;
  isShowed: boolean;
}

const Modal = ({
  modalTitle,
  toggleModal,
  children,
  exitOnEscape,
  isShowed,
}: IModalProps) => {
  const HandleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (exitOnEscape !== undefined) {
        if (e.key === "Escape" && !!exitOnEscape && !!isShowed) {
          toggleModal();
        }
      }
    },
    [toggleModal, exitOnEscape, isShowed]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", HandleEscape);
    return () => {
      document.body.removeEventListener("keydown", HandleEscape);
    };
  }, [HandleEscape]);

  return (
    <div
      id="modal-container"
      className={`fixed transition-all duration-200 top-0 left-0 w-screen min-h-screen bg-black bg-opacity-30 flex items-center justify-center`}
      style={{
        transform: isShowed ? "translateY(0%)" : "translateY(100%)",
      }}
    >
      <div
        className="bg-app-bg-primary shadow-md p-6 rounded-md relative transition-all duration-500 max-w-xl text-app-white"
        style={{
          transform: isShowed ? "translateY(0%)" : "translateY(500%)",
        }}
        id="modal-body-container"
      >
        <div className="flex flex-row items-center justify-center border-b-2 pb-3 border-app-secondary">
          <div className="flex flex-1 text-xl mr-10" id="modal-title">
            {modalTitle}
          </div>
          <SVGAssets.CloseIcon
            className="h-6 w-6 cursor-pointer fill-app-white"
            onClick={() => toggleModal()}
          />
        </div>
        <div id="modal-body" className="py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
