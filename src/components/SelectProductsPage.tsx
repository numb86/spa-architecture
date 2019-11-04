import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import {Product} from '../store/products';

interface Props {
  useFetchApi: (hasDataAlready?: boolean) => void;
  productList: Product[];
  selectedProductIds: number[];
  totalPrice: number;
  updateSelectedProductIds: (
    targetProductId: number,
    currentSelectedProductIds: number[]
  ) => void;
  clearSelectedProductIds: () => void;
  purchase: () => void;
}

const SelectProductsPage: React.FC<Props> = ({
  useFetchApi,
  productList,
  selectedProductIds,
  totalPrice,
  updateSelectedProductIds,
  clearSelectedProductIds,
  purchase,
}) => {
  const [isAbleToPurchase, setIsAbleToPurchase] = useState(false);
  const history = useHistory();

  useFetchApi(productList.length > 0);

  useEffect(() => {
    clearSelectedProductIds();
  }, [clearSelectedProductIds]);

  useEffect((): void => {
    setIsAbleToPurchase(totalPrice > 0);
  }, [totalPrice]);

  const requestPurchase = async (): Promise<void> => {
    await purchase();
    alert('購入が完了しました');
    history.push('/member');
  };

  return (
    <>
      <h1>商品選択ページ</h1>

      <p>合計金額： {totalPrice}円</p>

      <div>
        <ul style={{listStyle: 'none'}}>
          {productList.map(
            (p: Product): React.ReactElement => (
              <li key={p.id}>
                <input
                  id={String(p.id)}
                  type="checkbox"
                  checked={selectedProductIds.includes(p.id)}
                  onChange={(): void => {
                    updateSelectedProductIds(p.id, selectedProductIds);
                  }}
                />{' '}
                {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                <label htmlFor={String(p.id)}>
                  <span>{p.label}</span>
                  <span> {p.price}円</span>
                  {p.isPremiumOnly && (
                    <span style={{color: 'blue'}}> プレミアム会員限定!</span>
                  )}
                </label>
              </li>
            )
          )}
        </ul>
        <button type="button" onClick={(): void => history.push('/member')}>
          会員種別選択ページに戻る
        </button>{' '}
        <button
          type="button"
          onClick={requestPurchase}
          disabled={!isAbleToPurchase}
        >
          購入する
        </button>
      </div>
    </>
  );
};
export default SelectProductsPage;
