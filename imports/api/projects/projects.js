import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';


export const Projects = new Mongo.Collection('projects');

Projects.schema = new SimpleSchema({
    projName: {type: String},       // Name of Project
    tutorID: {type: String},        // For ownership checking
    //groups: {type: Array},          // Results from allocation
    allocationType: {type: String}, // Allocation method
    survey: {type: String},         // ID to survey document
    //surveyResults: {type: Array},   // This might be moved to its own collection
});