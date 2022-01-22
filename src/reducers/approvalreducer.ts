import * as Constants from '../constants/GlobalConstants';
export const ApprovalReducer = (state, action) => {
    switch (action.type) {
        case Constants.LOADING: {
            return {
                ...state,
                loading: true
            };
        }
        case Constants.STARTAPPROVALACTION: {
            return {
                ...state,
                StartAction: true,
                ConfirmAction: false,

            };
        }
        case Constants.COMPLETEAPPROVALACTION: {
            return {
                ...state,
                StartAction: false,
                ConfirmAction: false,
                ActionCompleted: true,

            };
        }
        case Constants.SHOWAPPROVALDIALOG: {
            return {
                ...state,
                HideDialog: !state.HideDialog,
                ConfirmAction: true,
                StartAction: false,
                ActionCompleted: false,

            };
        }
        default: {
            return { ...state };
        }
    }
};