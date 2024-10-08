import FoodieAlert from '../../jsx/utils/alert';
import {
  acceptOrder,
  cancelOrder,
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getCustomerOrders,
  getDashboardStats,
  getOrdersInKitchen,
  getSingleRestaurant,
  reinstateOrder,
  rejectOrder,
  updateRestaurant,
} from '../../services/RestaurantService';
import swal from 'sweetalert';
import { spinner } from './AuthActions';

export const GET_ALL_RESTAURANT = '[GET_ALL_CLIENT] get all restaurants';
export const GET_CSUTOMER_ORDERS = '[GET_CSUTOMER_ORDERS] get orders';
export const GET_ORDERS_IN_KITCHEN = '[GET_ORDERS_IN_KITCHEN] get orders';
export const SET_DASHBOARD_STATS = '[SET_DASHBOARD_STATS] get stats';
///Menu Actions
export function getAllRestaurantsAction() {
  return (dispatch) => {
    getAllRestaurants()
      .then((response) => {
        dispatch({
          type: GET_ALL_RESTAURANT,
          payload: response.data,
        });
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}

export async function getSingleRestaurantAction(id) {
  return getSingleRestaurant(id)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      const errorMessage = error.response.data.message;
      FoodieAlert.showError(errorMessage);
    });
}

export function createRestaurantAction(payload, setShowForm, resetForm) {
  return (dispatch) => {
    createRestaurant(payload)
      .then((response) => {
        setShowForm(false);
        resetForm();
        getAllRestaurants()(dispatch);
        FoodieAlert.showSuccess('Restaurant successfully created');
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}

export function updateRestaurantAction(payload, setShowForm, resetForm, setSelectedItem) {
  return (dispatch) => {
    updateRestaurant(payload)
      .then((response) => {
        setShowForm(false);
        resetForm();
        setSelectedItem(null);
        swal('Successful', 'Restaurant successfully updated', 'success');
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}

export function deleteRestaurantAction(payload) {
  return (dispatch) => {
    deleteRestaurant(payload)
      .then((response) => {
        swal('Successful', 'Restaurant successfully deleted', 'success');
        return response.data;
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}

export function getCustomerordersAction(status) {
  return (dispatch) => {
    dispatch(spinner(true));
    getCustomerOrders(status)
      .then((response) => {
        dispatch(spinner(false));
        dispatch({
          type: GET_CSUTOMER_ORDERS,
          payload: response.data,
        });
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}

export function getOrdersInKitchenAction(status) {
  return (dispatch) => {
    dispatch(spinner(true));
    getOrdersInKitchen(status)
      .then((response) => {
        dispatch(spinner(false));
        dispatch({
          type: GET_ORDERS_IN_KITCHEN,
          payload: response.data,
        });
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}

export function acceptOrderAction(id, setAcceptOrderBtn) {
  const payload = {
    checkoutOrderId: id,
  };
  setAcceptOrderBtn('Accepting.....');
  return (dispatch) => {
    acceptOrder(payload)
      .then((response) => {
        setAcceptOrderBtn('ACCEPT ORDER');
        FoodieAlert.showSuccess('Order Accepted Successfully');
        return response.data;
      })
      .catch((error) => {
        setAcceptOrderBtn('ACCEPT ORDER');
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}

export function rejectOrderAction(id, setRejectOrderBtn) {
  const payload = {
    checkoutOrderId: id,
  };
  setRejectOrderBtn('Rejecting.....');
  return (dispatch) => {
    rejectOrder(payload)
      .then((response) => {
        setRejectOrderBtn('REJECT');
        FoodieAlert.showSuccess('Order Rejected Successfully');
        return response.data;
      })
      .catch((error) => {
        setRejectOrderBtn('REJECT');
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}
export function cancelOrderAction(id, setCancelOrderBtn) {
  const payload = {
    checkoutOrderId: id,
  };
  setCancelOrderBtn('Cancelling.....');
  return (dispatch) => {
    cancelOrder(payload)
      .then((response) => {
        setCancelOrderBtn('CANCEL ORDER');
        FoodieAlert.showSuccess('Order Cancelled Successfully');
        return response.data;
      })
      .catch((error) => {
        setCancelOrderBtn('CANCEL ORDER');
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}

export function reinstateOrderAction(id, setReinstateOrderBtn) {
  const payload = {
    checkoutOrderId: id,
  };
  setReinstateOrderBtn('Loading.....');
  return (dispatch) => {
    reinstateOrder(payload)
      .then((response) => {
        setReinstateOrderBtn('REINSTATE ORDER');
        FoodieAlert.showSuccess('Order Reinstated Successfully');
        return response.data;
      })
      .catch((error) => {
        setReinstateOrderBtn('REINSTATE ORDER');
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}

export function getDashboardAction() {
  return (dispatch) => {
    getDashboardStats()
      .then((response) => {
        dispatch({
          type: SET_DASHBOARD_STATS,
          payload: response.data,
        });
        return response.data;
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        FoodieAlert.showError(errorMessage);
      });
  };
}
