import {createStore, combineReducers, applyMiddleware, Store} from 'redux';
import thunk from 'redux-thunk';

import {member, MemberState} from './member';
import {products, ProductsState} from './products';

export interface RootState {
  member: MemberState;
  products: ProductsState;
}

const reducer = combineReducers({member, products});
const store: Store<RootState> = createStore(
  reducer,
  /* eslint-disable no-underscore-dangle */
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
        applyMiddleware(thunk)
      )
    : applyMiddleware(thunk)
  /* eslint-enable no-underscore-dangle */
);
export default store;
