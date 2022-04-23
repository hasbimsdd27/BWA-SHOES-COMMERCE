import type { NextPage, NextPageContext } from "next";
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
  return (
    <Layout>
      {error !== "" ? (
        <div className="w-full flex items-center justify-center">
          <div className="p-4 text-app-white text-xl bg-app-primary rounded-md">
            {error}
          </div>
        </div>
      ) : (
        <div>
          <div className="text-xl text-white mb-4">Popular Products</div>
          <div className="w-full flex flex-row flex-nowrap">
            {data.data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col bg-app-white rounded-md mr-6"
                style={{
                  width: "215px",
                  height: "278px",
                }}
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
            ))}
          </div>
        </div>
      )}
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
