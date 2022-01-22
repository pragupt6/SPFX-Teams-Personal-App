import React, { useReducer } from 'react';

import { ApprovalReducer } from '../../../reducers/approvalreducer';
import { ConfirmAction } from '../../../actions/approvalactions';
import { applyMiddleware } from "use-reducer-enhancer";
import thunk from "redux-thunk";
import { Formik, Form, Field } from 'formik';
import { FormikChoiceGroup, FormikDatePicker } from 'formik-office-ui-fabric-react';
import moment from 'moment';
import { TextField, PrimaryButton, DefaultButton, IChoiceGroupOption } from 'office-ui-fabric-react';
import * as Yup from 'yup';
import styles from './Teamsapp.module.scss';
import Activity from './Activity';
import * as Constants from '../../../constants/GlobalConstants';
import ApprovalDialog from './ApprovalDialog';
const ApprovalScreen = (props: any) => {
    const [Action, setAction] = React.useState('');
    const { item } = props;
    const ref = React.useRef(null);
    const schema = Yup.object().shape({
        datevalue: Yup.date()
            .max(moment().startOf('day').toDate(), "Future date not allowed"),
        vaccineType: Yup.string()
            .notOneOf(['5555'], "Chose vaccine type"),
        comments: Yup.string()
            .required("Comments are required")
            .nullable()
    });
    const options: IChoiceGroupOption[] = [
        { key: 'full', text: 'Full', iconProps: { iconName: 'FullCircleMask' } },
        { key: 'partial', text: 'Partial', iconProps: { iconName: 'CircleHalfFull' } },
    ];
    const onFormatDate = (date?: Date): string => {
        return !date ? '' : date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() % 100);
    };
    const datePicker = ({ form, field, meta }) => {
        return (
            <FormikDatePicker
                // disabled={true}
                disabled={item.Level === 10 ? true : false}
                textField={form.touched.datevalue && !!form.errors.datevalue ? { errorMessage: form.errors.datevalue } : { errorMessage: '' }}
                formatDate={onFormatDate} field={field} form={form} meta={meta}
                className='w-full'
            ></FormikDatePicker>
        );
    };
    console.log('====================================');
    console.log(props);
    console.log('====================================');
    const initState: object = {
        HideDialog: true,
        ConfirmAction: false,
        StartAction: false,
        ActionCompleted: false,
        History: props.item.History,
        ID: props.item.ID,
        Actors: props.item.Actors,

    };
    const onCloseClick = () => {
        console.log('====================================');
        console.log('this close');
        console.log('====================================');
        props.onCloseClick();
    };
    const closeDialog = () => {
        dispatch({ type: Constants.SHOWAPPROVALDIALOG });
    };
    const handleClose = () => {
        props.handleClose();
    };
    const OnConfirmAction = () => {
        dispatch(ConfirmAction(Action, ref));
    };
    const useReducerWithThunk = applyMiddleware(thunk)(useReducer);
    const [state, dispatch] = useReducerWithThunk(ApprovalReducer, initState) as any;

    React.useEffect(() => {
        // dispatch(LoadData())
    }, [state.Action]);
    const loading = state.loading === undefined ? true : state.loading;
    return (
        <div>
            {

                // !loading && state.ShowForm &&
                <Formik
                    innerRef={ref}
                    validationSchema={schema}
                    onSubmit={(values) => {
                        console.log('Approve', Action);
                        console.log(values);
                        console.log('====================================');
                        dispatch({ type: Constants.SHOWAPPROVALDIALOG });
                        // switch (Action) {
                        //     case 'Approve':
                        //         dispatch({ type: Constants.SHOWAPPROVALDIALOG })
                        //         break;
                        //     case 'Reject':
                        //         dispatch({ type: Constants.SHOWAPPROVALDIALOG })
                        //         break;
                        //     case 'Return':
                        //         dispatch({ type: Constants.SHOWAPPROVALDIALOG })
                        //         break;

                        //     default:
                        //         break;
                        // }

                    }}

                    initialValues={
                        item.Level === 0 ?
                            {
                                datevalue: moment(new Date(), 'DD/MM/YYYY').startOf('day').toDate(),
                                vaccineType: '5555',
                                comments: ''
                            }
                            :
                            {
                                vaccineType: item.VaccinationStatus,
                                datevalue: moment(item.LastDose).startOf('day').toDate(),
                                comments: item.Comments as string
                            }
                    }
                    validateOnMount={false}
                    validateOnChange={true}
                    validateOnBlur={false}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        isValid,
                        errors,
                        validateForm
                    }) => {
                        return (
                            <div className="flex flex-wrap w-full max-w-3xl p-2 border-solid border-gray-400">
                                {/* <pre>{JSON.stringify({ touched, errors }, null, 2)}</pre> */}
                                {/* <pre>{JSON.stringify({ Action }, null, 2)}</pre> */}
                                {/* <pre>{JSON.stringify({ state }, null, 2)}</pre> */}

                                <Form noValidate onSubmit={handleSubmit} className="w-full max-w-3xl">

                                    <div className={`grid md:grid-cols-4 gap-x-16 gap-y-4  ${styles.wrapper}`}>
                                        <div className="flex items-center">
                                            <label className="font-bold mb-1 md:mb-0 mr-2 whitespace-nowrap">Status</label>
                                        </div>
                                        <div className="flex items-center col-span-3">
                                            <label
                                                className="w-full text-gray-500"
                                                placeholder="Input name...."
                                            >
                                                {
                                                    item.Level === 5 ? `Draft`
                                                        :
                                                        item.Level === 10 ? `Pending Approval`
                                                            :
                                                            `New Request`

                                                }
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold mb-1 md:mb-0 mr-2 whitespace-nowrap">Request#</label>
                                        </div>
                                        <div className="flex items-center col-span-3">
                                            <label
                                                className="w-full text-gray-500"
                                                placeholder="Input name...."
                                            >
                                                123-2323-D
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold mb-1 md:mb-0 mr-2 whitespace-nowrap">Name</label>
                                        </div>
                                        <div className="flex items-center col-span-3">
                                            <label
                                                className="w-full text-gray-500"
                                                placeholder="Input name...."
                                            >

                                                {item.Name}

                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold mb-1 md:mb-0 mr-2 whitespace-nowrap">Email</label>
                                        </div>
                                        <div className="flex items-center col-span-3">
                                            <label
                                                className="w-full text-gray-500"
                                                placeholder="Input name...."
                                            >
                                                {item.Email}

                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold mb-1 md:mb-0 mr-2 whitespace-nowrap">Business Phone</label>
                                        </div>
                                        <div className="flex items-center col-span-3">
                                            <label
                                                className="w-full text-gray-500"
                                                placeholder="Input name...."
                                            >
                                                {item.BusinessPhone}

                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold mb-1 md:mb-0 mr-2 whitespace-nowrap">Vaccination Status</label>
                                        </div>
                                        <div className="flex items-center col-span-3 flex-col gap-1">
                                            <Field
                                                name={'vaccineType'}
                                                render={
                                                    fieldProps1 =>
                                                    (
                                                        <FormikChoiceGroup
                                                            disabled={true}
                                                            options={options}
                                                            name={'vaccineType'}
                                                            value={values.vaccineType}
                                                            className='w-full'
                                                            {...fieldProps1} />

                                                    )

                                                }

                                            />
                                            <div className={touched.vaccineType && values.vaccineType === '5555' ? `text-red-700 w-full text-xs` : `hidden`}>{errors.vaccineType}</div>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold mb-1 md:mb-0 mr-2 whitespace-nowrap" aria-required='true' >Last dose taken</label>
                                        </div>
                                        <div className="col-span-3 flex flex-col gap-1 items-center">
                                            <Field
                                                // disabled={true}
                                                // disabled={!loading && state.Level === 10 ? true : false}
                                                name="datevalue"
                                                component={datePicker}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {
                                            !(item.Level === 10 && state.MyRole === 'Requestor') &&
                                            <>
                                                <div className="flex items-center">
                                                    <label className="font-bold mb-1 md:mb-0 mr-2 whitespace-nowrap" aria-required='true' >Comments</label>
                                                </div>
                                                <div className="col-span-3 flex flex-col gap-1 items-center">
                                                    <TextField
                                                        disabled={false}
                                                        className='w-full'
                                                        multiline={true}
                                                        errorMessage={touched.comments && !!errors.comments ? errors.comments : ''}
                                                        // errorMessage = {touched.comments && !!errors.comments ?  errors.comments : '' }
                                                        // textField={touched.comments && !!errors.comments ? { errorMessage: errors.comments } : { errorMessage: '' }}
                                                        // disabled={true}
                                                        // disabled={!loading && state.Level === 10 ? true : false}
                                                        name="comments"
                                                        value={values.comments}
                                                        // component={datePicker}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </>
                                        }
                                        <div className="flex items-center"></div>
                                        <div className="flex items-center col-span-3 gap-2">
                                            {
                                                item.Level === 10 &&
                                                <>
                                                    <PrimaryButton onClick={(e) => { setAction('Approve'); handleSubmit(); }} >Approve</PrimaryButton>
                                                    <PrimaryButton onClick={(e) => { setAction('Reject'); handleSubmit(); }} >Reject</PrimaryButton>
                                                    <PrimaryButton onClick={(e) => { setAction('Return'); handleSubmit(); }} >Return</PrimaryButton>

                                                </>

                                            }
                                            {/* <DefaultButton type='submit' onClick={onCloseClick}>Close</DefaultButton> */}
                                            <DefaultButton type='submit' onClick={() => onCloseClick()}>Close</DefaultButton>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        );
                    }}</Formik>
            }
            <ApprovalDialog ActionCompleted={state.ActionCompleted} StartAction={state.StartAction} HideDialog={state.HideDialog} Action={Action} ConfirmAction={state.ConfirmAction} closeDialog={closeDialog} OnConfirmAction={OnConfirmAction} onCloseClick={handleClose} />
            <div className="w-full max-w-3xl mb-10">
                {
                    <Activity history={item.History} />
                }
            </div>
        </div>
    );
};

export default ApprovalScreen;
