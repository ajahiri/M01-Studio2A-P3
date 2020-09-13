import { Meteor } from 'meteor/meteor';
import { Students } from './students';


Meteor.methods({
    async getStudents( groupID , tutID) {
        return Students.find({
            tutID: tutID,
            groupID: groupID,
        }).fetch();
    },
})