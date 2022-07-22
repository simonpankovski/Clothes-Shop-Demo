const initialState = {
    cart: {},
    quantity: 0
};
const getCart = (state, action) => {
    let objId = { id: action.payload.id, ...action.payload.selectedAttributes };
    let idString = "'" + JSON.stringify(objId) + "'";
    let tempMap = { ...state.cart };
    return [tempMap, idString];
}
const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_TO_CART":
            let tempMap = getCart(state, action);
            let cartObj = tempMap[0];
            let idString = tempMap[1];
            if (cartObj[idString]) {
                cartObj[idString].quantity = cartObj[idString].quantity + 1;
            }
            else {
                cartObj[idString] = action.payload;
            }
            return { ...state, cart: cartObj, quantity: state.quantity + 1 };
        case "REMOVE_FROM_CART":
            let tempMap1 = getCart(state, action);
            let cartObj1 = tempMap1[0];
            let idString1 = tempMap1[1];
            if (cartObj1[idString1].quantity === 1) {
                delete cartObj1[idString1];
            }
            else {
                cartObj1[idString1].quantity = cartObj1[idString1].quantity - 1;
            }
            return { ...state, cart: cartObj1, quantity: state.quantity - 1 };
        default:
            return state;
    }
};

export default cartReducer;