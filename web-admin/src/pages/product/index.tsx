import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Layout, Pagination } from "../../components";
import Button from "../../components/button";
import CustomCheckbox from "../../components/customCheckbox";
import {
  DeleteSingleProductAPI,
  GetAllProductsAPI,
} from "../../service/product";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
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
    limit: 10,
  });

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

  const DeleteSingleEntry = (index: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure want to delete "${responseAllProducts.current.data[index].name}"`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoadingDelete(index);
          await DeleteSingleProductAPI(
            responseAllProducts.current.data[index].id
          );
          await GetAllProducts();
          setLoadingDelete(null);
        } catch (error) {
          if (error instanceof Error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message,
            });
          }
          setLoadingDelete(null);
        }
      }
    });
  };

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
          {!loading && responseAllProducts.current.data.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="bg-app-primary p-4 rounded-md">No Entries</div>
            </div>
          ) : (
            <>
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b-2 border-app-bg-input">
                    {/* <th className="text-center p-2 w-2/12">Checked</th> */}
                    <th className="text-left p-2 w-5/12">Product</th>
                    <th className="text-right p-2 w-2/12">Price</th>
                    <th className="text-center p-2 w-3/12">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array(3)
                        .fill("", 0, 3)
                        .map((_, index) => (
                          <tr className="" key={index}>
                            <td className="py-3 flex items-center justify-center">
                              <div className="bg-app-secondary w-6 h-6 rounded-md animate-pulse " />
                            </td>
                            <td className="py-3">
                              <div className="bg-app-secondary w-1/2 h-6 rounded-md animate-pulse " />
                            </td>
                            <td className="flex flex-row py-3">
                              <div className="bg-yellow-500 w-16 h-6 rounded-md animate-pulse mr-2" />
                              <div className="bg-app-danger w-16 h-6 rounded-md animate-pulse " />
                            </td>
                          </tr>
                        ))
                    : responseAllProducts.current.data.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b-2 border-app-bg-input cursor-pointer hover:bg-app-primary transition-all duration-200"
                        >
                          {/* <td className="p-2">
                            <div className="flex items-center justify-center">
                              <CustomCheckbox
                                id={`category-${item.id}`}
                                name="categoryId"
                                onChange={(e) => console.log(e)}
                                value={String(item.id)}
                                defaultChecked={false}
                              />{" "}
                            </div>
                          </td> */}
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
                                onClick={() => {
                                  navigate(`/product/${item.id}`);
                                }}
                                loading={false}
                              >
                                Edit
                              </Button>

                              <Button
                                className="bg-app-danger px-2 py-1"
                                onClick={() => {
                                  DeleteSingleEntry(index);
                                }}
                                loading={loadingDelete === index}
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
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default Dashboard;
