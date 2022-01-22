import React, { useContext, useReducer } from 'react';
import { applyMiddleware } from "use-reducer-enhancer";
import thunk from "redux-thunk";
import { Link } from 'react-router-dom';
import { reducerFunction } from '../../../reducers/homereducer';
import { INITIAL, LOADFORM } from '../../../constants/GlobalConstants';
import {
    getIntialValues,
    getPagedItems,
    filterItems,
    LoadForm
} from '../../../actions/homeactions';
import Skeleton from 'react-loading-skeleton';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import _ from 'lodash';
import styles from './Teamsapp.module.scss';
import { Pagination } from '@pnp/spfx-controls-react/lib/pagination';
import FormScreen from './FormScreen';
import AppContext from './AppContext';

const HomeScreen = ({ props }: any) => {
    // let { user, setLoggedUser } = useContext(AuthContext)
    let { color } = useContext(AppContext)
    //const user = useContext(ThemeContext);
    const initState: object = {
        pageSize: 12,
        count: 0,
        data: [],
        SiteURL: {},
        Me: {},
        Manager: {},
        users: [],
        loadform: false,
    };
    const useReducerWithThunk = applyMiddleware(thunk)(useReducer);
    const [state, dispatch] = useReducerWithThunk(reducerFunction, initState) as any;
    React.useEffect(() => {
        dispatch(getIntialValues());
        console.log('============color========================');
        console.log(color);
        console.log('====================================');
    }, []);
    const loading = state.loading === undefined ? true : state.loading;
    let results = state.users;
    if (!loading) {
        results = results.slice(0, state.pageSize);
    }
    let title: string = '';
    let subTitle: string = '';
    let siteTabTitle: string = '';
    if (props.context.sdks.microsoftTeams) {
        // We have teams context for the web part
        title = "Welcome to Teams App!";
        subTitle = "Building custom enterprise tabs for your business.";
        siteTabTitle = "We are in the context of following Team: " + props.context.sdks.microsoftTeams.context.teamName;
    }
    else {
        // We are rendered in normal SharePoint context
        title = "Welcome to SharePoint!";
        subTitle = "Customize SharePoint experiences using Web Parts.";
        siteTabTitle = "We are in the context of following site: " + props.context.pageContext.web.title;
    }
    const loadForm = () => {
        dispatch(LoadForm());
    };
    return (
        <div>
            {/* <pre>{JSON.stringify({ state }, null, 2)}</pre> */}
            <div className='container mx-auto'>
                <div className="flex flex-col gap-4 items-center justify-items-center" style={{ fontFamily: 'Droid Sans' }}>
                    <div className='bg-blue-300 h-5 justify-center p-2 rounded-md text-center w-full lg:w-3/5'>{title}</div>
                    {/* <Link to='/about'>About</Link> */}
                    {!state.loadform && <div className='border-2 flex flex-col md:flex-row rounded shadow-md w-full mb-10 lg:w-3/5'>
                        <div className='"md:flex-shrink-0' >
                            {loading ? <Skeleton height={200} width={250} /> : <img alt='12' className='h-48 w-full object-cover md:h-full md:w-64 rounded' src={`${state.SiteURL.Url}/SiteAssets/corona.jpeg`}></img>}
                        </div>
                        <div className='p-1 flex flex-col flex-1 flex-shrink-0 items-center gap-3 w-full'>
                            <div className='font-bold sm:text-xl md:text-xl'>
                                We Appreciate your Gesture!
                            </div>
                            <div className='text-sm m-2'>
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio aspernatur, accusantium adipisci, repellendus accusantium adipisci, repellendus accusantium adipisci, repellendus
                            </div>
                            <div className="mb-5">
                                <Link onClick={() => dispatch({ type: LOADFORM })} className='bg-green-400 mb-5 no-underline p-2 px-12 rounded-xl shadow-md text-xl' to='/'>Explore</Link>
                                {/* <Link onClick={loadForm} className='bg-green-400 mb-5 no-underline p-2 px-12 rounded-xl shadow-md text-xl' to='/'>Explore</Link> */}
                            </div>
                        </div>
                    </div>}
                    {
                        state.loadform && <FormScreen loadForm={loadForm}></FormScreen>
                    }
                </div>
                <div className='' style={{ fontFamily: 'Droid Sans' }}>
                    <div className='flex flex-row mb-10'>
                        <div className='hidden md:w-1/3 md:block'>
                            <hr />
                        </div>
                        <div className='mx-auto'>
                            Look at some of your colleagues
                        </div>
                        <div className='hidden md:w-1/3 md:block'>
                            <hr />
                        </div>
                    </div>

                    <div className='mt-5 mb-5 flex w-full'>
                        <TextField
                            className='w-full lg:w-1/3 ml-auto sm:ml-0 md:ml-0 lg:ml-auto'
                            placeholder='Search with first name...'
                            onChange={(e, value) => {
                                let nUsers = state.data.results;
                                let nUsers2 = value === '' ? state.data.results : _.filter(nUsers, p => _.includes(p.name.first.toLowerCase(), value.toLowerCase()));
                                dispatch(filterItems(nUsers2));
                            }
                            }
                        />
                    </div>
                    <div className={`grid gap-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ${styles.wrapper}`}>
                        {state.loading && <>
                            <Skeleton className='flex flex-row h-24 items-center justify-center rounded shadow-md'></Skeleton>
                            <Skeleton className='flex flex-row h-24 items-center justify-center rounded shadow-md'></Skeleton>
                            <Skeleton className='flex flex-row h-24 items-center justify-center rounded shadow-md'></Skeleton>
                            <Skeleton className='flex flex-row h-24 items-center justify-center rounded shadow-md'></Skeleton>
                            <Skeleton className='flex flex-row h-24 items-center justify-center rounded shadow-md'></Skeleton>
                            <Skeleton className='flex flex-row h-24 items-center justify-center rounded shadow-md'></Skeleton>
                        </>
                        }
                        {!loading &&
                            results.map((user) => {
                                return (
                                    <div className='flex flex-row h-24 items-center justify-center rounded shadow-md'>
                                        <div className='w-1/3'>
                                            <img alt='12' src={user.picture.large} className='object-cover ml-2 w-20 h-20 rounded-full border-2 border-solid border-blue-800'></img>
                                        </div>
                                        <div className='w-2/3 flex flex-col flex-1 gap-3'>
                                            <div className='text-lg font-semibold'>
                                                {`${user.name.title} ${user.name.first} ${user.name.last}`}
                                            </div>
                                            <div className='text-sm'>
                                                {`${user.name.title} ${user.name.first} ${user.name.last}`}
                                            </div>
                                        </div>
                                    </div>
                                );

                            })

                        }
                    </div>

                </div>
                <div>
                    {!loading &&
                        <Pagination
                            currentPage={1}
                            totalPages={Math.ceil(state.data.results.length / state.pageSize)}
                            onChange={(page) => dispatch(getPagedItems(page))}
                            limiter={1} // Optional - default value 3
                            hideFirstPageJump // Optional
                            hideLastPageJump // Optional
                        // limiterIcon={"Emoji12"} // Optional
                        />}
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
