import { sp } from '@pnp/pnpjs';
import { graph } from "@pnp/graph";
import { INITIAL, PAGED, FILTER, LOADFORM, LOADING, SAVEDRAFT, SUBMITTED } from '../constants/GlobalConstants';
import moment from 'moment';

export const LoadData = () => {
    return async (dispatch, getState) => {
        let draft; let response; let Level: number; let Me; let MyManager; let MyRole; let pendingItems; let itemCount: number;
        const state = getState();
        if (state.loading) return;
        dispatch({ type: LOADING });
        let promise = await Promise.all([
            Me = await graph.me(),
            MyManager = await graph.me.manager.get(),
        ]);
        draft = await sp.web.lists.getByTitle("VaccinationDetails").items.top(1).filter(`Email eq '${Me.mail}'`).get();
        pendingItems = await sp.web.lists.getByTitle("VaccinationDetails").items.filter(`CurrentActor eq '${Me.mail}' and Level eq 10`).get();
        if (draft.length > 0) {
            const roles = JSON.parse(draft[0].Actors);
            MyRole = roles.Requestor === Me.mail ? `Requestor`
                :
                roles.Approver === Me.mail ? `Approver`
                    :
                    `None`;
        } else {
            MyRole = `None`;
        }
        itemCount = pendingItems.length > 0 ? pendingItems.length : 0;
        Level = draft.length > 0 ? draft[0].Level : 0;
        dispatch({ type: INITIAL, payload: { Me, MyManager, draft, Level, MyRole, itemCount } });
    };
};
export const SubmitData = (ref) => {
    return async (dispatch, getState) => {
        const state = getState();
        let itemAdd;
        if (state.loading) return;
        dispatch({ type: LOADING });
        const History = state.Draft.History == undefined ? [] : JSON.parse(state.Draft.History);
        let historyObj = {
            id: History.length + 1,
            time: moment().format("DD/MM/YYYY hh:mm:ss"),
            actorName: state.Me.displayName,
            actorEmail: state.Me.mail,
            action: `Submitted the item`,
            CurrentActor: state.Manager.mail,
            comments: ref.current.values["comments"],
        };
        History.push(historyObj);
        switch (state.Level) {
            case 0:
                itemAdd = await sp.web.lists.getByTitle("VaccinationDetails").items.add({
                    Title: state.Me.displayName,
                    Name: state.Me.displayName,
                    Email: state.Me.mail,
                    BusinessPhone: state.Me.businessPhones[0],
                    VaccinationStatus: ref.current.values["vaccineType"],
                    Comments: '',
                    LastDose: moment(ref.current.values["datevalue"], "DD/MM/YYYY").toDate(),
                    RequestNumber: '123-2323-D',
                    Level: 10,
                    CurrentActor: state.Manager.mail,
                    Actors: JSON.stringify({
                        Requestor: state.Me.mail,
                        Approver: state.Manager.mail,
                    }),
                    History: JSON.stringify(History),
                });
                break;
            case 5:
                await sp.web.lists.getByTitle("VaccinationDetails").items.getById(state.Draft.ID).update({
                    Level: 10,
                    Comments: '',
                    CurrentActor: state.Manager.mail,
                    VaccinationStatus: ref.current.values["vaccineType"],
                    LastDose: moment(ref.current.values["datevalue"], "DD/MM/YYYY").toDate(),
                    History: JSON.stringify(History),
                });
                break;
            case 6:
                await sp.web.lists.getByTitle("VaccinationDetails").items.getById(state.Draft.ID).update({
                    Level: 10,
                    Comments: '',
                    CurrentActor: state.Manager.mail,
                    VaccinationStatus: ref.current.values["vaccineType"],
                    LastDose: moment(ref.current.values["datevalue"], "DD/MM/YYYY").toDate(),
                    History: JSON.stringify(History),
                });
                break;
            default:
                break;
        }
        const item = await sp.web.lists.getByTitle("VaccinationDetails").items.getById(itemAdd?.data?.ID == undefined ? state.Draft.ID : itemAdd?.data?.ID);

        await item.breakRoleInheritance(false); // Method receives params
        const { Id: userprincipalId } = await sp.web.currentUser.select('Id').get();
        const { Id: Approvers } = await sp.web.siteUsers.getByEmail(state.Manager.mail).select('Id').get();
        const { Id: Readers } = await sp.web.roleDefinitions.getByName('Read').get();
        // const { Id: Contributors } = await sp.web.roleDefinitions.getByName('Contribute').get();
        const { Id: Contributors } = await sp.web.roleDefinitions.getByName('Contribute without delete').get();
        const { Id: fullRoleDefId } = await sp.web.roleDefinitions.getByName('Full Control').get();
        // Assigning permissions
        // ID=15 Super Admins
        await item.roleAssignments.add(userprincipalId, Readers);
        await item.roleAssignments.add(Approvers, Contributors);
        await item.roleAssignments.add(15, fullRoleDefId);
        await item.roleAssignments.remove(userprincipalId, fullRoleDefId);
        dispatch({ type: SUBMITTED });
    };
};
export const SaveData = (ref) => {
    return async (dispatch, getState) => {
        const state = getState();
        if (state.loading) return;
        dispatch({ type: LOADING });

        const History = state.Draft.History == undefined ? [] : JSON.parse(state.Draft.History);
        let historyObj = {
            id: History.length + 1,
            time: moment().format("DD/MM/YYYY hh:mm:ss"),
            actorName: state.Me.displayName,
            actorEmail: state.Me.mail,
            action: `Saved the item`,
            comments: ref.current.values["comments"],
        };
        History.push(historyObj);
        if (History.length > 0) {

        }
        else {

        }
        switch (state.Level) {
            case 0:
                await sp.web.lists.getByTitle("VaccinationDetails").items.add({
                    Title: state.Me.displayName,
                    Name: state.Me.displayName,
                    Email: state.Me.mail,
                    BusinessPhone: state.Me.businessPhones[0],
                    VaccinationStatus: ref.current.values["vaccineType"],
                    LastDose: moment(ref.current.values["datevalue"], "DD/MM/YYYY").toDate(),
                    RequestNumber: '123-2323-D',
                    Level: 5,
                    Comments: ref.current.values["comments"],
                    CurrentActor: state.Me.mail,
                    Actors: JSON.stringify({
                        Requestor: state.Me.mail,
                        Approver: state.Manager.mail,
                    }),
                    History: JSON.stringify(History),
                });
                break;
            case 5:
                await sp.web.lists.getByTitle("VaccinationDetails").items.getById(state.Draft.ID).update({
                    VaccinationStatus: ref.current.values["vaccineType"],
                    Comments: ref.current.values["comments"],
                    LastDose: moment(ref.current.values["datevalue"], "DD/MM/YYYY").toDate(),
                    History: JSON.stringify(History),
                });
                break;
            case 6:
                await sp.web.lists.getByTitle("VaccinationDetails").items.getById(state.Draft.ID).update({
                    VaccinationStatus: ref.current.values["vaccineType"],
                    Comments: ref.current.values["comments"],
                    LastDose: moment(ref.current.values["datevalue"], "DD/MM/YYYY").toDate(),
                    History: JSON.stringify(History),
                });
                break;

            default:
                break;
        }
        dispatch({ type: SAVEDRAFT });
    };
};