const initailState = {
  loading: false,
  cartItems: [],
  cartItemsCustomer: [],
  additionalDetails: '', // add this line to define additionalDetails in the initial state
};

export const rootReducer = (state = initailState, action) => {
  switch (action.type) {
    case "addToCart":
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(item => item.name === newItem.name);

      if (existingItemIndex !== -1) { // item already exists in cart
        const updatedCartItems = state.cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + newItem.quantity }; // update quantity of existing item
          }
          return item;
        });
        return { ...state, cartItems: updatedCartItems };
      } else { // item does not exist in cart
        return { ...state, cartItems: [...state.cartItems, newItem] };
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

      case "addToCartCustomer":
        const newItemCustomer = action.payload;
        const existingItemIndexCustomer = state.cartItemsCustomer.findIndex(item => item.name === newItemCustomer.name);
        
        if (existingItemIndexCustomer !== -1) { // item already exists in cart
          const updatedcartItemsCustomer = state.cartItemsCustomer.map((item, index) => {
            if (index === existingItemIndexCustomer) {
              return {...item, quantity: item.quantity + newItemCustomer.quantity, additionalDetails: newItemCustomer.additionalDetails}; // update quantity and additional details of existing item
            }
            return item;
          });
          const newState = {...state, cartItemsCustomer: updatedcartItemsCustomer};
          localStorage.setItem("cartItemsCustomer", JSON.stringify(newState.cartItemsCustomer)); // update local storage
          return newState;
        } else { // item does not exist in cart
          const newState = {...state, cartItemsCustomer: [...state.cartItemsCustomer, {...newItemCustomer, additionalDetails: newItemCustomer.additionalDetails}]};
          localStorage.setItem("cartItemsCustomer", JSON.stringify(newState.cartItemsCustomer)); // update local storage
          return newState;
        }
    case "deleteFromCartCustomer":
      const updatedCartItemsCustomer = state.cartItemsCustomer.map((item) => {
        if (item._id === action.payload._id) {
          return {
            ...item,
            quantity: item.quantity - 1 // decrease quantity of item by 1
          };
        }
        return item;
      }).filter((item) => item.quantity > 0); // remove item from cart if quantity is 0

      localStorage.setItem("cartItemsCustomer", JSON.stringify(updatedCartItemsCustomer)); // update localStorage

      return {
        ...state,
        cartItemsCustomer: updatedCartItemsCustomer
      };

    case "resetCartItemsCustomer":
      localStorage.setItem("cartItemsCustomer", "[]"); // reset localStorage
      return {
        ...state,
        cartItemsCustomer: [] // reset cartItemsCustomer to an empty array
      };
      case "handleDeleteCartItem":
        const updatedCartItems = state.cartItemsCustomer.filter((item, i) => i !== action.payload.index);
        localStorage.setItem('cartItemsCustomer', JSON.stringify(updatedCartItems));
        return {
          ...state,
          cartItemsCustomer: updatedCartItems
        };
    default:
      return state;
  }
};

