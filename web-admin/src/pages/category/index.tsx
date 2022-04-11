import { useCallback, useEffect } from "react";
import { Layout } from "../../components";
import { GetAllCategories } from "../../service/category";

function Dashboard() {
  const FetchAllCategory = useCallback(async () => {
    const response = await GetAllCategories();
    console.log(response);
  }, []);

  useEffect(() => {
    FetchAllCategory();
  }, [FetchAllCategory]);
  return <Layout>Category</Layout>;
}

export default Dashboard;
