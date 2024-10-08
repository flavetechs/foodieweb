import swal from 'sweetalert';
import {
  checkout,
  createUpdateMenuOrder,
  getCartList,
  getPopularRestaurants,
  getRestaurantMenu,
  removeMenuOrder,
} from '../../services/CustomerService';
import FoodieAlert from '../../jsx/utils/alert';
import { spinner } from './AuthActions';

export const SET_CUSTOMER_DETAILS = '[SET_CUSTOMER_DETAILS] set customer details';
export const SET_POPULAR_RESTAURANTS = '[SET_POPULAR_RESTAURANTS] set popular restaurants';
export const SET_MENU = '[SET_MENU] set restaurants menu';
export const ADD_TO_CART = '[ADD_TO_CART] Add to cart';
export const UPDATE_CART_LIST = '[UPDATE_CART_LIST] Update cart list';
export const REMOVE_FROM_CART = '[REMOVE_FROM_CART] Remove from cart';
export const CLEAR_CART = '[CLEAR_CART] Clear cart';
export const SET_SHOP_PATH = '[SET_SHOP_PATH] Set restaurant url';
export const SET_CUSTOMER_SEARCH = '[SET_CUSTOMER_SEARCH] Searchies';

export function getPopularRestaurantsAction() {
  return (dispatch) => {
    dispatch(spinner(true));
    getPopularRestaurants()
      .then((response) => {
        dispatch(spinner(false));
        dispatch({
          type: SET_POPULAR_RESTAURANTS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch(spinner(false));
        const errorMessage = error.response;
        swal('Oops', errorMessage, 'error');
      });
  };
}

export function getRestaurantsMenuAction(restaurantId) {
  return (dispatch) => {
    dispatch(spinner(true));
    getRestaurantMenu(restaurantId)
      .then((response) => {
        dispatch(spinner(false));
        dispatch({
          type: SET_MENU,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch(spinner(false));
        const errorMessage = error.response;
        swal('Oops', errorMessage, 'error');
      });
  };
}

export const GetCartListAction = ({ customerId, temporalId }) => {
  return (dispatch) => {
    dispatch(spinner(true));
    getCartList(customerId, temporalId)
      .then((response) => {
        dispatch(spinner(false));
        dispatch({
          type: UPDATE_CART_LIST,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch(spinner(false));
        const errorMessage = error.response.data.message;
        console.log('errorMessage', errorMessage);
      });
  };
};

export const AddToCartAction = ({ customerId, restaurantId, menuId, quantity, price, temporalId }) => {
  const menuOrder = {
    customerId,
    restaurantId,
    menuId,
    quantity,
    price,
    temporalId,
  };
  return (dispatch) => {
    dispatch({
      type: ADD_TO_CART,
      payload: menuOrder,
    });
    createUpdateMenuOrder(menuOrder)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
        RemoveFromCartOnServerErrorAction(menuId, customerId, temporalId)(dispatch);
      });
  };
};

export const RemoveFromCartAction = (menuId, customerId, temporalId) => {
  const menuOrder = {
    menuId,
    customerId,
    temporalId,
  };
  return (dispatch) => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: menuOrder,
    });
    removeMenuOrder(menuOrder)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        console.log('errorMessage', errorMessage);
      });
  };
};

export const RemoveFromCartOnServerErrorAction = (menuId, customerId, temporalId) => {
  const menuOrder = {
    menuId,
    customerId,
    temporalId,
  };
  return (dispatch) =>
    dispatch({
      type: REMOVE_FROM_CART,
      payload: menuOrder,
    });
};
export const AddToCartOnServerErrorAction = ({ customerId, restaurantId, menuId, quantity, price, temporalId }) => {
  const menuOrder = {
    customerId,
    restaurantId,
    menuId,
    quantity,
    price,
    temporalId,
  };

  return (dispatch) => {
    dispatch({
      type: ADD_TO_CART,
      payload: menuOrder,
    });
  };
};

export const ClearCartAction = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_CART,
    });
  };
};

export const CheckoutAction = (restaurantId, menuIds, customerId, temporalId, setSlider) => {
  const payload = {
    menuIds,
    customerId,
    temporalId,
    paymentCompleted: true,
    price: 0,
    restaurantId,
    paymentOption: 1,
  };

  return (dispatch) => {
    dispatch(spinner(true));
    checkout(payload)
      .then((response) => {
        ClearCartAction()(dispatch);
        setSlider('ordersuccess');
        FoodieAlert.showSuccess('Order Success');
        dispatch(spinner(false));
        return response.data;
      })
      .catch((error) => {
        dispatch(spinner(false));
        const errorMessage = error.response.data.message;
        console.log('errorMessage', errorMessage);
        FoodieAlert.showError(errorMessage);
      });
  };
};

export const setShopPathAction = (path) => {
  return (dispatch) => {
    dispatch({
      type: SET_SHOP_PATH,
      payload: path,
    });
  };
};
