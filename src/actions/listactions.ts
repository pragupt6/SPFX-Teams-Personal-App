import { sp } from '@pnp/pnpjs';
import { graph } from "@pnp/graph";
import * as Constant from '../constants/GlobalConstants';
import moment from 'moment';
import _ from 'lodash';

export const loadListItems = () => {
    return async (dispatch, getState) => {
        const state = getState();
        let Me; let pendingItems;
        if (state.loading) return;
        dispatch({ type: Constant.LOADING });
        Me = await graph.me(),
            pendingItems = await sp.web.lists.getByTitle("VaccinationDetails").items.filter(`CurrentActor eq '${Me.mail}' and Level eq 10`).get();
        dispatch({ type: Constant.LISTPENDINGITEMS, payload: { Me, pendingItems } });
    };
};
export const sortItems = () => {
    return async (dispatch, getState) => {
        const state = getState();
        let Me; let pendingItems;
        if (state.loading) return;
        state.PendingItems = state.SortDescending ? _.orderBy(state.PendingItems, ['Name'], ['asc']) : _.orderBy(state.PendingItems, ['Name'], ['desc']); // Use Lodash to sort array by 'name'
        dispatch({ type: Constant.SORTDESCENDING });
    };
};
export const sortItemsDate = () => {
    return async (dispatch, getState) => {
        const state = getState();
        let Me; let pendingItems;
        if (state.loading) return;
        state.PendingItems = !state.SortDateDescending ? _.sortBy(state.PendingItems, function (item) {
            return moment(item.LastDose);
        }).reverse()
            :
            _.sortBy(state.PendingItems, function (item) {
                return moment(item.LastDose);
            });
        dispatch({ type: Constant.SORTDATEDESCENDING });
    };
};