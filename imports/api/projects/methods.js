import { Meteor } from 'meteor/meteor';
import { SurveyResults } from '../surveyResults/surveyResult';
import { Projects } from './projects';
import loShuffle from 'lodash/shuffle';
import loOrderBy from 'lodash/orderBy';
import loPullAt from 'lodash/pullAt';

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
        // console.log('NEW GROUPS ARRAY', newGroups);
        Projects.update({_id: projectPayload._id}, {$set: {groups: newGroups}});
    },
    generateRandomAllocation(projectPayload) {
        // Payload is the whole project object including the groups array inside it
        // Check owner first
        if (!this.userId) throw new Meteor.Error(403, 'No permission, must be logged in.');
        const project = Projects.find({_id: projectPayload._id});
        if (project.fetch().length < 1) throw new Meteor.Error(404, 'Could not find project with that ID');
        if (project.fetch()[0].owner !== this.userId) throw new Meteor.Error(403, 'No permission, you are not the owner of this project.');
        // End checking, do update now

        surveyResults = SurveyResults.find({associatedProject: projectPayload._id}).fetch();

        let studentList = [];
        surveyResults.forEach(result => {
            studentList.push(result._id);
        });

        // Randomise students (using lodash shuffle)
        studentList = loShuffle(studentList);

        const numOfGroups = Math.ceil(studentList.length/projectPayload.groupSize);
        const randomisedGroups = [];

        for (let index = 0; index < numOfGroups; index++) {
            randomisedGroups.push({
                number: index + 1,
                name: `Group ${index + 1}`,
                students: [],
            })
        }

        while(studentList.length > 0) {
            randomisedGroups.forEach((group, index) => {
                const student = studentList.shift();
                if (student !== undefined)
                    group.students.push(student);
            })
        }

        Projects.update({_id: projectPayload._id}, {$set: {groups: randomisedGroups}});
        // console.log(randomisedGroups);
    },
    generateAutomaticAllocation(projectPayload) {
        // Payload is the whole project object including the groups array inside it
        // Check owner first
        if (!this.userId) throw new Meteor.Error(403, 'No permission, must be logged in.');
        const project = Projects.find({_id: projectPayload._id});
        if (project.fetch().length < 1) throw new Meteor.Error(404, 'Could not find project with that ID');
        if (project.fetch()[0].owner !== this.userId) throw new Meteor.Error(403, 'No permission, you are not the owner of this project.');
        // End checking, do update now

        let surveyResults = SurveyResults.find({associatedProject: projectPayload._id}).fetch();

        // Order students based on their overall score, ascending (highest score at end of array)
        surveyResults = loOrderBy(surveyResults, ['studentScore'], ['asc']);

        // console.log('STUDENTS SORTED BY SCORE', surveyResults);

        let studentList = [];
        surveyResults.forEach(result => {
            studentList.push(result._id);
        });

        const numOfGroups = Math.ceil(studentList.length/projectPayload.groupSize);
        const randomisedGroups = [];

        // Build groups object shape
        for (let index = 0; index < numOfGroups; index++) {
            randomisedGroups.push({
                number: index + 1,
                name: `Group ${index + 1}`,
                students: [],
            })
        }

        while(studentList.length > 0) {
            randomisedGroups.forEach((group, index) => {
                // Gets most able and least able person and adds them to a group, repeats until no students left
                let student = studentList.shift();
                if (student !== undefined)
                    group.students.push(student);
            })
            randomisedGroups.forEach((group, index) => {
                // Gets most able and least able person and adds them to a group, repeats until no students left
                let student = studentList.pop();
                if (student !== undefined)
                    group.students.push(student);
            })
        }

        Projects.update({_id: projectPayload._id}, {$set: {groups: randomisedGroups}});
        // console.log('AUTOMATIC ALLOCATION', randomisedGroups);
    }
})