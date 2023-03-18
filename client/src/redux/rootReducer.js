const initailState = {
  loading: false,
  cartItems: [],
  count: 0
};

export const rootReducer = (state = initailState, action) => {
  switch (action.type) {
    case "addToCart":
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(item => item.name === newItem.name);
      
      if (existingItemIndex !== -1) { // item already exists in cart
        const updatedCartItems = state.cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return {...item, quantity: item.quantity + newItem.quantity}; // update quantity of existing item
          }
          return item;
        });
        return {...state, cartItems: updatedCartItems};
      } else { // item does not exist in cart
        return {...state, cartItems: [...state.cartItems, newItem]};
      }

    case "deleteFromCart":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item._id !== action.payload._id),
      };

    case "updateCart":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "showLoading":
      return {
        ...state,
        loading: true,
      };
    case "hideLoading":
      return {
        ...state,
        loading: false,
      };

    case "incrementCount":
      return {
        ...state,
        count: state.count + 1,
      };

    default:
      return state;
  }
};

 