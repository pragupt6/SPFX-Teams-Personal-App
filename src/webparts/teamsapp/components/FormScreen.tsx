import React, { useReducer } from 'react';
import { applyMiddleware } from "use-reducer-enhancer";
import thunk from "redux-thunk";
import { Link } from 'react-router-dom';
import { TextField, DefaultButton, PrimaryButton, DatePicker, IDatePicker } from 'office-ui-fabric-react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import styles from './Teamsapp.module.scss';
import { Formik, Form, Field } from 'formik';
import { FormikDatePicker, mapFieldToDatePicker, FormikChoiceGroup } from 'formik-office-ui-fabric-react';
import * as Yup from 'yup';
import moment from 'moment';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { sp } from '@pnp/pnpjs';
import Activity from './Activity';
import { FormReducer } from '../../../reducers/formreducer';
import { LoadData, SaveData, SubmitData } from '../../../actions/formactions';
import Skeleton from 'react-loading-skeleton';
import { CLOSEDIALOG, DRAFT, PENDINGITEMS, SAVEDRAFT, SAVING, STARTSAVE, STARTSUBMIT, SUBMITTING, CLOSEAPPROVE } from '../../../constants/GlobalConstants';
import CustomDialog from './CustomDialog';
import ListItems from './ListItems';
// import ListItems from './ListItems';
// import CustomDialog from './CustomDialog';

