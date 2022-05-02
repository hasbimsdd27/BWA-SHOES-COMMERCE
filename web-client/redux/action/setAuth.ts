import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { IAuthReducer } from "../reducer/authReducer";
import { RESET_AUTH, SET_AUTH } from "../type/auth";

export const SetAuthRedux =
  (payload: IAuthReducer) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
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
