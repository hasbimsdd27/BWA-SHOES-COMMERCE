import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";

import AuthReducer, { IAuthReducer } from "./authReducer";
import CartReducer, { ICartReducer } from "./cartReducer";
import CheckoutReducer, { ICheckoutReducer } from "./checkoutReducer";

export interface IRootReducer {
  AuthReducer: IAuthReducer;
  CartReducer: ICartReducer;
  CheckoutReducer: ICheckoutReducer;
}

const RootReducer = combineReducers<IRootReducer>({
  AuthReducer,
  CartReducer,
  CheckoutReducer,
});

const middleware = [thunk];

export const Store = createStore(
  RootReducer,
  compose(applyMiddleware(...middleware))
);
