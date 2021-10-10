import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
} from "../actionTypes";

const initialState = {
  token: null,
  userId: null,
  userName: null,
  error: null,
  loading: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        ...{ error: null, loading: true },
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        ...{
          token: action.payload.token,
          userId: action.payload.userId,
          userName: action.payload.userName,
          error: null,
          loading: false,
        },
      };
    case AUTH_FAIL:
      return {
        ...state,
        ...{ error: action.payload.error, loading: false },
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        ...{
          token: null,
          userId: null,
          userName: null,
        },
      };
    default:
      return state;
  }
};
