import {Dispatch, Action} from 'redux';
import {ThunkAction} from 'redux-thunk';

import {fetchMemberTypesApi} from '../api';

export interface MemberType {
  id: number;
  label: string;
}

export interface MemberState {
  selectedMember: MemberType | null;
  memberList: MemberType[];
}

enum ActionTypes {
  SELECT_MEMBER_TYPE = 'SELECT_MEMBER_TYPE',
  FETCH_MEMBER_TYPES = 'FETCH_MEMBER_TYPES',
}

interface SelectMemberTypeAction extends Action {
  type: ActionTypes.SELECT_MEMBER_TYPE;
  payload: {
    memberType: MemberType;
  };
}

interface FetchMemberTypesAction extends Action {
  type: ActionTypes.FETCH_MEMBER_TYPES;
  payload: {
    memberTypes: MemberType[];
  };
}

type MemberActions = SelectMemberTypeAction | FetchMemberTypesAction;

type SelectMemberType = (memberType: MemberType) => SelectMemberTypeAction;

const initialState: MemberState = {
  selectedMember: null,
  memberList: [],
};

export const selectMemberType: SelectMemberType = memberType => ({
  type: ActionTypes.SELECT_MEMBER_TYPE,
  payload: {
    memberType,
  },
});

export const fetchMemberTypes = (): ThunkAction<
  void,
  MemberState,
  undefined,
  FetchMemberTypesAction
> => {
  return async (
    dispatch: Dispatch<FetchMemberTypesAction>
  ): Promise<FetchMemberTypesAction> => {
    try {
      const res = await fetchMemberTypesApi();
      return dispatch({
        type: ActionTypes.FETCH_MEMBER_TYPES,
        payload: {
          memberTypes: res.map(
            (m): MemberType => ({
              id: m.id,
              label: m.namae,
            })
          ),
        },
      });
    } catch (e) {
      return dispatch({
        type: ActionTypes.FETCH_MEMBER_TYPES,
        payload: {
          memberTypes: [],
        },
      });
    }
  };
};

export const member = (
  state = initialState,
  action: MemberActions
): MemberState => {
  const {type} = action;

  switch (type) {
    case ActionTypes.SELECT_MEMBER_TYPE: {
      const {payload} = action as SelectMemberTypeAction;
      return {
        ...state,
        selectedMember: payload.memberType,
      };
    }

    case ActionTypes.FETCH_MEMBER_TYPES: {
      const {payload} = action as FetchMemberTypesAction;
      return {
        ...state,
        memberList: payload.memberTypes,
      };
    }

    default:
      return state;
  }
};

const PREMIUM_MEMBER_ID = 1;

export const isPremiumMember: (
  memberType: MemberType
) => boolean = memberType => memberType.id === PREMIUM_MEMBER_ID;
