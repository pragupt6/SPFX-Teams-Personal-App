import { Icon, DialogFooter, PrimaryButton, DefaultButton, DialogType, Dialog } from 'office-ui-fabric-react';
import React from 'react';

const ApprovalDialog = (props: any) => {
    let step = 10;
    const dialogContentPropsNormal = {
        type: DialogType.normal,
        title: `${props.Action} Request?`,
    };
    const closeDialog = () => {
        props.closeDialog();
    };
    const confirmAction = () => {
        props.confirmAction();
    };
    const onCloseClick = () => {
        props.onCloseClick();
    };
    const OnConfirmAction = () => {
        props.OnConfirmAction();
    };
    return (
        <Dialog
            minWidth={600}
            maxWidth={600}
            hidden={
                props.HideDialog
            }
            onDismiss={() => {
                props.StartAction ? false : props.closeDialog();

            }
            }
            dialogContentProps={
                dialogContentPropsNormal
            }
            modalProps={
                {
                    isBlocking: true
                }
            }
        >
            {
                props.ConfirmAction &&
                <div>
                    <p>{`Do you want to ${props.Action} the request?`}</p>
                </div>
            }
            {
                props.StartAction &&
                <div>
                    <p>{`Request is being ${props.Action}ed...please hold on.`}</p>
                </div>
            }
            {
                props.ActionCompleted &&
                <div className='flex flex-1 flex-col items-center justify-items-center mx-auto' >
                    <div className='border-solid flex flex-1 items-center justify-center mt-4 mx-auto rounded-full text-green-400 w-36'><Icon iconName='LikeSolid' className='p-4 root-248 text-6xl'></Icon></div>
                    <p className='text-2xl'>{`Request is ${props.Action}ed successfully`}</p>
                </div>
            }
            {
                props.ConfirmAction &&
                <DialogFooter>
                    <PrimaryButton onClick={(ev) => { OnConfirmAction(); }} text="Yes" />
                    <DefaultButton onClick={() => closeDialog()} text="No" />
                </DialogFooter>
            }
            {
                props.ActionCompleted &&
                <DialogFooter><PrimaryButton onClick={(ev) => onCloseClick()} text="Close" /></DialogFooter>
            }
        </Dialog>
    );
};

export default ApprovalDialog;
