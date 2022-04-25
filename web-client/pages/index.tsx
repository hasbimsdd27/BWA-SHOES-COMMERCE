import type { NextPage, NextPageContext } from "next";
import { useCallback, useEffect, useRef } from "react";
import SVGAssets from "../assets/svg";
import Layout from "../components/layout";

interface IPropsHome {
  data: {
    total_pages: number;
    current_page: number;
    limit: number;
    total_data: number;
    data: {
      id: string;
      name: string;
      price: number;
      descriptiom: number;
      category_id: string;
      Galeries: { id: string; url: string }[];
      Category: { id: string; name: string };
    }[];
  };
  error: string;
}

const Home: NextPage<IPropsHome> = ({ data, error }) => {
  const wrapperWidth: { current: { [name: string]: number } } = useRef({});
  const IntervalRef: {
    current: {
      popular: any;
      arrival: any;
    };
  } = useRef({ popular: null, arrival: null });

  const HandleClickChevron = useCallback(
    (
      query: string,
      maxWidth: number,
      value: number,
      action: "left" | "right"
    ) => {
      const element = document.querySelector(query);

      if (!!element) {
        let scroll = 0;
        if (action === "right") {
          if (element.scrollLeft < maxWidth) {
            if (maxWidth - element.scrollLeft > value) {
              scroll = element.scrollLeft + value;
            } else {
              scroll = maxWidth;
            }
          }
        } else {
          if (element.scrollLeft === 0) {
            scroll = wrapperWidth.current[query];
          }
        }

        (document.querySelector(query) as HTMLDivElement).scrollTo({
          left: scroll,
          behavior: "smooth",
        });
      }
    },
    []
  );

  useEffect(() => {
    setTimeout(() => {
      const popularWrapper = document.querySelector("#popular-item-wrapper");
      if (!!popularWrapper) {
        wrapperWidth.current["#popular-item-wrapper"] =
          (document.querySelector("#popular-item-wrapper") as HTMLDivElement)
            .scrollWidth -
          (document.querySelector("#popular-wrapper") as HTMLDivElement)
            .clientWidth;
      }
      const NewArrivalWrapper = document.querySelector(
        "#new-arrival-item-wrapper"
      );
      if (!!NewArrivalWrapper) {
        wrapperWidth.current["#new-arrival-item-wrapper"] =
          (
            document.querySelector(
              "#new-arrival-item-wrapper"
            ) as HTMLDivElement
          ).scrollWidth -
          (document.querySelector("#new-arrival-wrapper") as HTMLDivElement)
            .clientWidth;
      }

      const popularItemWidth = document.querySelector("#popular-item-0");
      if (!!popularItemWidth) {
        wrapperWidth.current["#popular-item-0"] = (
          document.querySelector("#popular-item-0") as HTMLDivElement
        ).clientWidth;
      }

      const newArrivalItemWidth = document.querySelector("#new-arrival-item-0");
      if (!!newArrivalItemWidth) {
        wrapperWidth.current["#new-arrival-item-0"] = (
          document.querySelector("#new-arrival-item-0") as HTMLDivElement
        ).clientWidth;
      }
    }, 100);
  }, []);

  const setIntervalPopular = useCallback(() => {
    IntervalRef.current.popular = setInterval(() => {
      HandleClickChevron(
        "#popular-wrapper",
        wrapperWidth.current["#popular-item-wrapper"],
        wrapperWidth.current["#popular-item-0"],
        "right"
      );
    }, 3000);
  }, []);

  const setIntervalArrival = useCallback(() => {
    IntervalRef.current.arrival = setInterval(() => {
      HandleClickChevron(
        "#new-arrival-wrapper",
        wrapperWidth.current["#new-arrival-item-wrapper"],
        wrapperWidth.current["#new-arrival-item-0"],
        "right"
      );
    }, 5000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIntervalPopular();
      setIntervalArrival();
    }, 1000);
    return () => {
      clearInterval(IntervalRef.current.popular);
      clearInterval(IntervalRef.current.arrival);
    };
  }, [setIntervalPopular]);

  return (
    <Layout>
      <div className="mt-8">
        {error !== "" ? (
          <div className="w-full flex items-center justify-center">
            <div className="p-4 text-app-white text-xl bg-app-primary rounded-md">
              {error}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="text-xl text-white mb-4">Popular Products</div>
              <div className="py-2 flex flex-row items-center justify-center">
                <div className="text-app-primary">
                  <SVGAssets.ChevronRight
                    className="h-8 w-8 transform rotate-180 cursor-pointer"
                    onClick={() => {
                      clearInterval(IntervalRef.current.popular);
                      HandleClickChevron(
                        "#popular-wrapper",
                        wrapperWidth.current["#popular-item-wrapper"],
                        wrapperWidth.current["#popular-item-0"],
                        "left"
                      );
                      setIntervalPopular();
                    }}
                  />
                </div>

                <div className="overflow-hidden" id="popular-wrapper">
                  <div
                    className="flex flex-row flex-nowrap max-w-full"
                    id={"popular-item-wrapper"}
                  >
                    {data.data.map((item, index) => (
                      <div
                        id={`popular-item-${index}`}
                        key={index}
                        className="sm:px-2 lg:px-4"
                      >
                        <div
                          className="flex flex-col bg-app-white rounded-md "
                          style={{ minWidth: "215px", minHeight: "278px" }}
                        >
                          <div
                            className="flex flex-1 rounded-tl-md rounded-tr-md"
                            style={{
                              backgroundImage: `url("${item.Galeries[0].url}")`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              backgroundRepeat: "no-repeat",
                            }}
                          ></div>
                          <div className="flex flex-col p-4">
                            <div className="mb-2 text-app-secondary">
                              {item.Category.name}
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
                </div>
                <div className="text-app-primary">
                  <SVGAssets.ChevronRight
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => {
                      clearInterval(IntervalRef.current.popular);
                      HandleClickChevron(
                        "#popular-wrapper",
                        wrapperWidth.current["#popular-item-wrapper"],
                        wrapperWidth.current["#popular-item-0"],
                        "right"
                      );
                      setIntervalPopular();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mb-8 select-none">
              <div className="text-xl text-white mb-4">New Arrival</div>
              <div className="py-2 flex flex-row items-center justify-center">
                <div className="text-app-primary">
                  <SVGAssets.ChevronRight
                    className="h-8 w-8 transform rotate-180 cursor-pointer"
                    onClick={() => {
                      clearInterval(IntervalRef.current.arrival);
                      HandleClickChevron(
                        "#new-arrival-wrapper",
                        wrapperWidth.current["#new-arrival-item-wrapper"],
                        wrapperWidth.current["#new-arrival-item-0"],
                        "left"
                      );
                      setIntervalPopular();
                    }}
                  />
                </div>

                <div className="overflow-hidden" id="new-arrival-wrapper">
                  <div
                    className="flex flex-row flex-nowrap max-w-full"
                    id={"new-arrival-item-wrapper"}
                  >
                    {data.data.map((item, index) => (
                      <div
                        id={`new-arrival-item-${index}`}
                        key={index}
                        className="sm:px-2 lg:px-4"
                      >
                        <div
                          className="flex flex-col bg-app-white rounded-md "
                          style={{ minWidth: "215px", minHeight: "278px" }}
                        >
                          <div
                            className="flex flex-1 rounded-tl-md rounded-tr-md"
                            style={{
                              backgroundImage: `url("${item.Galeries[0].url}")`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              backgroundRepeat: "no-repeat",
                            }}
                          ></div>
                          <div className="flex flex-col p-4">
                            <div className="mb-2 text-app-secondary">
                              {item.Category.name}
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
                </div>
                <div className="text-app-primary">
                  <SVGAssets.ChevronRight
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => {
                      clearInterval(IntervalRef.current.arrival);
                      HandleClickChevron(
                        "#new-arrival-wrapper",
                        wrapperWidth.current["#new-arrival-item-wrapper"],
                        wrapperWidth.current["#new-arrival-item-0"],
                        "right"
                      );
                      setIntervalArrival();
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

Home.getInitialProps = async (ctx: NextPageContext) => {
  const props: IPropsHome = {
    data: {
      total_pages: 0,
      current_page: 0,
      limit: 0,
      total_data: 0,
      data: [],
    },
    error: "",
  };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?limit=10`
    );
    if (res.status >= 400) {
      const json = await res.json();
      throw new Error(json.message);
    } else {
      const json = await res.json();
      props.data = json.data;
    }
  } catch (error) {
    if (error instanceof Error) {
      props.error = error.message;
    }
    props.error = "something went wrong";
  }

  return props;
};

export default Home;
