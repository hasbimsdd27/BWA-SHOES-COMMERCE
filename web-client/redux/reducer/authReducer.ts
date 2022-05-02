import { AnyAction } from "redux";
import { RESET_AUTH, SET_AUTH } from "../type/auth";

export interface IAuthReducer {
  username: string;
  name: string;
  phone: string;
  email: string;
  UserAddress: {
    id: string;
    user_id: string;
    address_id: number;
    address_name: string;
    address_type: string;
    complete_address: string;
  };
}

const initialState: IAuthReducer = {
  username: "",
  name: "",
  phone: "",
  email: "",
  UserAddress: {
    id: "",
    user_id: "",
    address_id: 0,
    address_name: "",
    address_type: "",
    complete_address: "",
  },
};

const AuthReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_AUTH:
      return { ...state, ...action.payload };

    case RESET_AUTH:
      return initialState;

    default:
      return state;
  }
};

export default AuthReducer;
