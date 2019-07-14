import {Dispatch, Action} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {createSelector} from 'reselect';

import {fetchProductsApi, purchaseApi} from '../api';
import {RootState} from './index';
import {isPremiumMember, MemberType} from './member';

export interface Product {
  id: number;
  label: string;
  price: number;
  isPremiumOnly: boolean;
}

export interface ProductsState {
  productList: Product[];
  selectedProductIds: number[];
}

export interface ProductsDerivedData {
  purchasableProductList: Product[];
  totalPrice: number;
  requestPurchase: () => Promise<void>;
}

enum ActionTypes {
  UPDATE_SELECTED_PRODUCT_IDS = 'UPDATE_SELECTED_PRODUCT_IDS',
  CLEAR_SELECTED_PRODUCT_IDS = 'CLEAR_SELECTED_PRODUCT_IDS',
  FETCH_PRODUCT_LIST = 'FETCH_PRODUCT_LIST',
}

interface UpdateSelectedProductIdsAction extends Action {
  type: ActionTypes.UPDATE_SELECTED_PRODUCT_IDS;
  payload: {
    selectedProductIds: number[];
  };
}

interface ClearSelectedProductIdsAction extends Action {
  type: ActionTypes.CLEAR_SELECTED_PRODUCT_IDS;
  payload: {};
}

interface FetchProductListAction extends Action {
  type: ActionTypes.FETCH_PRODUCT_LIST;
  payload: {
    productList: Product[];
  };
}

type ProductsActions =
  | UpdateSelectedProductIdsAction
  | ClearSelectedProductIdsAction
  | FetchProductListAction;

type UpdateSelectedProductIds = (
  targetProductId: number,
  currentSelectedProductIds: number[]
) => UpdateSelectedProductIdsAction;

type ClearSelectedProductIds = () => ClearSelectedProductIdsAction;

const initialState: ProductsState = {
  productList: [],
  selectedProductIds: [],
};

export const updateSelectedProductIds: UpdateSelectedProductIds = (
  targetProductId,
  currentSelectedProductIds
) => {
  const isExistAlready = currentSelectedProductIds.includes(targetProductId);

  let selectedProductIds: number[];
  if (isExistAlready) {
    selectedProductIds = currentSelectedProductIds.filter(
      (id): boolean => id !== targetProductId
    );
  } else {
    selectedProductIds = [...currentSelectedProductIds, targetProductId];
  }

  return {
    type: ActionTypes.UPDATE_SELECTED_PRODUCT_IDS,
    payload: {
      selectedProductIds,
    },
  };
};

export const clearSelectedProductIds: ClearSelectedProductIds = () => ({
  type: ActionTypes.CLEAR_SELECTED_PRODUCT_IDS,
  payload: {},
});

export const fetchProductList = (): ThunkAction<
  void,
  ProductsState,
  undefined,
  FetchProductListAction
> => {
  return async (
    dispatch: Dispatch<FetchProductListAction>
  ): Promise<FetchProductListAction> => {
    try {
      const res = await fetchProductsApi();
      return dispatch({
        type: ActionTypes.FETCH_PRODUCT_LIST,
        payload: {
          productList: res.map(
            (p): Product => ({
              id: p.id,
              label: p.namae,
              price: p.price,
              isPremiumOnly: p.premium_only,
            })
          ),
        },
      });
    } catch (e) {
      return dispatch({
        type: ActionTypes.FETCH_PRODUCT_LIST,
        payload: {
          productList: [],
        },
      });
    }
  };
};

export const products = (
  state = initialState,
  action: ProductsActions
): ProductsState => {
  const {type} = action;

  switch (type) {
    case ActionTypes.UPDATE_SELECTED_PRODUCT_IDS: {
      const {payload} = action as UpdateSelectedProductIdsAction;
      return {
        ...state,
        selectedProductIds: payload.selectedProductIds,
      };
    }

    case ActionTypes.CLEAR_SELECTED_PRODUCT_IDS: {
      return {
        ...state,
        selectedProductIds: [],
      };
    }

    case ActionTypes.FETCH_PRODUCT_LIST: {
      const {payload} = action as FetchProductListAction;
      return {
        ...state,
        productList: payload.productList,
      };
    }

    default:
      return state;
  }
};

const PREMIUM_DISCOUNT_PERCENTAGE = 10;

const applyPremiumDiscount = (originalPrice: number): number =>
  originalPrice - Math.floor(originalPrice / PREMIUM_DISCOUNT_PERCENTAGE);

const extractPurchasableProductList = ({
  productList,
  selectedMember,
}: {
  productList: Product[];
  selectedMember: MemberType | null;
}): Product[] => {
  const isPremium = selectedMember ? isPremiumMember(selectedMember) : false;
  return productList
    .filter((p): boolean => {
      if (isPremium) return true;
      return !p.isPremiumOnly;
    })
    .map(
      (p): Product => {
        if (!isPremium) return p;
        return {
          ...p,
          price: applyPremiumDiscount(p.price),
        };
      }
    );
};

const calculateTotalPrice = ({
  selectedProductIds,
  productList,
}: {
  selectedProductIds: number[];
  productList: Product[];
}): number =>
  productList.reduce((acc: number, p: Product): number => {
    if (selectedProductIds.includes(p.id)) {
      return acc + p.price;
    }
    return acc;
  }, 0);

const requestPurchase = async ({
  selectedMember,
  selectedProductIds,
}: {
  selectedMember: MemberType | null;
  selectedProductIds: number[];
}): Promise<void> => {
  if (!selectedMember) throw new Error('Member type is null.');
  purchaseApi(selectedProductIds, isPremiumMember(selectedMember));
};

const getProductsState = (state: RootState) => state.products;
const getSelectedMember = (state: RootState) => state.member.selectedMember;

export const productsDerivedDataSelector = createSelector(
  [getProductsState, getSelectedMember],
  (productsState, selectedMember) => {
    const {productList, selectedProductIds} = productsState;
    const purchasableProductList = extractPurchasableProductList({
      productList,
      selectedMember,
    });

    return {
      purchasableProductList,
      totalPrice: calculateTotalPrice({
        selectedProductIds,
        productList: purchasableProductList,
      }),
      requestPurchase: () =>
        requestPurchase({selectedMember, selectedProductIds}),
    };
  }
);
