import { AnyAction } from "redux";
import { RESET_CHECKOUT, SET_CHECKOUT } from "../type/checkout";
import { ICartData } from "./cartReducer";

export interface ICheckoutReducer {
  items: ICartData[];
}
const initialState: ICheckoutReducer = {
  items: [],
};

const CheckoutReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_CHECKOUT:
      return { ...state, ...action.payload };

    case RESET_CHECKOUT:
      return initialState;

    default:
      return state;
  }
};

export default CheckoutReducer;
