import { GenerateUUID } from '../../../jsx/utils/common';
import {
  GENERATE_TEMP_ID,
  LOADING_TOGGLE_ACTION,
  LOGIN_CONFIRMED_ACTION,
  LOGIN_FAILED_ACTION,
  LOGOUT_ACTION,
  SET_MENU,
  SIGNUP_CONFIRMED_ACTION,
  SIGNUP_FAILED_ACTION,
  SPIN,
} from '../../actions/AuthActions';

const initialState = {
  auth: {
    id: '',
    email: '',
    idToken: '',
    localId: '',
    expiresIn: '',
    refreshToken: '',
    socket: null,
    restaurantId: '',
  },
  errorMessage: '',
  successMessage: '',
  showLoading: false,
  sessionId: '',
  menuList: [],
};

export function AuthReducer(state = initialState, action) {
  if (action.type === SIGNUP_CONFIRMED_ACTION) {
    return {
      ...state,
      auth: action.payload,
      errorMessage: '',
      successMessage: '',
      showLoading: false,
    };
  }
  if (action.type === LOGIN_CONFIRMED_ACTION) {
    return {
      ...state,
      auth: action.payload,
      errorMessage: '',
      successMessage: '',
      showLoading: false,
    };
  }

  if (action.type === LOGOUT_ACTION) {
    return {
      ...state,
      errorMessage: '',
      successMessage: '',
      auth: {
        email: '',
        idToken: '',
        localId: '',
        expiresIn: '',
        refreshToken: '',
      },
    };
  }

  if (action.type === SIGNUP_FAILED_ACTION || action.type === LOGIN_FAILED_ACTION) {
    return {
      ...state,
      errorMessage: action.payload,
      successMessage: '',
      showLoading: false,
    };
  }

  if (action.type === LOADING_TOGGLE_ACTION) {
    return {
      ...state,
      showLoading: action.payload,
    };
  }

  if (action.type === GENERATE_TEMP_ID) {
    return {
      ...state,
      sessionId: !state.sessionId ? GenerateUUID() : state.sessionId,
    };
  }

  if (action.type === SPIN) {
    return {
      ...state,
      showLoading: action.payload,
    };
  }
  if (action.type === SET_MENU) {
    return {
      ...state,
      menuList: action.payload,
    };
  }

  return state;
}
