import { Meteor } from 'meteor/meteor';
import { Projects } from './projects';

Meteor.methods({
    insertProject(payload) {
        if (!this.userId) throw new Meteor.Error('Permission error.', 'You must be logged in.');

        const userID = this.userId;
        let result;
        console.log(payload);
        const newProjectID = Meteor.call('insertSurvey', payload.questions);
        return Projects.insert({
            owner: userID,
            projName: payload.projectName,
            groups: [],
            studentResoinses: [],
            allocationType: payload.allocationMethod,
            survey: newProjectID,
        });
    },
})