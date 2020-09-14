import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Groups = new Mongo.Collection('groups');

Groups.schema = new SimpleSchema({
    groupNumber: {type: String},
    students: {type: String},
    'students.$': String,
    project: {type: String},
});
 