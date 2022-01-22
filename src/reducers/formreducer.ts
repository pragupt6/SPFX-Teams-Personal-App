import {
    INCREMENT,
    DECREMENT,
    LOADING,
    INITIAL,
    PAGED,
    FILTER,
    LOADFORM,
    DRAFT,
    SAVEDRAFT,
    STARTSAVE,
    CLOSEDIALOG,
    SAVING,
    SAVED,
    STARTSUBMIT,
    SUBMITTING,
    SUBMITTED,
    PENDINGITEMS,
    CLOSEAPPROVE

} from '../constants/GlobalConstants';
export const FormReducer = (state, action) => {
    switch (action.type) {
        case PENDINGITEMS: {
            return {
                ...state,
                ShowPendingItems: true,
                ShowForm: false,
            } as Object;
        }
        case SAVED: {
            return {
                ...state,
                Saved: true,
                Saving: false
            } as Object;
        }
        case SAVING: {
            return {
                ...state,
                Saving: true
            } as Object;
        }
        case SUBMITTING: {
            return {
                ...state,
                Submitting: true
            } as Object;
        }
        case CLOSEDIALOG: {
            return {
                ...state,
                StartSave: false,
                Saving: false,
                Saved: false,
                StartSubmit: false,
                Submitting: false,
                Submitted: false

            } as Object;
        }
        case STARTSAVE: {
            return {
                ...state,
                StartSave: true
            } as Object;
        }
        case STARTSUBMIT: {
            return {
                ...state,
                StartSubmit: true
            } as Object;
        }
        case SAVEDRAFT: {
            return {
                ...state,
                Action: state.Action + 1,
                Saved: true,
                Saving: false,
                loading: false
            } as Object;
        }
        case CLOSEAPPROVE: {
            return {
                ...state,
                Action: state.Action + 1,
                // Saved: true,
                // Saving: false,
                // loading: false
            } as Object;
        }
        case SUBMITTED: {
            return {
                ...state,
                Action: state.Action + 1,
                Submitted: true,
                Submitting: false,
                loading: false
            } as Object;
        }
        case DRAFT: {
            return {
                ...state,
                ShowForm: true,
                loading: false,
                ShowPendingItems: false,
            } as Object;
        }
        case INITIAL: {
            return {
                ...state,
                PendingItems: action.payload.itemCount,
                Me: action.payload.Me,
                Manager: action.payload.MyManager,
                Draft: action.payload.draft.length > 0 ? action.payload.draft[0] : {},
                ShowForm: action.payload.draft.length > 0 ? false : true,
                MyRole: action.payload.MyRole,
                Level: action.payload.Level,
                loading: false
            } as Object;
        }
        case LOADING: {
            return {
                ...state,
                loading: true
            };
        }
        default: {
            return { ...state };
        }
    }
};