import { applyMiddleware } from "use-reducer-enhancer";
import thunk from "redux-thunk";
import React, { useReducer } from 'react';
import { sp } from '@pnp/pnpjs';

import { reducerFunction } from '../../../reducers/homereducer';

import { incrementSlowly, decrementSlowly } from '../../../actions/homeactions';

const DraftCard = () => {
    const useReducerWithThunk = applyMiddleware(thunk)(useReducer);
    const INCREMENT = "INCREMENT";
    const DECREMENT = "DECREMENT";
    const LOADING = "LOADING";
    const initState: any = { count: 0 };

    const [state, dispatch] = useReducerWithThunk(reducerFunction, initState) as any;

    // state = JSON.parse({    })

    return (
        <div>
            <pre>{JSON.stringify({ state }, null, 2)}</pre>
            {state.count}
            <div>Count: {state.count}</div>
            <button onClick={() => dispatch(incrementSlowly())}>+</button>
            <button onClick={() => dispatch(decrementSlowly())}>-</button>
            {state.loading && <div>Hold on...</div>}
        </div>
    );
};

export default DraftCard;
