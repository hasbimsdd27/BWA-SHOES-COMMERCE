import { AnyAction } from "redux";
import { RESET_CART, SET_CART } from "../type/cart";

export interface ICartData {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    tags: string;
    category_id: string;
    Galeries: {
      id: string;
      product_id: string;
      url: string;
    }[];
    Category: {
      id: string;
      name: string;
    };
    rating: number;
    purchased: number;
    weight: number;
    created_by: string;
  };
  quantity: number;
}

export interface ICartReducer {
  data: ICartData[];
  status: string;
}

const initialState: ICartReducer = {
  status: "",
  data: [],
};

const CartReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_CART:
      return { ...state, ...action.payload };

    case RESET_CART:
      return initialState;

    default:
      return state;
  }
};

export default CartReducer;
