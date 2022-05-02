import { getCookie } from "../utils/cookieHandler";
import { Store } from "../redux/reducer/rootReducer";
import { SET_AUTH } from "../redux/type/auth";
import { SetAuthRedux } from "../redux/action/setAuth";

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
