import {createStore, combineReducers, applyMiddleware, Store} from 'redux';
import thunk from 'redux-thunk';

import {member, MemberState} from './member';
import {products, ProductsState} from './products';

export interface RootState {
  member: MemberState;
  products: ProductsState;
}

const reducer = combineReducers({member, products});
const store: Store<RootState> = createStore(reducer, applyMiddleware(thunk));
export default store;
