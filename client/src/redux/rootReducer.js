const initailState = {
    loading: false,
    cartItems: [],
  };

  export const rootReducer = (state = initailState, action) => {
    switch (action.type) {

      case 'addToCart' : return{
        ...state,
        cartItems: [...state.cartItems, action.payload],
      }

      default : return state
    }
}