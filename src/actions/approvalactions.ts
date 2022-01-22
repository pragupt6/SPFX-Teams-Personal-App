import { sp } from "@pnp/pnpjs";
import { graph } from "@pnp/graph";
import * as Constant from "../constants/GlobalConstants";
import moment from "moment";
export const action1 = () => {
    return async (dispatch, getState) => {
        const state = getState();
        if (state.loading) return;
    };
};
export const ConfirmAction = (action, ref) => {
    return async (dispatch, getState) => {
        const state = getState();
        if (state.loading) return;
        dispatch({ type: Constant.STARTAPPROVALACTION });
        console.log("============action========================");
        console.log(action);
        console.log("====================================");
        let historyObj;
        let listItem;
        let Actors;
        let item;
        let Me = await graph.me();
        const History = state.History == undefined ? [] : JSON.parse(state.History);
        switch (action) {
            case "Approve":
                historyObj = {
                    id: History.length + 1,
                    time: moment().format("DD/MM/YYYY hh:mm:ss"),
                    actorName: Me.displayName,
                    actorEmail: Me.mail,
                    action: `Approved the item`,
                    comments: ref.current.values["comments"],
                };
                History.push(historyObj);
                listItem = await sp.web.lists
                    .getByTitle("VaccinationDetails")
                    .items.getById(state.ID)
                    .update({
                        Level: 20,
                        Comments: "",
                        History: JSON.stringify(History),
                    });
                Actors = JSON.parse(state.Actors);
                item = await sp.web.lists.getByTitle("VaccinationDetails").items.getById(state.ID);
                await item.breakRoleInheritance(false); // Method receives params
                let { Id: userprincipalId1 } = await sp.web.currentUser.select('Id').get();
                let { Id: Requestor1 } = await sp.web.siteUsers.getByEmail(Actors.Requestor).select('Id').get();
                let { Id: Readers1 } = await sp.web.roleDefinitions.getByName('Read').get();
                let { Id: Contributors1 } = await sp.web.roleDefinitions.getByName('Contribute without delete').get();

                await item.roleAssignments.add(userprincipalId1, Readers1);
                //await item.roleAssignments.add(Requestor2, Contributors2);


                //await item.roleAssignments.remove(Requestor2, Readers2);
                await item.roleAssignments.remove(userprincipalId1, Contributors1);
                break;
            case "Reject":
                historyObj = {
                    id: History.length + 1,
                    time: moment().format("DD/MM/YYYY hh:mm:ss"),
                    actorName: Me.displayName,
                    actorEmail: Me.mail,
                    action: `Rejected the item`,
                    comments: ref.current.values["comments"],
                };
                History.push(historyObj);

                listItem = await sp.web.lists
                    .getByTitle("VaccinationDetails")
                    .items.getById(state.ID)
                    .update({
                        Level: 7,
                        Comments: "",
                        History: JSON.stringify(History),
                    });
                Actors = JSON.parse(state.Actors);
                item = await sp.web.lists.getByTitle("VaccinationDetails").items.getById(state.ID);
                await item.breakRoleInheritance(false); // Method receives params
                let { Id: userprincipalId2 } = await sp.web.currentUser.select('Id').get();
                let { Id: Requestor2 } = await sp.web.siteUsers.getByEmail(Actors.Requestor).select('Id').get();
                let { Id: Readers2 } = await sp.web.roleDefinitions.getByName('Read').get();
                let { Id: Contributors2 } = await sp.web.roleDefinitions.getByName('Contribute without delete').get();

                await item.roleAssignments.add(userprincipalId2, Readers2);
                //await item.roleAssignments.add(Requestor2, Contributors2);


                //await item.roleAssignments.remove(Requestor2, Readers2);
                await item.roleAssignments.remove(userprincipalId2, Contributors2);
                break;
            case "Return":
                historyObj = {
                    id: History.length + 1,
                    time: moment().format("DD/MM/YYYY hh:mm:ss"),
                    actorName: Me.displayName,
                    actorEmail: Me.mail,
                    action: `Returned the item`,
                    comments: ref.current.values["comments"],
                };
                History.push(historyObj);

                listItem = await sp.web.lists
                    .getByTitle("VaccinationDetails")
                    .items.getById(state.ID)
                    .update({
                        Level: 6,
                        Comments: "",
                        History: JSON.stringify(History),
                    });
                //Update permissions
                //Requestor = contriute
                //Approver = Read
                Actors = JSON.parse(state.Actors);
                item = await sp.web.lists.getByTitle("VaccinationDetails").items.getById(state.ID);
                await item.breakRoleInheritance(false); // Method receives params
                let { Id: userprincipalId3 } = await sp.web.currentUser.select('Id').get();
                let { Id: Requestor3 } = await sp.web.siteUsers.getByEmail(Actors.Requestor).select('Id').get();
                let { Id: Readers3 } = await sp.web.roleDefinitions.getByName('Read').get();
                let { Id: Contributors3 } = await sp.web.roleDefinitions.getByName('Contribute without delete').get();

                await item.roleAssignments.add(userprincipalId3, Readers3);
                await item.roleAssignments.add(Requestor3, Contributors3);


                await item.roleAssignments.remove(Requestor3, Readers3);
                await item.roleAssignments.remove(userprincipalId3, Contributors3);

                break;

            default:
                break;
        }
        dispatch({ type: Constant.COMPLETEAPPROVALACTION });
    };
};
