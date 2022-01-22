import { INCREMENT, DECREMENT, LOADING, INITIAL, PAGED, FILTER, LOADFORM } from '../constants/GlobalConstants';
export const reducerFunction = (state, action) => {
    switch (action.type) {
        case LOADFORM: {
            return {
                ...state,
                loadform: !state.loadform,
                loading: false
            } as Object;
        }
        case PAGED: {
            return {
                ...state,
                users: action.payload,
                loading: false
            } as Object;
        }
        case FILTER: {
            return {
                ...state,
                users: action.payload,
                loading: false
            } as Object;
        }
        case INITIAL: {
            return {
                ...state,
                Me: action.payload.Me,
                Manager: action.payload.Manager,
                data: action.payload.data,
                users: action.payload.data.results,
                SiteURL: action.payload.SiteURL,
                loading: false
            } as Object;
        }
        case INCREMENT: {
            return {
                ...state,
                count: state.count + 1,
                loading: false
            };
        }
        case DECREMENT: {
            return {
                ...state,
                count: state.count - 1,
                loading: false
            };
        }
        case LOADING: {
            return {
                ...state,
                loading: true
            };
        }
        default:
    }
};