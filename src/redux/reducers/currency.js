const initialState = {
    currency: { label: "USD", symbol: "$" }
};

const currencyReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CURRENCY":
            console.log(action.payload)
            return { ...state, currency: action.payload };
        default:
            return state;
    }
};

export default currencyReducer;