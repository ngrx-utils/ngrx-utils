import { LayoutActions } from '../actions/layout';

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false
};

export function reducer(state: State = initialState, action: LayoutActions): State {
  switch (action.type) {
    case '[Layout] Close Sidenav':
      return {
        showSidenav: false
      };

    case '[Layout] Open Sidenav':
      return {
        showSidenav: true
      };

    default:
      return state;
  }
}

export const getShowSidenav = (state: State) => state.showSidenav;
