import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Students = new Mongo.Collection('students');

Students.schema = new SimpleSchema({
    tutID: {type: String},
    studentName: {type: String},
    studentEmail: {type: String},
    groupID: {type: String},
    allocated: {type: Boolean},
});
 