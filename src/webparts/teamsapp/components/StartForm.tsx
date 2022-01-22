import React, { useCallback } from 'react';
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

const StartForm = (props) => {

    // const reducer = useCallback(
    //     async (state, action) => {
    //         switch (action.type) {
    //             case 'OPEN':
    //                 await sp.web.lists.getByTitle("VaccinationDetails").items.getById(draftvalues["ID"]).get()
    //                 return { ApprovalComponent: true }
    //                 break;

    //             default:
    //                 return {}
    //                 break;
    //         }
    //     },
    //     [],
    // )



    // let initialState: any = {
    //     ApprovalComponent: false
    // }
    // const reducer = async (state, action) => {
    //     switch (action.type) {
    //         case 'OPEN':
    //             let x = await sp.web.lists.getByTitle("VaccinationDetails").items.getById(62).get()
    //             return { ApprovalComponent: true }
    //             break;

    //         default:
    //             return {}
    //             break;
    //     }
    //     return {}
    // }

    // const [state, dispatch] = React.useReducer(reducer, initialState)

    const dialogContentPropsNormal = {
        type: DialogType.normal,
        title: 'Submit Vaccination Details',
    };
    const dialogContentPropsSubmitting = {
        type: DialogType.normal,
        title: 'Submitting....',
        closeButtonAriaLabel: 'Close',
    };
    const dialogContentPropsSaving = {
        type: DialogType.normal,
        title: 'Save as Draft',
        closeButtonAriaLabel: 'Close',
    };
    const [hideDialog, toggleHideDialog] = React.useState<boolean>(true);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [step, setStep] = React.useState<number>(0);
    const [submitValues, setSubmitValues] = React.useState<Object>(null);
    let [draftvalues, setDraftvalues] = React.useState<Object>(null);
    const ref = React.useRef(null);
    console.log('===========step=========================');
    console.log(step);
    console.log('====================================');

    const _goBack = () => {
        props.goBack();
    };
    const options: IChoiceGroupOption[] = [
        { key: 'full', text: 'Full', iconProps: { iconName: 'FullCircleMask' } },
        { key: 'partial', text: 'Partial', iconProps: { iconName: 'CircleHalfFull' } },
    ];
    const schema = Yup.object().shape({
        datevalue: Yup.date()
            .max(moment().startOf('day').toDate(), "Future date not allowed"),
        vaccineType: Yup.string()
            .notOneOf(['5555'], "Chose vaccine type")
    });
    const onFormatDate = (date?: Date): string => {
        return !date ? '' : date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() % 100);
    };
    const datePicker = ({ form, field, meta }) => {
        return (
            <FormikDatePicker
                // disabled={true}
                disabled={step === 90 && draftvalues["Level"] === 10 ? true : false}
                textField={form.touched.datevalue && !!form.errors.datevalue ? { errorMessage: form.errors.datevalue } : { errorMessage: '' }}
                formatDate={onFormatDate} field={field} form={form} meta={meta}
                className='w-full'
            ></FormikDatePicker>
        );
    };

    const DialogBox = ({ step, manager }) => {
        return (
            <Dialog
                minWidth={600}
                maxWidth={600}
                hidden={hideDialog}
                onDismiss={() => {
                    step === 110 ? toggleHideDialog(true)
                        :
                        step === 10 ? false
                            :
                            toggleHideDialog(true);
                }
                }
                dialogContentProps={
                    step === 110 ? dialogContentPropsNormal
                        :
                        step === 10 ? dialogContentPropsSubmitting
                            :
                            step === 40 ? dialogContentPropsSaving
                                :
                                step === 50 ? dialogContentPropsSaving
                                    :
                                    step === 60 ? dialogContentPropsSaving
                                        :
                                        dialogContentPropsNormal
                }
                modalProps={
                    {
                        isBlocking: step === 110 ? true
                            :
                            step === 10 ? false
                                :
                                true
                    }
                }
            >
                {
                    step === 110 && <div>
                        <p>{`This request will be routed to ${manager["displayName"]}(${manager["mail"]})`}</p>
                        <p>{`Do you want to submit the details?`}</p>
                    </div>
                }
                {
                    step === 40 && <div>
                        {/* <p>{`This request will be routed to ${manager["displayName"]}(${manager["mail"]})`}</p> */}
                        <p>{`Do you want to save the request?`}</p>
                    </div>
                }
                {
                    step === 10 && <div>
                        <p>{`Request is being submitted...please hold on.`}</p>
                    </div>
                }
                {
                    step === 50 && <div>
                        <p>{`Request is being saved...please hold on.`}</p>
                    </div>
                }
                {
                    step === 20 && <div className='flex flex-1 flex-col items-center justify-items-center mx-auto' >
                        <div className='border-solid flex flex-1 items-center justify-center mt-4 mx-auto rounded-full text-green-400 w-36'><Icon iconName='LikeSolid' className='p-4 root-248 text-6xl'></Icon></div>
                        <p className='text-2xl'>{`Request is Submitted successfully`}</p>
                    </div>
                }
                {
                    step === 60 && <div className='flex flex-1 flex-col items-center justify-items-center mx-auto' >
                        <div className='border-solid flex flex-1 items-center justify-center mt-4 mx-auto rounded-full text-green-400 w-36'><Icon iconName='LikeSolid' className='p-4 root-248 text-6xl'></Icon></div>
                        <p className='text-2xl'>{`Request is Saved successfully`}</p>
                    </div>
                }
                {step === 110 && <DialogFooter>
                    <PrimaryButton onClick={(ev) => handleSubmit(ev)} text="Yes, Please send" />
                    <DefaultButton onClick={() => toggleHideDialog(true)} text="Don't send" />
                </DialogFooter>}
                {step === 40 && <DialogFooter>
                    <PrimaryButton onClick={(ev) => handleSaveAsDraft()} text="Yes, Please save" />
                    <DefaultButton onClick={() => toggleHideDialog(true)} text="No" />
                </DialogFooter>}
                {step === 10 && <></>}
                {step === 20 && <DialogFooter><PrimaryButton onClick={(ev) => handleFinalClose()} text="Close" /></DialogFooter>}
                {step === 60 && <DialogFooter><PrimaryButton onClick={(ev) => handleFinalSaveClick()} text="Close" /></DialogFooter>}
            </Dialog>
        );
    };
    const handleSubmit = async (ev) => {
        setStep(10);
        let itemAdd: any;
        if (draftvalues) {
            itemAdd = await sp.web.lists.getByTitle("VaccinationDetails").items.getById(draftvalues["ID"]).update({
                VaccinationStatus: ref.current.values["vaccineType"],
                LastDose: moment(ref.current.values["datevalue"], "DD/MM/YYYY").toDate(),
                Level: 10,
            });
        }
        else {
            itemAdd = await sp.web.lists.getByTitle("VaccinationDetails").items.add({
                Title: props.user.displayName,
                Name: props.user.displayName,
                Email: props.user.mail,
                BusinessPhone: props.user.businessPhones[0],
                VaccinationStatus: submitValues["vaccineType"],
                LastDose: moment(submitValues["datevalue"], "DD/MM/YYYY").toDate(),
                RequestNumber: '123-2323-D',
                Level: 10,
                Actors: JSON.stringify({
                    Requestor: props.user.mail,
                    Approver: props.manager["mail"]
                })
            });
        }
        const item = await sp.web.lists.getByTitle("VaccinationDetails").items.getById(itemAdd?.data?.ID == undefined ? draftvalues["ID"] : itemAdd?.data?.ID);
        await item.breakRoleInheritance(false); // Method receives params
        const { Id: userprincipalId } = await sp.web.currentUser.select('Id').get();
        console.log('=============Approvers=======================');
        console.log(props.manager["mail"]);
        console.log('====================================');
        const { Id: Approvers } = await sp.web.siteUsers.getByEmail(props.manager["mail"]).select('Id').get();
        const { Id: Readers } = await sp.web.roleDefinitions.getByName('Read').get();
        const { Id: Contributors } = await sp.web.roleDefinitions.getByName('Contribute').get();
        const { Id: fullRoleDefId } = await sp.web.roleDefinitions.getByName('Full Control').get();
        // Assigning permissions
        // ID=15 Super Admins
        await item.roleAssignments.add(userprincipalId, Readers);
        await item.roleAssignments.add(Approvers, Contributors);
        await item.roleAssignments.add(15, Contributors);
        await item.roleAssignments.remove(userprincipalId, fullRoleDefId);
        setStep(20);
    };
    const handleFinalClose = () => {
        setStep(0);
        toggleHideDialog(true);
    };
    const handleFinalSaveClick = () => {
        setStep(80);
        toggleHideDialog(true);
    };
    const handleSave = () => {
        toggleHideDialog(false);
        setStep(40);
    };
    const handleSaveAsDraft = async () => {
        setStep(50);
        let itemAdd: any;
        if (draftvalues) {
            itemAdd = await sp.web.lists.getByTitle("VaccinationDetails").items.getById(draftvalues["ID"]).update({
                VaccinationStatus: ref.current.values["vaccineType"],
                LastDose: moment(ref.current.values["datevalue"], "DD/MM/YYYY").toDate(),
            });
        }
        else {
            itemAdd = await sp.web.lists.getByTitle("VaccinationDetails").items.add({
                Title: props.user.displayName,
                Name: props.user.displayName,
                Email: props.user.mail,
                BusinessPhone: props.user.businessPhones[0],
                VaccinationStatus: ref.current.values["vaccineType"],
                LastDose: moment(ref.current.values["datevalue"], "DD/MM/YYYY").toDate(),
                RequestNumber: '123-2323-D',
                Level: 5,
                Actors: JSON.stringify({
                    Requestor: props.user.mail,
                    Approver: props.manager["mail"]
                })
            });
        }

        const item = await sp.web.lists.getByTitle("VaccinationDetails").items.getById(itemAdd.data.ID);
        // await item.breakRoleInheritance(false); // Method receives params
        // const { Id: userprincipalId } = await sp.web.currentUser.select('Id').get();
        // const { Id: Approvers } = await sp.web.siteUsers.getByEmail("pragupt6@mso365e5.onmicrosoft.com").select('Id').get();
        // const { Id: Readers } = await sp.web.roleDefinitions.getByName('Read').get();
        // const { Id: Contributors } = await sp.web.roleDefinitions.getByName('Contribute').get();
        // const { Id: fullRoleDefId } = await sp.web.roleDefinitions.getByName('Full Control').get();
        // // Assigning permissions
        // // ID=15 Super Admins
        // await item.roleAssignments.add(userprincipalId, Readers);
        // await item.roleAssignments.add(Approvers, Contributors);
        // await item.roleAssignments.add(6, Contributors);
        // await item.roleAssignments.remove(userprincipalId, fullRoleDefId);
        //toggleHideDialog(true)
        setStep(60);
    };
    React.useEffect(() => {
        async function fetchDraftItem() {
            setLoading(true);
            const draft = await sp.web.lists.getByTitle("VaccinationDetails").items.top(1).filter(`Email eq '${props.user.mail}'`).get();
            setDraftvalues(draftvalues = draft[0]);
            console.log('==============draftvalues======================');
            console.log(draftvalues);
            console.log('====================================');
            draft.length > 0 ? setStep(70) : setStep(100);
            setLoading(false);

        }

        if (step === 80 || step === 0) {
            fetchDraftItem();
        }
        return () => {
            //cleanup
        };
    }, [step]);
    return (
        <div>
            {/* <pre>{JSON.stringify({ state }, null, 2)}</pre> */}

            {/* {state["ApprovalComponent"] ? <>This is approval component</> : <> </>} */}
            <div className="flex flex-col gap-4 items-center justify-items-center" style={{ fontFamily: 'Droid Sans' }}>
                <div>
                    <DefaultButton onClick={ev => _goBack()}><Icon iconName="ChromeBack" /></DefaultButton>
                </div>
                {
                    step === 70 && !loading && <div className='mb-10'>
                        <DefaultButton onClick={ev => setStep(90)}>Open Draft</DefaultButton>
                        {/* <DefaultButton onClick={ev => dispatch({ type: 'OPEN' })}>Open Approval</DefaultButton> */}
                    </div>
                }
                {
                    (step !== 70) && !loading && <div className='bg-green-300 p-4 rounded text-center w-full' >
                        Please fill the details to verify and continue
                    </div>
                }
                {(step !== 70) && !loading &&
                    <Formik
                        innerRef={ref}
                        validationSchema={schema}
                        onSubmit={(values) => {
                            setStep(110);
                            toggleHideDialog(false);
                            setSubmitValues(values);
                        }}
                        initialValues={
                            step === 90 ?
                                {
                                    datevalue: moment(draftvalues["LastDose"]).startOf('day').toDate(),
                                    vaccineType: draftvalues["VaccinationStatus"]
                                }
                                : {
                                    datevalue: moment(new Date(), 'DD/MM/YYYY').startOf('day').toDate(),
                                    vaccineType: '5555'
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
                                <div className="flex flex-wrap w-full mb-10 p-2 border-solid border-gray-400">
                                    <Form noValidate onSubmit={handleSubmit} className="w-full">

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
                                                        step === 90 && draftvalues["Level"] === 10 ? `Pending Approval`
                                                            :
                                                            step === 90 && draftvalues["Level"] === 5 ? `Draft`
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
                                                    {props.user.displayName}
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
                                                    {props.user.mail}
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
                                                    {props.user.businessPhones[0]}
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
                                                                disabled={step === 90 && draftvalues["Level"] === 10 ? true : false}
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
                                                    name="datevalue"
                                                    component={datePicker}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="flex items-center"></div>
                                            <div className="flex items-center col-span-3 gap-2">
                                                <PrimaryButton className={step === 90 && draftvalues["Level"] === 10 ? `hidden` : `visible`} type='submit'>Submit</PrimaryButton>
                                                <PrimaryButton className={step === 90 && draftvalues["Level"] === 10 ? `hidden` : `visible`} hidden={step === 90 && draftvalues["Level"] === 10 ? true : false} onClick={(e) => handleSave()} >Save</PrimaryButton>
                                                <DefaultButton onClick={(e) => _goBack()}>Close</DefaultButton>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            );
                        }}</Formik>}
                {/* <div className='w-full md:w-3/5'>
                    <Activity />
                </div> */}
            </div>
            <DialogBox step={step} manager={props.manager} />
        </div>

    );
};

export default StartForm;
