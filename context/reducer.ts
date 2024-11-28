import { Product } from '@/models/Product';
import { SET_PRODUCTS, SET_SEARCH_QUERY, SET_FILTERED_PRODUCTS } from './actions';

interface State {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
}

const initialState: State = {
  products: [],
  filteredProducts: [],
  searchQuery: '',
};

const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case SET_PRODUCTS:
      return { ...state, products: action.payload, filteredProducts: action.payload };
    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case SET_FILTERED_PRODUCTS:
      return { ...state, filteredProducts: action.payload };
    default:
      return state;
  }
};

export { initialState, reducer };