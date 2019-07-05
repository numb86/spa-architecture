import React, {useEffect, useCallback} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import {PAGE_PATHS, extractActionCreatorsToUseOnMounted} from '../pages';
import {RootState} from '../store';
import {selectMemberType, MemberState, MemberType} from '../store/member';
import {
  updateSelectedProductIds,
  clearSelectedProductIds,
  extractPurchasableProductList,
  calculateTotalPrice,
  requestPurchase,
  ProductsState,
} from '../store/products';

import SelectMemberTypePage from './SelectMemberTypePage';
import SelectProductsPage from './SelectProductsPage';

const App: React.FC = () => {
  const member = useSelector((state: RootState): MemberState => state.member);
  const products = useSelector(
    (state: RootState): ProductsState => state.products
  );
  const dispatch = useDispatch();

  const useFetchApi = (hasDataAlready = false): void => {
    useEffect((): void => {
      if (hasDataAlready) return;
      const targetActionCreators = extractActionCreatorsToUseOnMounted(
        window.location.pathname
      );
      targetActionCreators.forEach((actionCreator): void => {
        dispatch(actionCreator());
      });
    }, [hasDataAlready]);
  };

  const productList = extractPurchasableProductList({
    productList: products.productList,
    selectedMember: member.selectedMember,
  });
  const totalPrice = calculateTotalPrice({
    selectedProductIds: products.selectedProductIds,
    productList,
  });
  const purchase = async (): Promise<void> => {
    requestPurchase({
      selectedMember: member.selectedMember,
      selectedProductIds: products.selectedProductIds,
    });
  };

  const bindedSelectMemberType = useCallback(
    (memberType: MemberType) => dispatch(selectMemberType(memberType)),
    [dispatch]
  );
  const bindedUpdateSelectedProductIds = useCallback(
    (targetProductId, currentSelectedProductIds) =>
      dispatch(
        updateSelectedProductIds(targetProductId, currentSelectedProductIds)
      ),
    [dispatch]
  );
  const bindedClearSelectedProductIds = useCallback(
    () => dispatch(clearSelectedProductIds()),
    [dispatch]
  );

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path={PAGE_PATHS.MEMBER}
          render={(): React.ReactElement => (
            <SelectMemberTypePage
              useFetchApi={useFetchApi}
              memberList={member.memberList}
              selectedMember={member.selectedMember}
              selectMemberType={bindedSelectMemberType}
            />
          )}
        />
        <Route
          exact
          path={PAGE_PATHS.PRODUCTS}
          render={(): React.ReactElement => (
            <SelectProductsPage
              useFetchApi={useFetchApi}
              productList={productList}
              selectedProductIds={products.selectedProductIds}
              totalPrice={totalPrice}
              updateSelectedProductIds={bindedUpdateSelectedProductIds}
              clearSelectedProductIds={bindedClearSelectedProductIds}
              purchase={purchase}
            />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};
export default App;
