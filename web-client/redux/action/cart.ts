import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { IAuthReducer } from "../reducer/authReducer";
import { RESET_CART, SET_CART } from "../type/cart";

export const SetCartRedux =
  (payload: IAuthReducer) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({
      type: SET_CART,
      payload,
    });
  };

export const ResetCartRedux =
  () => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({
      type: RESET_CART,
    });
  };