const FormScreen = (props: any) => {
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
                disabled={!loading && (state.Level === 10 || state.Level === 7 || state.Level === 20) ? true : false}
                textField={form.touched.datevalue && !!form.errors.datevalue ? { errorMessage: form.errors.datevalue } : { errorMessage: '' }}
                formatDate={onFormatDate} field={field} form={form} meta={meta}
                className='w-full'
            ></FormikDatePicker>
        );
    };
    const loadForm = () => {
        props.loadForm();
    };
    const initState: object = {
        PendingItems: 0,
        Draft: {},
        Me: {},
        Manager: {},
        ShowForm: false,
        Level: 0,
        Action: 0,
        StartSave: false,
        Saving: false,
        Saved: false,
        StartSubmit: false,
        Submitting: false,
        Submitted: false,
        MyRole: '',
        ShowPendingItems: false,
    };
    let [action, setAction] = React.useState<number>(0);
    // let action: number = 0;

    const useReducerWithThunk = applyMiddleware(thunk)(useReducer);
    const [state, dispatch] = useReducerWithThunk(FormReducer, initState) as any;
    React.useEffect(() => {
        dispatch(LoadData());
    }, [state.Action]);
    const loading = state.loading === undefined ? true : state.loading;

    const handleClose = (ref) => {
        dispatch({ type: CLOSEAPPROVE });
    };

    const handleSave = (ref) => {
        dispatch({ type: STARTSAVE });
    };
    const handleSubmit = (ref) => {
        dispatch({ type: STARTSUBMIT });
    };
    const closeDialog = () => {
        dispatch({ type: CLOSEDIALOG });
    };
    const confirmSave = () => {
        dispatch({ type: SAVING });
        dispatch(SaveData(ref));
    };
    const confirmSubmit = () => {
        dispatch({ type: SUBMITTING });
        dispatch(SubmitData(ref));
    };
    return (
        <div>
            {/* <pre className='container'>{JSON.stringify({ state }, null, 2)}</pre> */}
            <CustomDialog manager={state.Manager} StartSave={state.StartSave} StartSubmit={state.StartSubmit} Saving={state.Saving} Submitting={state.Submitting} Saved={state.Saved} Submitted={state.Submitted} closeDialog={closeDialog} confirmSave={confirmSave} confirmSubmit={confirmSubmit} />
            {/* <pre>{JSON.stringify({ state }, null, 2)}</pre> */}
            <div className="flex flex-col gap-4 items-center justify-items-center" style={{ fontFamily: 'Droid Sans' }}>
                <div>
                    <DefaultButton onClick={ev => loadForm()}><Icon iconName="ChromeBack" /></DefaultButton>
                </div>
                {
                    loading &&
                    <div className=''>
                        <Skeleton width={75} height={25} ></Skeleton>
                    </div>
                }
                <div className="flex flex-row gap-x-2">
                    {
                        !loading && !!state.Draft && !state.ShowForm &&
                        <div className=''>
                            <DefaultButton className='w-56' onClick={(ev) => dispatch({ type: DRAFT })}>{state.Draft.Level === 5 ? `Open Draft` : `Open My Request`}</DefaultButton>
                        </div>
                    }
                    {
                        !loading && state.PendingItems > 0 && !state.ShowPendingItems &&
                        <div className=''>
                            <DefaultButton className='w-56' onClick={ev => dispatch({ type: PENDINGITEMS })}>{`For Me to Approve ${state.PendingItems} items`}</DefaultButton>
                        </div>
                    }
                </div>
                {
                    !loading && state.ShowPendingItems &&
                    <div className="container">
                        <ListItems handleClose={handleClose}></ListItems>
                    </div>
                }
                {
                    !loading && state.ShowForm &&
                    <div className='bg-green-300 p-4 rounded text-center w-full' >
                        Please fill the details to verify and continue
                    </div>
                }
                {
                    !loading && state.ShowForm &&
                    <Formik
                        innerRef={ref}
                        validationSchema={schema}
                        onSubmit={(values) => {
                            handleSubmit(values);
                            // setStep(110)
                            // toggleHideDialog(false);
                            // setSubmitValues(values);
                        }}
                        initialValues={
                            !loading && state.Level === 0 ?
                                {
                                    datevalue: moment(new Date(), 'DD/MM/YYYY').startOf('day').toDate(),
                                    vaccineType: '5555',
                                    comments: ''
                                }
                                :
                                {
                                    vaccineType: state.Draft.VaccinationStatus,
                                    datevalue: moment(state.Draft.LastDose).startOf('day').toDate(),
                                    comments: state.Draft.Comments as string
                                }
                        }
                        validateOnMount={false}
                        validateOnChange={true}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            isValid,
                            errors,
                        }) => {
                            return (
                                <div className="flex flex-wrap w-full max-w-3xl p-2 border-solid border-gray-400">
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
                                                        state.Draft.Level === 5 ? `Draft`
                                                            :
                                                            state.Draft.Level === 10 ? `Pending Approval`
                                                                :
                                                                state.Draft.Level === 6 ? `Returned`
                                                                    :
                                                                    state.Draft.Level === 7 ? `Rejected`
                                                                        :
                                                                        state.Draft.Level === 20 ? `Approved`
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
                                                    {!loading && state.Level === 0 ? `${state.Me.displayName}`
                                                        :
                                                        `${state.Draft.Name}`
                                                    }
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
                                                    {!loading && state.Level === 0 ? `${state.Me.mail}`
                                                        :
                                                        `${state.Draft.Email}`
                                                    }
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
                                                    {!loading && state.Level === 0 ? `${state.Me.businessPhones[0]}`
                                                        :
                                                        `${state.Draft.BusinessPhone}`
                                                    }
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
                                                                disabled={!loading && (state.Level === 10 || state.Level === 7 || state.Level === 20) ? true : false}
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
                                                <label className="font-bold mb-1 md:mb-0 mr-2 whitespace-nowrap" aria-required='true'  >Last dose taken</label>
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
                                                (state.Level === 5 || state.Level === 0 || state.Level === 6) &&
                                                <>
                                                    <div className="flex items-center">
                                                        <label className="font-bold mb-1 md:mb-0 mr-2 whitespace-nowrap" aria-required='true' >Comments</label>
                                                    </div>
                                                    <div className="col-span-3 flex flex-col gap-1 items-center">
                                                        <TextField
                                                            disabled={!loading && state.Level === 10 && state.MyRole === 'Requestor' ? true : false}
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
                                                    !loading && (state.Level === 0 || state.Level === 5) ?
                                                        <>
                                                            <PrimaryButton className={``} type='submit'>Submit</PrimaryButton>
                                                            <PrimaryButton onClick={(e) => { handleSave(ref); }} >Save</PrimaryButton>
                                                            <DefaultButton onClick={(e) => loadForm()}>Close</DefaultButton>
                                                        </>
                                                        :
                                                        !loading && state.Level === 6 ?
                                                            <>
                                                                <PrimaryButton className={``} type='submit'>Re-Submit</PrimaryButton>
                                                                <PrimaryButton onClick={(e) => { handleSave(ref); }} >Save</PrimaryButton>
                                                                <DefaultButton onClick={(e) => loadForm()}>Close</DefaultButton>
                                                            </>
                                                            :
                                                            <DefaultButton onClick={(e) => loadForm()}>Close</DefaultButton>
                                                }
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            );
                        }}</Formik>
                }
                <div className="w-full max-w-3xl mb-10">
                    {
                        !loading && state.ShowForm && state.Draft.History != undefined &&
                        <Activity history={state.Draft.History} />
                    }
                </div>

            </div>
            {/* <Activity /> */}
        </div>
    );
};

export default FormScreen;
