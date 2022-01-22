import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import { applyMiddleware } from "use-reducer-enhancer";
import thunk from "redux-thunk";
import { reducerFunction } from '../../../reducers/homereducer';
const AboutScreen = () => {
    let initState: any;

    React.useEffect(() => {
        const gs = () => {
            return async (dispatch, getState) => {
                initState = getState();
            };
        };
    }, []);
    // const useReducerWithThunk = applyMiddleware(thunk)(useReducer);
    // const [state, dispatch] = useReducerWithThunk(reducerFunction, initState) as any;
    return (
        <div>
            <pre>{JSON.stringify({ initState }, null, 2)}</pre>
            This is about screen

            <Link to='/'>Home</Link>
        </div>
    );
};

export default AboutScreen;
