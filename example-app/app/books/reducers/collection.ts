import { CollectionActions } from './../actions/collection';

export interface State {
  loaded: boolean;
  loading: boolean;
  ids: string[];
}

const initialState: State = {
  loaded: false,
  loading: false,
  ids: []
};

export function reducer(state = initialState, action: CollectionActions): State {
  switch (action.type) {
    case '[Collection] Load': {
      return {
        ...state,
        loading: true
      };
    }

    case '[Collection] Load Success': {
      return {
        loaded: true,
        loading: false,
        ids: action.payload.map(book => book.id)
      };
    }

    case '[Collection] Add Book Success':
    case '[Collection] Remove Book Fail': {
      if (state.ids.indexOf(action.payload.id) > -1) {
        return state;
      }

      return {
        ...state,
        ids: [...state.ids, action.payload.id]
      };
    }

    case '[Collection] Add Book Fail':
    case '[Collection] Remove Book Success': {
      return {
        ...state,
        ids: state.ids.filter(id => id !== action.payload.id)
      };
    }

    default: {
      return state;
    }
  }
}

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;
