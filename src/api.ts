/* eslint-disable @typescript-eslint/camelcase */
export const fetchMemberTypesApi = (): Promise<{id: number; namae: string}[]> =>
  Promise.resolve([
    {id: 1, namae: 'プレミアム会員'},
    {id: 2, namae: '通常会員'},
  ]);

export const fetchProductsApi = (): Promise<
  {
    id: number;
    namae: string;
    price: number;
    merchant_id: number;
    premium_only: boolean;
  }[]
> =>
  Promise.resolve([
    {
      id: 1,
      namae: '素敵な商品',
      price: 1000,
      merchant_id: 1,
      premium_only: false,
    },
    {
      id: 2,
      namae: 'いい感じの商品',
      price: 800,
      merchant_id: 1,
      premium_only: true,
    },
    {
      id: 3,
      namae: 'ちょうどよい商品',
      price: 700,
      merchant_id: 2,
      premium_only: true,
    },
    {
      id: 4,
      namae: '妥当な商品',
      price: 300,
      merchant_id: 2,
      premium_only: false,
    },
    {
      id: 5,
      namae: '間違いのない商品',
      price: 500,
      merchant_id: 2,
      premium_only: false,
    },
  ]);

export const validatePremiumCodeApi: (code: string) => Promise<void> = code => {
  if (code === '1234') {
    return Promise.resolve();
  }
  if (code === '5678') {
    return Promise.reject(
      new Error(JSON.stringify({code: '001', message: 'expired'}))
    );
  }
  return Promise.reject(
    new Error(JSON.stringify({code: '002', message: 'invalid'}))
  );
};

export const purchaseApi: (
  productIds: number[],
  isPremiumMember: boolean
) => Promise<{product_id_list: number[]; premium_member: boolean}> = (
  productIds,
  isPremiumMember
) => {
  const requestBody = {
    product_id_list: productIds,
    premium_member: isPremiumMember,
  };
  return Promise.resolve(requestBody);
};
