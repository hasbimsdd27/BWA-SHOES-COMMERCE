import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../components/layout";

interface IProductList {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface IPropsSearch {
  categories: {
    id: string;
    name: string;
  }[];
  products: {
    productList: IProductList[];
  };
  error: {
    isError: boolean;
    errorMessage: string;
  };
  loading: boolean;
}

const Search: NextPage = () => {
  const [state, setState] = useState<IPropsSearch>({
    categories: [],
    products: {
      productList: [],
    },
    error: {
      isError: false,
      errorMessage: "",
    },
    loading: false,
  });
  const router = useRouter();
  const pageRef = useRef<number>(1);
  const maxPage = useRef<number>(0);

  const timeoutRef = useRef<any>(null);

  const HandleFetchMore = async () => {
    console.log(pageRef.current !== maxPage.current);
    if (pageRef.current !== maxPage.current) {
      let params = [
        "limit=10",
        `page=${pageRef.current + 1}`,
        `name=${router.query.q}`,
      ];

      if (!!router.query.category) {
        params.push(`category=${router.query.category}`);
      }
      if (!!router.query.price_from) {
        params.push(`price_from=${router.query.price_from}`);
      }
      if (!!router.query.price_to) {
        params.push(`price_to=${router.query.price_to}`);
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?${params.join("&")}`
      );

      const data = await response.json();
      pageRef.current = data.data.current_page;
      setState((prev) => ({
        ...prev,
        products: {
          ...prev.products,
          productList: [
            ...prev.products.productList,
            ...data.data.data.map((item: any) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              category: item.Category.name,
              image: item.Galeries[0].url,
            })),
          ],
        },
      }));
    }
  };

  const fetchAll = useCallback((query: ParsedUrlQuery) => {
    setState((prev) => ({ ...prev, loading: true }));
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=-1`),
      (() => {
        let params = ["limit=10", `page=1`, `name=${query?.q}`];

        if (!!query?.category) {
          params.push(`category=${query.category}`);
        }
        if (!!query?.price_from) {
          params.push(`price_from=${query.price_from}`);
        }
        if (!!query?.price_to) {
          params.push(`price_to=${query.price_to}`);
        }
        console.log(
          `${process.env.NEXT_PUBLIC_API_URL}/products?${params.join("&")}`
        );
        return fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?${params.join("&")}`
        );
      })(),
    ]).then(async (res) => {
      const data = {
        categories: [],
        products: {
          productList: [],
        },
        error: {
          isError: false,
          errorMessage: "",
        },
        loading: false,
      };
      const jsonCategory = await res[0].json();
      if (res[0].status >= 400) {
        data.error.isError = true;
        data.error.errorMessage = jsonCategory.message;
      }
      data.categories = jsonCategory.data.data;

      const jsonProduct = await res[1].json();
      if (res[1].status >= 400) {
        data.error.isError = true;
        data.error.errorMessage = jsonCategory.message;
      }
      maxPage.current = jsonProduct.data.total_pages;
      data.products.productList = jsonProduct.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.Category.name,
        image: item.Galeries[0].url,
      }));
      setState((prev) => ({ ...prev, ...data }));
    });
  }, []);

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      HandleFetchMore();
    }, 100);
  }

  useEffect(() => {
    fetchAll(router.query);
    pageRef.current = 1;
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchAll, router.query]);

  return (
    <Layout>
      <div className="flex flex-row w-full transition-all duration-500">
        {state.loading ? (
          <div className="flex flex-row items-center justify-center w-full">
            {Array(5)
              .fill(0, 0, 5)
              .map((_, index) => (
                <div
                  key={index}
                  style={{ minWidth: "215px", minHeight: "278px" }}
                  className="bg-app-secondary rounded-md mx-2 animate-pulse"
                />
              ))}
          </div>
        ) : state.error.isError ? (
          <div className="w-full flex items-center justify-center">
            <div className="p-8 text-white bg-app-primary rounded-md">
              <div className="text-center mb-4">
                <span className="text-5xl ">😭</span>
              </div>
              <div className="text-center mb-4">{state.error.errorMessage}</div>
              <button
                className="bg-green-500 rounded-md py-2 w-full"
                onClick={(e) => {
                  e.preventDefault();
                  router.push({
                    pathname: "/",
                  });
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="h-auto w-56">
              <form
                className="bg-app-bg-input p-4 rounded-md text-white fixed"
                style={{ width: "inherit" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  router.replace({
                    pathname: "search",
                    query: {
                      q: router.query.q,
                      page: 1,
                      category: (e.target as any).category.value,
                      ...(!!(e.target as any).price_from.value && {
                        price_from: (e.target as any).price_from.value,
                      }),
                      ...(!!(e.target as any).price_to.value && {
                        price_to: (e.target as any).price_to.value,
                      }),
                    },
                  });
                }}
              >
                <div className="mb-4">
                  <div className="mb-2 ">Select Category</div>

                  <select
                    name="category"
                    defaultValue={router.query.category}
                    className="w-full p-2 bg-transparent border-2 rounded-md outline-none focus:border-app-primary border-app-secondary"
                  >
                    <option className="bg-app-bg-input p-2">
                      Select Category
                    </option>
                    {state.categories.map((item, index) => (
                      <option
                        className="bg-app-bg-input p-2"
                        key={index}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div>
                    <div className="mb-2">Price Range</div>
                    <div className="mb-2">
                      <div>From</div>
                      <input
                        defaultValue={router.query.price_from}
                        className="w-full bg-transparent p-2 border-app-secondary border-2 mt-2 rounded-md focus:outline-none focus:border-app-primary"
                        placeholder="0"
                        name="price_from"
                      />
                    </div>
                    <div>
                      <div>To</div>
                      <input
                        defaultValue={router.query.price_to}
                        className="w-full bg-transparent p-2 border-app-secondary border-2 mt-2 rounded-md focus:outline-none focus:border-app-primary"
                        placeholder="0"
                        name="price_to"
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="w-full py-2 rounded-md bg-app-primary mt-4"
                  type="submit"
                >
                  Apply
                </button>
              </form>
            </div>

            {state.products.productList.length === 0 ? (
              <div className="w-full flex items-center justify-center">
                <div className="p-8 text-white bg-app-primary rounded-md">
                  <div className="text-center mb-4">
                    <span className="text-5xl ">😞</span>
                  </div>
                  <div className="text-center">Product not found</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-row flex-wrap justify-center ">
                {state.products.productList.map((item, index) => (
                  <div
                    key={index}
                    className="p-2"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push({
                        pathname: `/product/${item.id}`,
                      });
                    }}
                  >
                    <div
                      className="flex flex-col bg-app-white rounded-md "
                      style={{ minWidth: "215px", minHeight: "278px" }}
                    >
                      <div
                        className="flex flex-1 rounded-tl-md rounded-tr-md"
                        style={{
                          backgroundImage: `url("${item.image}")`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                      <div className="flex flex-col p-4">
                        <div className="mb-2 text-app-secondary">
                          {item.category}
                        </div>
                        <div className="mb-2 text-xl font-bold">
                          {item.name.slice(0, 12)}
                          {item.name.length > 12 && "..."}
                        </div>
                        <div className="text-blue-400 font-bold">
                          {item.price.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Search;
