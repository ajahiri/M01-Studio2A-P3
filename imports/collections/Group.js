import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Groups = new Mongo.Collection('groups');

Surveys.schema = new SimpleSchema({
    groupNumber: {type: String},
    students: {type: Array},
    project: {type: String},
});

Meteor.methods({
    'groups.insert': function(membersList, projID) {
        Groups.insert({
            students: members,
            project: projID,
        });
    },
    'groups.edit': function(membersList) {
        Groups.update({
            students: membersList,
        })
    }
})