import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SVGAssets } from "../../assets";

interface IpropsLayout {
  children: JSX.Element | string | JSX.Element[] | string[];
}

function Layout({ children }: IpropsLayout) {
  const navigate = useNavigate();
  const location = useLocation();
  const MenuList = [
    {
      label: "Dashboard",
      route: "/dashboard",
      function: () => {
        navigate("/dashboard");
      },
    },
    {
      label: "Category",
      route: "/category",
      function: () => {
        navigate("/category");
      },
    },
    {
      label: "Product",
      route: "/product",
      function: () => {
        navigate("/product");
      },
    },
    {
      label: "Order",
      route: "/order",
      function: () => {
        navigate("/order");
      },
    },
    {
      label: "Chat",
      route: "/chat",
      function: () => {
        navigate("/chat");
      },
    },
    {
      label: "Logout",
      route: "/login",
      function: () => {
        Swal.fire({
          title: "Are you sure?",
          text: "Are yiu sure to Log out?",
          icon: "warning",
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonColor: "#d33",
          confirmButtonText: "Logout",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.clear();
            navigate("/login", { replace: true });
          }
        });
      },
    },
  ];

  return (
    <div className="bg-app-bg-primary w-screen min-h-screen flex justify-center">
      <div className="max-w-screen-2xl flex flex-row w-full text-white p-4">
        <div className="w-1/6 mr-12">
          <h1 className="text-2xl text-center font-bold mb-8 mt-4">
            Shoes Admin
          </h1>
          <ul className="">
            {MenuList.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  item.function();
                }}
                className={[
                  "p-2 mb-2 cursor-pointer transition-all duration-100 rounded-md",
                  location.pathname.includes(item.route)
                    ? "bg-app-primary bg-opacity-75"
                    : "hover:bg-app-primary",
                ].join(" ")}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-5/6">
          <div className="p-4 flex flex-row">
            <div className="flex flex-1 flex-col">
              <h4 className="text-xl font-bold">Halo Admin,</h4>
              <p>Selamat Siang</p>
            </div>
            <div className="flex flex-1 justify-end items-center">
              <div className="mr-3">
                <SVGAssets.CartIcon className="cursor-pointer" />
              </div>
              <div className="mr-3">
                {" "}
                <SVGAssets.MessageIcon className="fill-app-white cursor-pointer" />
              </div>

              <div>
                {" "}
                <SVGAssets.ExitButton className="cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
