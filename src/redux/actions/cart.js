const ADD_TO_CART = (data) => (dispatch) => {
    dispatch({ type: "ADD_TO_CART", payload: data });
};
const REMOVE_FROM_CART = (data) => (dispatch) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: data });
};
const TOGGLE_CART_MENU = (data) => (dispatch) => {
    dispatch({type: "TOGGLE_CART_MENU", payload: data})
}
const CLOSE_CART_MENU = (data) => (dispatch) => {
    dispatch({type: "CLOSE_CART_MENU", payload: data})
}
export { ADD_TO_CART, REMOVE_FROM_CART, TOGGLE_CART_MENU, CLOSE_CART_MENU };