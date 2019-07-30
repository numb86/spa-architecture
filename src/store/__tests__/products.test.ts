import assert from 'assert';

import {products, ProductsState} from '../products';

describe('products', () => {
  describe('reducer', () => {
    const product1 = {
      id: 1,
      label: 'プロダクト1',
      price: 100,
      isPremiumOnly: false,
    };
    const product2 = {
      id: 2,
      label: 'プロダクト2',
      price: 130,
      isPremiumOnly: true,
    };

    let state: ProductsState;
    beforeEach(() => {
      state = {
        productList: [product1],
        selectedProductIds: [],
      };
    });

    describe('UPDATE_SELECTED_PRODUCT_IDS', () => {
      it('state.selectedProductIds を payload.selectedProductIds に更新する', () => {
        assert.deepStrictEqual(state.selectedProductIds.length, 0);

        const action = {
          type: 'UPDATE_SELECTED_PRODUCT_IDS',
          payload: {
            selectedProductIds: [9],
          },
        } as any;
        const result = products(state, action);

        assert.deepStrictEqual(result.selectedProductIds.length, 1);
        assert.deepStrictEqual(result.selectedProductIds[0], 9);
      });
    });

    describe('CLEAR_SELECTED_PRODUCT_IDS', () => {
      it('state.selectedProductIds を空の配列にする', () => {
        state.selectedProductIds = [1];
        assert.deepStrictEqual(state.selectedProductIds.length, 1);

        const result = products(state, {
          type: 'CLEAR_SELECTED_PRODUCT_IDS',
        } as any);

        assert.deepStrictEqual(result.selectedProductIds.length, 0);
      });
    });

    describe('FETCH_PRODUCT_LIST', () => {
      it('state.productList を payload.productList に更新にする', () => {
        const action = {
          type: 'FETCH_PRODUCT_LIST',
          payload: {
            productList: [product2],
          },
        } as any;

        const result = products(state, action);

        assert.deepStrictEqual(result.productList.length, 1);
        assert.deepStrictEqual(result.productList[0].id, product2.id);
        assert.deepStrictEqual(result.productList[0].label, product2.label);
      });
    });

    it('該当する Action がない場合は state をそのまま返す', () => {
      const action = {type: 'foo'} as any;
      const result = products(state, action);
      assert.deepStrictEqual(result, state);
    });
  });
});
