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
    updateGroupsArray(projectPayload) {
        // Payload is the whole project object including the groups array inside it
        // Check owner first
        if (!this.userId) throw new Meteor.Error(403, 'No permission, must be logged in.');
        const project = Projects.find({_id: projectPayload._id});
        if (project.fetch().length < 1) throw new Meteor.Error(404, 'Could not find project with that ID');
        if (project.fetch()[0].owner !== this.userId) throw new Meteor.Error(403, 'No permission, you are not the owner of this project.');
        // End checking, do update now

        const newGroups = projectPayload.groups;
        console.log('NEW GROUPS ARRAY', newGroups);
        Projects.update({_id: projectPayload._id}, {$set: {groups: newGroups}});
    }
})