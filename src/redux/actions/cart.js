const ADD_TO_CART = (data) => (dispatch) => {
    dispatch({ type: "ADD_TO_CART", payload: data });
};
const REMOVE_FROM_CART = (data) => (dispatch) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: data });
};
export { ADD_TO_CART, REMOVE_FROM_CART };