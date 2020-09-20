import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Surveys = new Mongo.Collection('surveys');

Surveys.schema = new SimpleSchema({
    surveyName: {type: String},
    questions: [{type: Object}],
    "questions.question": {type: String},
    "questions.weight": {type: String},
});