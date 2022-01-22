// import { mergeStyleSets } from '@uifabric/styling';
import React, { useReducer } from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Link, TooltipHost } from 'office-ui-fabric-react';
import { applyMiddleware } from "use-reducer-enhancer";
import thunk from "redux-thunk";
import * as Constants from '../../../constants/GlobalConstants';
import _ from "lodash";
export interface IDocument {
    key: string;
    ename: JSX.Element;
    value: string;
    date: string;
    item: object;
}
export interface SampleI {
    getData(): string;
}
import { listReducer } from '../../../reducers/listreducer';
import { loadListItems, sortItems, sortItemsDate } from '../../../actions/listactions';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import { ObjectLocale } from 'yup/lib/locale';
import ApprovalScreen from './ApprovalScreen';
const ListItems = (props: any) => {
    const initState: object = {
        Action: 0,
        PendingItems: {},
        Me: {},
        SortDescending: true,
        SortDateDescending: true,
        ShowList: true,
        Item: {},

    };
    const useReducerWithThunk = applyMiddleware(thunk)(useReducer);
    const [state, dispatch] = useReducerWithThunk(listReducer, initState) as any;
    React.useEffect(() => {
        dispatch(loadListItems());
    }, [state.Action]);
    const loading = state.loading === undefined ? true : state.loading;
    const _onColumnClick = (ev, col: IColumn) => {
        dispatch(sortItems());
    };
    const _onColumnClickDate = (ev, col: IColumn) => {
        dispatch(sortItemsDate());
    };
    const onCloseClick = () => {
        console.log('====================================');
        console.log('props close');
        console.log('====================================');
        dispatch({ type: Constants.BACKSHOWLIST });
    };

    const handleClose = () => {
        //dispatch({ type: Constants.SHOWONLYLIST })
        props.handleClose();
    };
    const columns: IColumn[] = [
        {
            key: 'column1',
            name: 'Employee',
            minWidth: 210,
            maxWidth: 350,
            isRowHeader: true,
            isResizable: false,
            isSorted: true,
            isSortedDescending: state.SortDescending,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            fieldName: 'ename',
            onColumnClick: _onColumnClick,
            onRender: (data) => {
                return <Link onClick={() => { dispatch({ type: Constants.SHOWLIST, data: data.item }); }}>{data.ename}</Link>;
            }
        },
        {
            key: 'column2',
            name: 'Vaccine Type',
            isRowHeader: true,
            // className: classNames.fileIconCell,
            // iconName: 'Page',
            // isIconOnly: true,
            fieldName: 'value',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'column3',
            name: 'Date',
            isRowHeader: true,
            // className: classNames.fileIconCell,
            // iconName: 'Page',
            // isIconOnly: true,
            isSorted: true,
            isSortedDescending: state.SortDateDescending,
            fieldName: 'date',
            minWidth: 100,
            maxWidth: 100,
            onColumnClick: _onColumnClickDate,
        }
    ];

    const items: IDocument[] = [];
    !loading && state.PendingItems.map(item => {
        items.push(
            {
                key: item.ID,
                ename: item.Name,
                value: item.VaccinationStatus,
                date: moment(item.LastDose).format('DD/MM/YYYY'),
                item: item,

            }
        );
    });
    return (
        <div>
            {
                loading && state.ShowList &&
                <div className="flex flex-col justify-items-center items-center gap-y-5">
                    <Skeleton width={300} />
                    <Skeleton width={300} />
                    <Skeleton width={300} />
                </div>
            }
            {!loading && state.ShowList && !_.isEmpty(state.PendingItems) &&
                <DetailsList
                    items={items}
                    compact={false}
                    columns={columns}
                    selectionMode={SelectionMode.none}
                    // getKey={this._getKey}
                    setKey="none"
                    layoutMode={DetailsListLayoutMode.justified}
                    isHeaderVisible={true}
                // onItemInvoked={_onItemInvoked}
                />
            }
            {
                !loading && !state.ShowList &&
                <ApprovalScreen item={state.Item} onCloseClick={onCloseClick} handleClose={handleClose} />
            }
        </div>
    );
};

export default ListItems;
