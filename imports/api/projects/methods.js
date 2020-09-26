import { Meteor } from 'meteor/meteor';
import { Projects } from './projects';

Meteor.methods({
    insertProject(payload) {
        if (!this.userId) throw new Meteor.Error('Permission error.', 'You must be logged in.');

        const userID = this.userId;
        let result;
        console.log(payload);
        const newProjectID = Meteor.call('insertSurvey', payload.questions, payload.surveyTitle);
        return Projects.insert({
            owner: userID,
            projName: payload.projectName,
            groupSize: payload.projectGroupSize,
            groups: [],
            // studentResoinses: [],
            allocationType: payload.allocationMethod,
            survey: newProjectID,
        });
    },
    getUserProjects() {
        const userID = this.userId;
        let arr = Projects.find({
            owner: userID,
        }).fetch();
        return arr;
    },
    getProject(projectID) {
        const userID = this.userId;
 
        return project = Projects.findOne({
            _id: projectID,
            owner: this.userId
        });
    },
})