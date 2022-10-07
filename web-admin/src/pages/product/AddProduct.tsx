import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { SVGAssets } from "../../assets";
import { Layout } from "../../components";
import Button from "../../components/button";
import { DeleteAssets, UploadAssets } from "../../service/assets";
import { GetAllCategories } from "../../service/category";
import {
  AddProductAPI,
  GetDetailProduct,
  UpdateProduct,
} from "../../service/product";
import { InputValueSetter } from "../../utils";

function AddProduct() {
  const navigate = useNavigate();
  const params = useParams();
  const [imageLink, setImageLink] = useState<string[]>([]);
  const [error, setError] = useState({
    product_name: false,
    product_price: false,
    product_tags: false,
    product_category: false,
    product_description: false,
    product_weight: false,
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const RegexValidation = {
    product_name: /[\w\W]{3,}/,
    product_price: /^[0-9]{3,}$/,
    product_tags: /^[a-z0-9A-Z]{3,}$/,
    product_category:
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
    product_description: /[\w\W]{12,}/,
    product_weight: /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/,
  };

  const Validation = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setError((prev) => ({
      ...prev,
      [e.target.name]: !(RegexValidation as any)[e.target.name].test(
        e.target.value
      ),
    }));
  };

  const handleUploadImage = async (file: File) => {
    if (!!file) {
      try {
        const payload = new FormData();
        payload.append("assets", file);

        const response = await UploadAssets(payload);
        const data = await response.json();
        if (response.status >= 400) {
          throw new Error(data.message);
        }
        setImageLink((prev) => [...prev, data.data.image_url]);
        toast.success("Image Uploaded");
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
  };

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fieldList = [
      "product_name",
      "product_price",
      "product_category",
      "product_tags",
      "product_description",
      "product_weight",
    ];

    fieldList.forEach((item) => {
      const value = (e.target as any)[item]?.value;
      setError((prev) => ({ ...prev, [item]: !value }));
    });

    const IsNoError = Object.values(error).every((item) => item === false);
    if (!IsNoError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all required fields",
      });
      return;
    }

    if (imageLink.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Image can't be empty",
      });
      return;
    }

    try {
      setLoadingSubmit(true);
      const payload = {
        name: (e.target as any)["product_name"]?.value,
        price: Number((e.target as any)["product_price"]?.value),
        description: (e.target as any)["product_description"]?.value,
        tags: (e.target as any)["product_tags"]?.value,
        category_id: (e.target as any)["product_category"]?.value,
        galeries: imageLink,
        weight: Number((e.target as any)["product_weight"]?.value),
      };
      let response: any;
      if (!!params.id) {
        response = await UpdateProduct(payload, params.id);
      } else {
        response = await AddProductAPI(payload);
      }

      const responseData = await response.json();
      if (response.status >= 400) {
        throw new Error(responseData.message);
      }
      setLoadingSubmit(false);
      navigate("/product", { replace: true });
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

  const FetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const response = await GetAllCategories({
        page: 1,
        name: "",
        limit: -1,
      });
      const responseData = await response.json();
      if (response.status >= 400) {
        throw new Error(responseData.message);
      }
      setCategories(
        responseData.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
        }))
      );
      setLoadingCategories(false);
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
      setLoadingCategories(false);
    }
  }, []);

  const DeleteAssetsFunction = async (filename: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure want to delete this image?`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await DeleteAssets(
            filename.split("/").pop() as string
          );

          if (response.status >= 400) {
            const responseData = await response.json();
            throw new Error(responseData.message);
          }
          setImageLink((prev) => prev.filter((item) => item !== filename));
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

  const HandleProductDetail = useCallback(async (id: string) => {
    try {
      const response = await GetDetailProduct(id);
      const responseData = await response.json();
      if (response.status >= 400) {
        throw new Error(responseData.message);
      }
      const data = responseData.data.product;
      InputValueSetter("input[name='product_name']", data.name);
      InputValueSetter("input[name='product_price']", data.price);
      InputValueSetter("input[name='product_tags']", data.tags);
      InputValueSetter("select[name='product_category']", data.category_id);
      InputValueSetter(
        "textarea[name='product_description']",
        data.description
      );
      InputValueSetter("input[name='product_weight']", data.weight);
      setImageLink(data.Galeries.map((item: any) => item.url));
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    }
  }, []);

  useEffect(() => {
    FetchCategories();
    if (!!params.id) {
      HandleProductDetail(params.id);
    }
  }, [FetchCategories, HandleProductDetail, params]);

  return (
    <Layout>
      <section>
        <div className="mb-8 flex flex-row items-center justify-center">
          <div className="flex flex-1 flex-col">
            <h4 className="text-xl font-bold">Add Product</h4>
            <p>Add New Product</p>
          </div>
        </div>

        <div className="text-xl mb-4">Product Form</div>
        <form onSubmit={HandleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="mb-2">
                Product Name <span className="text-app-danger">*</span>
              </label>
              <input
                onChange={Validation}
                className={`bg-transparent p-2 rounded-md border-2 outline-none  transition-all duration-200 ${
                  error["product_name"]
                    ? "border-app-danger"
                    : "focus:border-app-primary border-app-secondary "
                }`}
                name="product_name"
                placeholder="Enter product name"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">
                Product Price <span className="text-app-danger">*</span>
              </label>
              <input
                onChange={Validation}
                className={`bg-transparent p-2 rounded-md border-2 outline-none  transition-all duration-200 ${
                  error["product_price"]
                    ? "border-app-danger"
                    : "focus:border-app-primary border-app-secondary "
                }`}
                name="product_price"
                placeholder="Enter product price"
                type="number"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">
                Product Tags <span className="text-app-danger">*</span>
              </label>
              <input
                onChange={Validation}
                className={`bg-transparent p-2 rounded-md border-2 outline-none  transition-all duration-200 ${
                  error["product_tags"]
                    ? "border-app-danger"
                    : "focus:border-app-primary border-app-secondary "
                }`}
                name="product_tags"
                placeholder="Enter product tags"
              />
            </div>{" "}
            <div className="flex flex-col">
              <label className="mb-2">
                Product Category <span className="text-app-danger">*</span>
              </label>
              <select
                className={`bg-transparent p-2 rounded-md border-2 outline-none  transition-all duration-200 ${
                  error["product_category"]
                    ? "border-app-danger"
                    : "focus:border-app-primary border-app-secondary "
                }`}
                name="product_category"
                placeholder="Enter product category"
                onChange={Validation}
              >
                <option className="bg-app-bg-primary m-2" value={""}>
                  {loadingCategories ? "Loading..." : "- Choose Category -"}
                </option>
                {categories.map((item) => (
                  <option
                    className="bg-app-bg-primary m-2"
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-2">
                Product Weight <span className="text-app-danger">*</span>
              </label>
              <input
                onChange={Validation}
                className={`bg-transparent p-2 rounded-md border-2 outline-none  transition-all duration-200 ${
                  error["product_weight"]
                    ? "border-app-danger"
                    : "focus:border-app-primary border-app-secondary "
                }`}
                name="product_weight"
                placeholder="Enter product weight"
              />
            </div>{" "}
          </div>

          <div className="flex flex-col mb-6">
            <label className="mb-2">
              Product Description <span className="text-app-danger">*</span>
            </label>

            <textarea
              onChange={Validation}
              className={`bg-transparent p-2 rounded-md border-2 outline-none  transition-all duration-200 ${
                error["product_description"]
                  ? "border-app-danger"
                  : "focus:border-app-primary border-app-secondary "
              }`}
              name="product_description"
              placeholder="Enter product description"
            />
          </div>
          <div className="mb-8">
            <div className="mb-4 text-center">Product Images</div>

            <div className="flex flex-row items-center justify-center">
              {imageLink.map((item, index) => (
                <div
                  key={index}
                  className="w-32 h-32 border-2 border-dashed border-app-secondary rounded-md mx-2 flex items-center justify-center relative"
                  style={{
                    backgroundImage: `url("${item}")`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <div className="absolute right-0 top-0 ">
                    <div
                      className="bg-app-danger transform -translate-y-3 translate-x-3 rounded-full p-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        DeleteAssetsFunction(item);
                      }}
                    >
                      <SVGAssets.CloseIcon className="fill-app-white h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="w-32 h-32 border-2 border-dashed border-app-secondary rounded-md mx-2 flex items-center justify-center relative">
                <>
                  <input
                    className="absolute h-full w-full opacity-0 cursor-pointer"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleUploadImage((e.target.files as any)[0])
                    }
                  />

                  <div className="text-app-secondary text-3xl">+</div>
                </>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-end">
            <Button
              className="bg-app-danger px-2 py-1 mr-2"
              onClick={() => {}}
              type="reset"
            >
              Clear
            </Button>
            <Button
              className="bg-app-primary px-2 py-1 disabled:bg-opacity-70"
              onClick={() => {}}
              type="submit"
              disabled={
                Object.values(error).every((item) => item === true) ||
                imageLink.length === 0
              }
              loading={loadingSubmit}
            >
              Submit
            </Button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

export default AddProduct;
