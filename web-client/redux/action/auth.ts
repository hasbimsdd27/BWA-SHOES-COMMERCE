import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { IAuthReducer } from "../reducer/authReducer";
import { ICartReducer } from "../reducer/cartReducer";
import { RESET_AUTH, SET_AUTH } from "../type/auth";

export const SetAuthRedux =
  (payload: ICartReducer) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({
      type: SET_AUTH,
      payload,
    });
  };

export const ResetAuthRedux =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({
      type: RESET_AUTH,
    });
  };
