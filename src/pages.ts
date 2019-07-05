import {Action} from 'redux';
import {ThunkAction} from 'redux-thunk';

import {fetchMemberTypes} from './store/member';
import {fetchProductList} from './store/products';

export const PAGE_PATHS = {
  MEMBER: '/member',
  PRODUCTS: '/products',
};

export const extractActionCreatorsToUseOnMounted = (
  url: string
): (() => ThunkAction<void, any, undefined, Action>)[] => {
  switch (url) {
    case PAGE_PATHS.MEMBER:
      return [fetchMemberTypes];

    case PAGE_PATHS.PRODUCTS:
      return [fetchProductList];

    default:
      return [];
  }
};
