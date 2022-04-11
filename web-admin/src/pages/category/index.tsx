import { useCallback, useEffect, useState } from "react";
import { Layout } from "../../components";
import { GetAllCategories } from "../../service/category";

function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const FetchAllCategory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GetAllCategories();
      const responseData = await response.json();
      console.log(responseData.data);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    FetchAllCategory();
  }, [FetchAllCategory]);
  return <Layout>Category</Layout>;
}

export default Dashboard;
