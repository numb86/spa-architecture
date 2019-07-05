import React, {useState, useEffect} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {isPremiumMember, MemberType} from '../store/member';
import {validatePremiumCodeApi} from '../api';

interface Props extends RouteComponentProps<{}> {
  useFetchApi: (hasDataAlready?: boolean) => void;
  memberList: MemberType[];
  selectedMember: MemberType | null;
  selectMemberType: (memberType: MemberType) => void;
}

const EXPIRED_ERROR_CODE = '001';

const SelectMemberTypePage: React.FC<Props> = ({
  useFetchApi,
  memberList,
  selectedMember,
  selectMemberType,
  history,
}) => {
  const [premiumCode, setPremiumCode] = useState('');
  const [isAbleToPageAdvance, setIsAbleToPageAdvance] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useFetchApi(memberList.length > 0);

  useEffect((): void => {
    const isFilledRequiredItems = (): boolean => {
      if (selectedMember === null) return false;
      if (!isPremiumMember(selectedMember)) return true;
      return premiumCode.trim() !== '';
    };

    setIsAbleToPageAdvance(isFilledRequiredItems);
  }, [selectedMember, premiumCode]);

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLButtonElement>
  ): Promise<void> => {
    if (event) event.preventDefault();
    if (!isAbleToPageAdvance) return;

    setErrorMessage('');

    if (selectedMember && isPremiumMember(selectedMember)) {
      try {
        await validatePremiumCodeApi(premiumCode);
        history.push('/products');
      } catch (e) {
        const errorCode = JSON.parse(e.message).code;
        setErrorMessage(
          errorCode === EXPIRED_ERROR_CODE
            ? 'このコードは期限切れです。'
            : '無効なコードです。'
        );
      }
    } else {
      history.push('/products');
    }
  };

  return (
    <>
      <h1>会員種別選択ページ</h1>
      <form onSubmit={onSubmit}>
        <div>
          {memberList.map(
            (m: MemberType): React.ReactElement => (
              <div key={m.id}>
                <input
                  id={String(m.id)}
                  type="radio"
                  checked={!!selectedMember && selectedMember.id === m.id}
                  onChange={(): void => {
                    selectMemberType(m);
                  }}
                />
                {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                <label htmlFor={String(m.id)}>
                  <span>{m.label}</span>
                </label>
                {isPremiumMember(m) && (
                  <p>
                    {errorMessage.length > 0 && (
                      <>
                        <span style={{color: 'red'}}>{errorMessage}</span>
                        <br />
                      </>
                    )}
                    <input
                      style={{width: '170px'}}
                      type="text"
                      value={premiumCode}
                      onChange={(
                        e: React.FormEvent<HTMLInputElement>
                      ): void => {
                        setPremiumCode(e.currentTarget.value);
                      }}
                      placeholder="認証コードを入力してください"
                    />
                  </p>
                )}
              </div>
            )
          )}
        </div>
        <div>
          <p>
            <button
              disabled={!isAbleToPageAdvance}
              type="submit"
              onClick={(
                event: React.FormEvent<HTMLButtonElement>
              ): Promise<void> => onSubmit(event)}
            >
              商品選択ページへ
            </button>
          </p>
        </div>
      </form>
    </>
  );
};
export default withRouter(SelectMemberTypePage);
