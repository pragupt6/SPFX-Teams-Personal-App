import * as Constants from '../constants/GlobalConstants';
export const listReducer = (state, action) => {
    switch (action.type) {
        case Constants.LOADING: {
            return {
                ...state,
                loading: true
            };
        }
        case Constants.SHOWONLYLIST: {
            return {
                ...state,
                ShowList: false,
            };
        }
        case Constants.SHOWLIST: {
            return {
                ...state,
                ShowList: false,
                Item: action.data
            };
        }
        case Constants.BACKSHOWLIST: {
            return {
                ...state,
                ShowList: true,
                Item: action.data
            };
        }
        case Constants.LISTPENDINGITEMS: {
            return {
                ...state,
                Me: action.payload.Me,
                PendingItems: action.payload.pendingItems,
                loading: false
            };
        }
        case Constants.SORTDESCENDING: {
            return {
                ...state,
                SortDescending: !state.SortDescending,
            };
        }
        case Constants.SORTDATEDESCENDING: {
            return {
                ...state,
                SortDateDescending: !state.SortDateDescending,
            };
        }
        default: {
            return { ...state };
        }
    }
};