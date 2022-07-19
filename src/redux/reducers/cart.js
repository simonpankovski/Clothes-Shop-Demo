const initialState = {
    cart: {}
};

const cartReducer = (state = initialState, action) => {

    switch (action.type) {
        case "ADD_TO_CART":
            let id = { id: action.payload.id, ...action.payload.selectedAttributes };
            let idString = "'" + JSON.stringify(id) + "'";
            let tempMap = { ...state.cart };
            if (tempMap[idString]) {
                tempMap[idString].quantity = tempMap[idString].quantity + 1;
            }
            else {
                tempMap[idString] = action.payload;
            }
            return { ...state, cart: tempMap };
        case "REMOVE_FROM_CART":
            console.log(tempMap[idString])
            return { ...state, cart: tempMap };
        default:
            return state;
    }
};

export default cartReducer;