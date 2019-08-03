// eslint-disable-next-line import/no-extraneous-dependencies
import {Page} from 'puppeteer';
import assert from 'assert';

declare const page: Page;
declare const host: string;
declare const port: number;

describe('App', () => {
  beforeAll(async () => {
    await jest.setTimeout(10000);
    await page.goto(`http://${host}:${port}/member`);
  });

  it('会員種別選択ページ', async () => {
    // 描画が終わるまで待機する
    await page.waitForXPath('//input');

    let h1Text = await page.$eval('h1', element => element.textContent);
    assert.deepStrictEqual(h1Text, '会員種別選択ページ');

    let buttonDisabled = await page.$eval('button', element =>
      element.getAttribute('disabled')
    );
    assert.deepStrictEqual(buttonDisabled, '');

    // 最初のラジオボタンが「プレミアム会員」、次のラジオボタンが「通常会員」に対応していることを確認する
    const radioButtonLabels = await page.$$eval('label', elements => {
      const labels = Array.from(elements);
      return labels.map(input => input.textContent);
    });
    assert.deepStrictEqual(radioButtonLabels[0], 'プレミアム会員');
    assert.deepStrictEqual(radioButtonLabels[1], '通常会員');

    const labels = await page.$$('label');
    const premiumMemberLabel = labels[0];
    const normalMemberLabel = labels[1];

    // 「通常会員」をチェックするとボタンを押下できる
    normalMemberLabel.click();
    await page.waitFor(100);
    buttonDisabled = await page.$eval('button', element =>
      element.getAttribute('disabled')
    );
    assert.deepStrictEqual(buttonDisabled, null);

    // 「プレミアム会員」をチェックするとボタンを押下できない
    premiumMemberLabel.click();
    await page.waitFor(100);
    buttonDisabled = await page.$eval('button', element =>
      element.getAttribute('disabled')
    );
    assert.deepStrictEqual(buttonDisabled, '');

    // 「認証コード」を入力するとボタンを押下できる
    await page.type('input[type="text"]', '1234');
    await page.waitFor(100);
    buttonDisabled = await page.$eval('button', element =>
      element.getAttribute('disabled')
    );
    assert.deepStrictEqual(buttonDisabled, null);

    // ボタンを押下すると「商品選択ページ」に遷移する
    page.click('button');
    await page.waitForNavigation({
      timeout: 3000,
      waitUntil: 'domcontentloaded',
    });
    h1Text = await page.$eval('h1', element => element.textContent);
    assert.deepStrictEqual(h1Text, '商品選択ページ');
  });
});
