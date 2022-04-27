import { NextPage, NextPageContext } from "next";
import React, { useState } from "react";
import Layout from "../../components/layout";

interface IParamsDetail {
  data: {
    id: string;
    name: string;
    price: number;
    description: string;
    tags: string;
    category_id: string;
    Galeries: { id: string; url: string }[];
    Category: {
      id: string;
      name: string;
    };
  };
  error: {
    isError: boolean;
    errorMessage: string;
  };
}

const Products: NextPage<IParamsDetail> = ({ data, error }) => {
  const [selected, setSelected] = useState<number>(0);

  const HandleClickImage = (left: number) => {
    if (!!document.querySelector("#galery-wrapper"))
      (document.querySelector("#galery-wrapper") as HTMLDivElement).scrollTo({
        left,
        behavior: "smooth",
      });
  };
  return (
    <Layout>
      <div className="mt-8">
        {error.isError ? (
          <div className="w-full flex items-center justify-center">
            <div className="p-8 text-white bg-app-primary rounded-md">
              <div className="text-center mb-4">
                <span className="text-5xl ">😭</span>
              </div>
              <div className="text-center">{error.errorMessage}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row text-white">
            <div className="flex flex-col p-4">
              <div
                className="overflow-hidden mb-4"
                style={{ width: 400 }}
                id="galery-wrapper"
              >
                <div className="flex flex-row flex-nowrap">
                  {data.Galeries.map((item, index) => (
                    <div
                      key={index}
                      style={{ minWidth: 400, minHeight: 405 }}
                      className="px-4 flex items-center justify-center"
                    >
                      <div
                        key={index}
                        className="rounded-md mx-4 w-full h-full"
                        style={{
                          backgroundImage: `url("${item.url}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row items-center justify-center flex-wrap">
                {data.Galeries.map((item, index) => (
                  <div
                    key={index}
                    className={`m-1 p-1 rounded-md cursor-pointer transition-all duration-75 border-2 ${
                      selected === index
                        ? " border-app-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => {
                      setSelected(index);
                      HandleClickImage(index * 400);
                    }}
                  >
                    <img
                      src={item.url}
                      className="h-14 w-14 rounded-md cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col flex-1 bg-app-bg-input rounded-md p-4 ">
              <div className="flex flex-row items-center mb-10">
                <div className="flex flex-1 flex-col">
                  <h1 className="text-2xl font-bold mb-1">{data.name}</h1>
                  <small className="text-app-secondary text-lg">
                    {data.Category.name}
                  </small>
                </div>
                <div>
                  <div className="text-3xl text-app-teal">
                    {data.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-1">
                <p>{data.description}</p>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-1 items-center justify-end px-2">
                  <button className="px-2 py-4 bg-app-info rounded-md">
                    Add to cart
                  </button>
                </div>
                <div className="flex flex-1 items-center justify-start px-2">
                  <button className="px-2 py-4 bg-app-primary rounded-md">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

Products.getInitialProps = async (ctx: NextPageContext) => {
  const props = {
    data: {
      id: "",
      name: "",
      price: 0,
      description: "",
      tags: "",
      category_id: "",
      Galeries: [],
      Category: {
        id: "",
        name: "",
      },
    },
    error: {
      isError: false,
      errorMessage: "",
    },
  };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/${ctx.query.id}`
    );
    if (res.status >= 400) {
      const json = await res.json();
      throw new Error(json.message);
    } else {
      const json = await res.json();
      props.data = json.data;
    }
  } catch (error) {
    console.log(error);
    props.error.isError = true;
    if (error instanceof Error) {
      props.error.errorMessage = error.message;
    }
    props.error.errorMessage = "something went wrong";
  }

  return props;
};

export default Products;
