import { Meteor } from 'meteor/meteor';
import { Groups } from './group';


Meteor.methods({
    groupsInsert(membersList, projID) {
        return Groups.insert({
            groupNumber: 2,
            students: membersList,
            project: "E22ZBPZHFnR4gEk9v",
        });
    },groupsEdit(membersList) {
        return Groups.update({
            students: membersList,
        })
    },async groupsGet( projID) {
        return Groups.findOne({
            project: projID,
        })
    },
})