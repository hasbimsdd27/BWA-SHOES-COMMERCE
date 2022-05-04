import { getCookie } from "../utils/cookieHandler";
import { Store } from "../redux/reducer/rootReducer";
import { SetAuthRedux } from "../redux/action/auth";

export const getUserProfile = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
    {
      method: "GET",
      headers: {
        Authorization: getCookie("access_token"),
      },
    }
  );

  const data = await response.json();

  Store.dispatch(SetAuthRedux(data.data) as any);
};
