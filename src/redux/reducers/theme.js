const initialState = {
    isLightMode: window.matchMedia("(prefers-color-scheme: dark)"),
};
const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "TOGGLE_THEME":
            return { isLightMode: !state.isLightMode };
        default:
            return state;
    }
};
export default cartReducer;
