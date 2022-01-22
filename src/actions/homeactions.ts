import { sp } from '@pnp/pnpjs';
import { graph } from "@pnp/graph";
import { INITIAL, PAGED, FILTER, LOADFORM } from '../constants/GlobalConstants';

const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const LOADING = "LOADING";

export const LoadForm = () => {
    return async (dispatch, getState) => {
        let SiteURL; let response; let data; let Me; let MyManager;
        const state = getState();
        if (state.loading) return;
        dispatch({ type: LOADFORM });
    };
};
export const getIntialValues = () => {
    return async (dispatch, getState) => {
        let SiteURL; let response; let data; let Me; let MyManager;
        const state = getState();
        if (state.loading) return;
        dispatch({ type: LOADING });
        let promise = await Promise.all([
            SiteURL = await sp.web.select("Url")(),
            response = await fetch('https://randomuser.me/api/?results=100'),
            data = await response.json(),
            Me = await graph.me(),
            MyManager = await graph.me.manager.get(),
        ]);
        dispatch({ type: INITIAL, payload: { SiteURL, data, Me, MyManager } });
    };
};
export const getPagedItems = (page) => {
    return async (dispatch, getState) => {
        const state = getState();
        if (state.loading) return;
        const data = page === 1 ? state.data.results.slice(page - 1, state.pageSize) : state.data.results.slice(state.pageSize * (page - 1), state.pageSize * page);
        dispatch({ type: PAGED, payload: data });

    };
};
export const filterItems = (user) => {
    return async (dispatch, getState) => {
        const state = getState();
        if (state.loading) return;
        const data = user.slice(0, state.pageSize);
        dispatch({ type: FILTER, payload: data });
    };
};


export const incrementSlowly = () => {
    return async (dispatch, getState) => {
        const state = getState();
        if (state.loading) return;

        dispatch({ type: LOADING });
        await sp.web.lists.getByTitle("VaccinationDetails").items.getById(62).get();
        setTimeout(() => {
            dispatch({ type: INCREMENT });
        }, 300);
    };
};

export const decrementSlowly = () => {
    return (dispatch, getState) => {
        const state = getState();
        if (state.loading) return;
        dispatch({ type: LOADING });
        setTimeout(() => {
            dispatch({ type: DECREMENT });
        }, 300);
    };
};