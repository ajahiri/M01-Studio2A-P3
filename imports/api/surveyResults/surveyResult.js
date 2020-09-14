import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const SurveyResults = new Mongo.Collection('surveyResults');//

SurveyResults.schema = new SimpleSchema({
    survName: {type: String},
});