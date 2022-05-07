import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ICheckoutReducer } from "../reducer/checkoutReducer";
import { RESET_CHECKOUT, SET_CHECKOUT } from "../type/checkout";

export const SetCheckoutData =
  (payload: ICheckoutReducer) =>
  (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({
      type: SET_CHECKOUT,
      payload,
    });
  };

export const ResetCheckoutData =
  (payload: ICheckoutReducer) =>
  (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({
      type: RESET_CHECKOUT,
      payload,
    });
  };
