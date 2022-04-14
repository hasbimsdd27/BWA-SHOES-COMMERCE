import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Layout, Pagination } from "../../components";
import Button from "../../components/button";
import CustomCheckbox from "../../components/customCheckbox";
import Modal from "../../components/modals";
import {
  AddCategoryName,
  DeleteCategories,
  DeleteCategory,
  EditCategoryName,
  GetAllCategories,
} from "../../service/category";

interface ICategoryData {
  id: number;
  name: string;
}
interface IResponseCategories {
  data: ICategoryData[];
  limit: number;
  total_data: number;
  total_pages: number;
  current_page: number;
}

function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
  const [modal1, setModal1] = useState<boolean>(false);
  const [modal2, setModal2] = useState<boolean>(false);
  const [data, setData] = useState({
    id: 0,
    name: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const responseAllCategories = useRef<IResponseCategories>({
    data: [],
    limit: 0,
    total_data: 0,
    total_pages: 0,
    current_page: 0,
  });

  const currentFilter = useRef({
    name: "",
    currentPage: 0,
  });

  const TempId: { current: string[] } = useRef([]);

  const timeoutRef: { current: NodeJS.Timeout | null } = useRef(null);

  const FetchAllCategory = useCallback(async (page: number, name: string) => {
    try {
      setLoading(true);
      const response = await GetAllCategories({
        page,
        name,
        limit: 10,
      });
      const responseData = await response.json();
      responseAllCategories.current = responseData.data;
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      setLoading(false);
    }
  }, []);

  const HandlePagination = (page: number) => {
    currentFilter.current.currentPage = page;
    FetchAllCategory(page, currentFilter.current.name);
  };

  const HandleSearchData = (value: string) => {
    clearInterval(timeoutRef.current as NodeJS.Timeout);
    currentFilter.current.name = value;
    timeoutRef.current = setTimeout(
      () => FetchAllCategory(1, currentFilter.current.name),
      500
    );
  };

  const HandleCheck = (value: string) => {
    if (TempId.current.includes(value)) {
      TempId.current = TempId.current.filter((item) => item !== value);
    } else {
      TempId.current.push(value);
    }
    if (!!document.querySelector("#selected-length")) {
      (
        document.querySelector("#selected-length") as HTMLDivElement
      ).innerHTML = `<span >${TempId.current.length}</span> Categories Selected`;
    }

    const lengthRequired = TempId.current.length > 1;

    if (warning !== lengthRequired) {
      setWarning(lengthRequired);
    }
  };

  const DeleteSingleEntry = (index: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure want to delete "${responseAllCategories.current.data[index].name}"`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoadingDelete(index);
          const response = await DeleteCategory(
            responseAllCategories.current.data[index].id
          );

          if (response.status >= 400) {
            const data = await response.json();
            throw new Error(data.message);
          }

          setLoadingDelete(null);
          await FetchAllCategory(
            currentFilter.current.currentPage,
            currentFilter.current.name
          );
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

  const DeleteMultiEntries = (id: string[]) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure want to delete it?`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await DeleteCategories(
            id.map((item) => Number(item))
          );

          if (response.status >= 400) {
            const data = await response.json();
            throw new Error(data.message);
          }
          id.forEach((item) => {
            HandleCheck(item);
          });
          await FetchAllCategory(
            currentFilter.current.currentPage,
            currentFilter.current.name
          );
        } catch (error) {
          if (error instanceof Error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message,
            });
          }
        }
      }
    });
  };

  const HandleSubmitEdit = async (name: string, id: number) => {
    try {
      setLoadingEdit(true);
      const response = await EditCategoryName(name, id);

      if (response.status >= 400) {
        const data = await response.json();
        throw new Error(data.message);
      }

      await FetchAllCategory(
        currentFilter.current.currentPage,
        currentFilter.current.name
      );
      setLoadingEdit(false);
      setModal1(false);
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
      setLoadingEdit(false);
    }
  };

  const HandleSubmitCreate = async (name: string) => {
    try {
      setLoadingSubmit(true);
      const response = await AddCategoryName(name);

      if (response.status >= 400) {
        const data = await response.json();
        throw new Error(data.message);
      }

      await FetchAllCategory(
        currentFilter.current.currentPage,
        currentFilter.current.name
      );
      (document.querySelector("#input-name-add") as HTMLInputElement).value =
        "";
      setLoadingSubmit(false);
      setModal2(false);
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    FetchAllCategory(1, "");
  }, [FetchAllCategory]);

  return (
    <Layout>
      <section>
        <div
          className={[
            "text-center fixed left-2 bottom-2 bg-white rounded-md text-app-bg-input p-4 transform transition-all duration-300",
            warning ? "translate-x-0" : "-translate-x-96",
          ].join(" ")}
        >
          <div id="selected-length"></div>
          <div className="mb-2">Are you want to delete it?</div>
          <button
            onClick={() => {
              DeleteMultiEntries(TempId.current);
            }}
            className="bg-app-danger rounded-md text-app-white px-2 py-1 cursor-pointer"
          >
            Delete Selected
          </button>
        </div>{" "}
        <div className="mb-8 flex flex-row items-center justify-center">
          <div className="flex flex-1 flex-col">
            <h4 className="text-xl font-bold">Category</h4>
            <p>Add, Edit and See Details Category</p>
          </div>
          <div>
            <Button
              className="bg-app-primary px-2 py-1"
              onClick={() => setModal2((prev) => !prev)}
            >
              + Add Category
            </Button>
          </div>
        </div>
        <div className="flex flex-row rounded-md border border-app-secondary p-2 mb-4">
          <div className="flex flex-1">
            <input
              className="w-full outline-none bg-transparent p-2"
              placeholder="Type category here..."
              onChange={(e) => HandleSearchData(e.target.value)}
            />
          </div>
        </div>
        <div>
          {!loading && responseAllCategories.current.data.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="bg-app-primary p-4 rounded-md">No Entries</div>
            </div>
          ) : (
            <>
              {" "}
              <table className="w-full border-b-2 border-app-secondary mb-4">
                <thead>
                  <tr className="border-b-2 border-app-secondary">
                    <th className="w-2/12 p-4 text-center">Checked</th>
                    <th className="w-8/12 p-4 text-left">Name</th>
                    <th className="w-2/12 p-4">Action</th>
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
                    : responseAllCategories.current.data.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-app-primary bg-opacity-70 transition-all duration-100 cursor-pointer"
                        >
                          <td className="p-4">
                            <div className="w-full flex items-center justify-center">
                              <CustomCheckbox
                                id={`category-${item.id}`}
                                name="categoryId"
                                onChange={HandleCheck}
                                value={String(item.id)}
                                defaultChecked={TempId.current
                                  .map((item) => Number(item))
                                  .includes(item.id)}
                              />{" "}
                            </div>
                          </td>
                          <td className="p-4">{item.name}</td>
                          <td className="p-4 flex flex-row items-center justify-center">
                            <Button
                              className="bg-yellow-500 px-2 py-1 mr-2 text-app-secondary"
                              onClick={() => {
                                setData(item);
                                setModal1(true);
                              }}
                              loading={loadingDelete === index}
                            >
                              Edit
                            </Button>

                            <Button
                              className="bg-app-danger px-2 py-1"
                              onClick={() => DeleteSingleEntry(index)}
                              loading={loadingDelete === index}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
              <Pagination
                currentPage={responseAllCategories.current.current_page}
                totalData={responseAllCategories.current.total_data}
                totalPage={responseAllCategories.current.total_pages}
                onClick={HandlePagination}
              />
            </>
          )}
        </div>
        <Modal
          isShowed={modal1}
          toggleModal={() => setModal1((prev) => !prev)}
          modalTitle={"Edit Category"}
          exitOnEscape={true}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              HandleSubmitEdit((e.target as any).name.value, data.id);
            }}
          >
            <div className="mb-4">
              <div className="mb-4">Category Name</div>
              <input
                className="bg-transparent outline-none w-full border-2 rounded-md p-4 border-app-secondary"
                placeholder="Category Name"
                name="name"
                type="text"
                defaultValue={data.name}
                onChange={(e) => {
                  if (e.target.value.length <= 2) {
                    (
                      document.querySelector(
                        "#btn-submit-modal"
                      ) as HTMLButtonElement
                    ).disabled = true;
                  } else {
                    (
                      document.querySelector(
                        "#btn-submit-modal"
                      ) as HTMLButtonElement
                    ).disabled = false;
                  }
                }}
              />
            </div>

            <Button
              className="bg-app-primary px-2 py-2 w-full rounded-md disabled:bg-opacity-50 cursor-pointer disabled:cursor-not-allowed"
              type="submit"
              loading={loadingEdit}
              onClick={() => {}}
              id="btn-submit-modal"
            >
              Submit
            </Button>
          </form>
        </Modal>
        <Modal
          isShowed={modal2}
          toggleModal={() => setModal2((prev) => !prev)}
          modalTitle={"Add Category"}
          exitOnEscape={true}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              HandleSubmitCreate((e.target as any).name.value);
            }}
          >
            <div className="mb-4">
              <div className="mb-4">Category Name</div>
              <input
                className="bg-transparent outline-none w-full border-2 rounded-md p-4 border-app-secondary"
                placeholder="Category Name"
                name="name"
                type="text"
                defaultValue={data.name}
                onChange={(e) => {
                  if (e.target.value.length <= 2) {
                    (
                      document.querySelector(
                        "#btn-submit-modal-1"
                      ) as HTMLButtonElement
                    ).disabled = true;
                  } else {
                    (
                      document.querySelector(
                        "#btn-submit-modal-1"
                      ) as HTMLButtonElement
                    ).disabled = false;
                  }
                }}
                id="input-name-add"
              />
            </div>

            <Button
              className="bg-app-primary px-2 py-2 w-full rounded-md disabled:bg-opacity-50 cursor-pointer disabled:cursor-not-allowed"
              type="submit"
              loading={loadingSubmit}
              onClick={() => {}}
              id="btn-submit-modal-1"
            >
              Submit
            </Button>
          </form>
        </Modal>
      </section>
    </Layout>
  );
}

export default Dashboard;
