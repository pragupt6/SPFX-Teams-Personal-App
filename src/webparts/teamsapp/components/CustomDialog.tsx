import { Icon, DialogFooter, PrimaryButton, DefaultButton, DialogType, Dialog } from 'office-ui-fabric-react';
import React from 'react';

const CustomDialog = (props: any) => {
    let step = 10;
    const [hideDialog, toggleHideDialog] = React.useState<boolean>(true);
    const dialogContentPropsNormal = {
        type: DialogType.normal,
        title: 'Submit Vaccination Details',
    };
    const dialogContentPropsSave = {
        type: DialogType.normal,
        title: 'Save as Draft',
    };
    const closeDialog = () => {
        props.closeDialog();
    };
    const confirmSave = () => {
        props.confirmSave();
    };
    const confirmSubmit = () => {
        props.confirmSubmit();
    };
    return (
        <Dialog
            minWidth={600}
            maxWidth={600}
            hidden={
                props.StartSave ? false
                    :
                    props.StartSubmit ? false
                        :
                        true
            }
            onDismiss={() => {
                props.Saving ? false
                    :
                    props.Submitting ? false
                        :
                        closeDialog();
            }
            }
            dialogContentProps={
                props.StartSave ? dialogContentPropsSave
                    :
                    props.StartSubmit ? dialogContentPropsNormal
                        :
                        {}
            }
            modalProps={
                {
                    isBlocking: true
                }
            }
        >
            {
                props.StartSubmit && !props.Submitting && !props.Submitted &&
                <div>
                    <p>{`This request will be routed to ${props.manager.displayName}(${props.manager.mail})`}</p>
                    <p>{`Do you want to submit the details?`}</p>
                </div>
            }
            {
                props.StartSave && !props.Saving && !props.Saved &&
                <div>
                    {/* <p>{`This request will be routed to ${manager["displayName"]}(${manager["mail"]})`}</p> */}
                    <p>{`Do you want to save the request?`}</p>
                </div>
            }
            {
                props.Submitting &&
                <div>
                    <p>{`Request is being submitted...please hold on.`}</p>
                </div>
            }
            {
                props.Saving &&
                <div>
                    <p>{`Request is being saved...please hold on.`}</p>
                </div>
            }
            {
                props.Submitted &&
                <div className='flex flex-1 flex-col items-center justify-items-center mx-auto' >
                    <div className='border-solid flex flex-1 items-center justify-center mt-4 mx-auto rounded-full text-green-400 w-36'><Icon iconName='LikeSolid' className='p-4 root-248 text-6xl'></Icon></div>
                    <p className='text-2xl'>{`Request is Submitted successfully`}</p>
                </div>
            }
            {
                props.Saved &&
                <div className='flex flex-1 flex-col items-center justify-items-center mx-auto' >
                    <div className='border-solid flex flex-1 items-center justify-center mt-4 mx-auto rounded-full text-green-400 w-36'><Icon iconName='LikeSolid' className='p-4 root-248 text-6xl'></Icon></div>
                    <p className='text-2xl'>{`Request is Saved successfully`}</p>
                </div>
            }
            {
                props.StartSubmit && !props.Submitting && !props.Submitted &&
                <DialogFooter>
                    <PrimaryButton onClick={(ev) => { confirmSubmit(); }} text="Yes, Please send" />
                    <DefaultButton onClick={() => closeDialog()} text="Don't send" />
                </DialogFooter>
            }
            {
                props.StartSave && !props.Saving && !props.Saved &&
                <DialogFooter>
                    <PrimaryButton onClick={(ev) => { confirmSave(); }} text="Yes, Please save" />
                    <DefaultButton onClick={() => closeDialog()} text="No" />
                </DialogFooter>
            }

            {
                props.Saved &&
                <DialogFooter><PrimaryButton onClick={(ev) => closeDialog()} text="Close" /></DialogFooter>
            }
            {
                props.Submitted &&
                <DialogFooter><PrimaryButton onClick={(ev) => closeDialog()} text="Close" /></DialogFooter>
            }
        </Dialog>
    );
};

export default CustomDialog;
