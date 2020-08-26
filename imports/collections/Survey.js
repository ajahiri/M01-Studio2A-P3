import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Surveys = new Mongo.Collection('surveys');

Surveys.schema = new SimpleSchema({
    survName: {type: String},
    questions: {type: Array},
});

Meteor.methods({
    'groups.insert': function(name, listQuestions) {
        Groups.insert({
            survName: name,
            questions: listQuestions,
        });
    },
})