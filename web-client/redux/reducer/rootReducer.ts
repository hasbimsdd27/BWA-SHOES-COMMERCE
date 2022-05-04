import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";

import AuthReducer, { IAuthReducer } from "./authReducer";
import CartReducer, { ICartReducer } from "./cartReducer";

export interface IRootReducer {
  AuthReducer: IAuthReducer;
  CartReducer: ICartReducer;
}

const RootReducer = combineReducers<IRootReducer>({
  AuthReducer,
  CartReducer,
});

const middleware = [thunk];

export const Store = createStore(
  RootReducer,
  compose(applyMiddleware(...middleware))
);
