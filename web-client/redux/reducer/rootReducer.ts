import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";

import AuthReducer, { IAuthReducer } from "./authReducer";

export interface IRootReducer {
  AuthReducer: IAuthReducer;
}

const RootReducer = combineReducers<IRootReducer>({
  AuthReducer,
});

const middleware = [thunk];

export const Store = createStore(
  RootReducer,
  compose(applyMiddleware(...middleware))
);
