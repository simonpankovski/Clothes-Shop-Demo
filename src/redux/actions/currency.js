const SET_CURRENCY = (data) => (dispatch) => {
    dispatch({ type: "SET_CURRENCY", payload: data });
};

export { SET_CURRENCY };
