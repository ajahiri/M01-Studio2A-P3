import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Projects = new Mongo.Collection('projects');

Surveys.schema = new SimpleSchema({
    projName: {type: String},
    groups: {type: Array},
    allocationType: {type: String},
    survey: {type: String},
});

Meteor.methods({
    'projects.insert': function(name, listGroups, allocType, surveyID) {
        Projects.insert({
            projName: name,
            groups: listGroups,
            allocationType: allocType,
            survey: surveyID,
        });
    },
})