import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Layout, Pagination } from "../../components";
import Button from "../../components/button";
import CustomCheckbox from "../../components/customCheckbox";
import { GetAllProductsAPI } from "../../service/product";

function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const responseAllProducts: {
    current: {
      data: {
        Category: { name: string };
        Galeries: { url: string }[];
        description: string;
        id: string;
        name: string;
        tags: string;
        price: number;
      }[];
      limit: number;
      total_data: number;
      total_pages: number;
      current_page: number;
    };
  } = useRef({
    data: [],
    limit: 0,
    total_data: 0,
    total_pages: 0,
    current_page: 0,
  });

  const currentFilter = useRef({
    name: "",
    currentPage: 0,
    price_form: 0,
    price_to: 0,
    tags: "",
    categories: "",
    page: 1,
    limit: 5,
  });

  const navigate = useNavigate();

  const GetAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const query = {};

      Object.keys(currentFilter.current).forEach((item) => {
        if (
          (currentFilter.current as any)[item] !== "" ||
          (currentFilter.current as any)[item] !== 0
        ) {
          (query as any)[item] = (currentFilter.current as any)[item];
        }
      });

      const response = await GetAllProductsAPI(query as any);
      const responseData = await response.json();
      responseAllProducts.current = responseData.data;
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    GetAllProducts();
  }, [GetAllProducts]);

  return (
    <Layout>
      <section>
        <div className="mb-8 flex flex-row items-center justify-center">
          <div className="flex flex-1 flex-col">
            <h4 className="text-xl font-bold">Product</h4>
            <p>Add, Edit and See Details Product</p>
          </div>
          <div>
            <Button
              className="bg-app-primary px-2 py-1"
              onClick={() => {
                navigate("/product/add");
              }}
            >
              + Add Product
            </Button>
          </div>
        </div>
        <div>
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b-2 border-app-bg-input">
                <th className="text-center p-2 w-2/12">Checked</th>
                <th className="text-left p-2 w-5/12">Product</th>
                <th className="text-right p-2 w-2/12">Price</th>
                <th className="text-center p-2 w-3/12">Action</th>
              </tr>
            </thead>
            <tbody>
              {responseAllProducts.current.data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b-2 border-app-bg-input cursor-pointer hover:bg-app-primary transition-all duration-200"
                >
                  <td className="p-2">
                    <div className="flex items-center justify-center">
                      <CustomCheckbox
                        id={`category-${item.id}`}
                        name="categoryId"
                        onChange={(e) => console.log(e)}
                        value={String(item.id)}
                        defaultChecked={false}
                      />{" "}
                    </div>
                  </td>
                  <td className="p-2 flex flex-row">
                    <div className="w-16 h-16 rounded-md mr-2">
                      <div
                        className="h-full w-full rounded-md"
                        style={{
                          backgroundImage: `url("${item.Galeries[0].url}")`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="font-bold mb-1">{item.name}</div>
                      <div className="text-sm">{item.tags}</div>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    {item.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-2 ">
                    <div className="flex items-center justify-center">
                      <Button
                        className="bg-yellow-500 px-2 py-1 mr-2 text-app-secondary"
                        onClick={() => {}}
                        loading={false}
                      >
                        Edit
                      </Button>

                      <Button
                        className="bg-app-danger px-2 py-1"
                        onClick={() => {}}
                        loading={false}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={responseAllProducts.current.current_page}
            totalData={responseAllProducts.current.total_data}
            totalPage={responseAllProducts.current.total_pages}
            onClick={(e) => {
              currentFilter.current = {
                ...currentFilter.current,
                page: e,
              };
              GetAllProducts();
            }}
          />
        </div>
      </section>
    </Layout>
  );
}

export default Dashboard;
