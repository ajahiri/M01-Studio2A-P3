import { Meteor } from 'meteor/meteor';
import { SurveyResults } from '../surveyResults/surveyResult';
import { Projects } from './projects';
import { Surveys } from '../survey/survey';
import loShuffle from 'lodash/shuffle';
import loOrderBy from 'lodash/orderBy';
import loPullAt from 'lodash/pullAt';
import { Email } from 'meteor/email';
import loFind from 'lodash/find';
import { check } from 'meteor/check';

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
    },
    sendStudentEmails(projectID) {
        const project = Projects.findOne({_id: projectID});
        const groupings = project.groups;
        if (groupings.length < 1) throw new Meteor.Error('MAIL','No groups associated with project, assign groups before emailing.');

        const resultsList = SurveyResults.find({associatedProject: projectID}).fetch();

        // console.log('Results list', resultsList);

        // console.log('Groups', groupings);

        // Get students and their associated group.
        const studentsWithGroups = [];
        groupings.forEach(group => {
            group.students.forEach(studentID => {
                const associatedResult = loFind(resultsList, function(o) { return o._id === studentID });

                studentsWithGroups.push({
                    to: `${associatedResult.contactEmail}`,
                    from: 'Studio2AM01@donotreply.com',
                    subject: `PROJECT ASSIGNMENT "${project.projName}" You've been assigned to a group!`,
                    text: `Contratulations ${associatedResult.fullName}! \n\n You've been assigned to ${group.name} for project "${project.projName}". \n\n You tutor should be in contact with you shortly. \n\n Regards, \n\n Studio2AM01 2020`,
                });
                
            });
        });

        // console.log(studentsWithGroups);
        studentsWithGroups.forEach((student) => {
            Meteor.call('sendEmail', student.to, student.from, student.subject, student.text, function(error) {
                if (!error) {
                    console.log(`Sent email to ${student.to} successfully!`)
                } else {
                    console.log('Emailing student error',error);
                };
            });
        });
    },
    sendEmail(to, from, subject, text) {
        // Make sure that all arguments are strings.
        check([to, from, subject, text], [String]);
    
        // Let other method calls from the same client start running, without
        // waiting for the email sending to complete.
        this.unblock();
    
        Email.send({ to, from, subject, text });
    },
    deleteProject(projID) {
        // Payload is the whole project object including the groups array inside it
        // Check owner first
        if (!this.userId) throw new Meteor.Error(403, 'No permission, must be logged in.');
        const project = Projects.find({_id: projID});
        if (project.fetch().length < 1) throw new Meteor.Error(404, 'Could not find project with that ID');
        if (project.fetch()[0].owner !== this.userId) throw new Meteor.Error(403, 'No permission, you are not the owner of this project.');
        // End checking, do update now

        SurveyResults.remove({associatedProject: projID}, function(error) {
            if (error) {
                throw new Meteor.Error(403, error.reason);
            }
        });

        Surveys.remove({_id: project.fetch()[0].survey});
        Projects.remove({_id: projID});
    },
    deleteStudentResult(resultID, projID) {
        console.log(resultID, projID);
        // Payload is the whole project object including the groups array inside it
        // Check owner first
        if (!this.userId) throw new Meteor.Error(403, 'No permission, must be logged in.');
        const project = Projects.find({_id: projID});
        if (project.fetch().length < 1) throw new Meteor.Error(404, 'Could not find project with that ID');
        if (project.fetch()[0].owner !== this.userId) throw new Meteor.Error(403, 'No permission, you are not the owner of this project.');
        
        const targetResult = SurveyResults.findOne({_id: resultID});
        if (targetResult.associatedProject !== projID) throw new Meteor.Error(403, 'No permission, project and submission mismatch!');
        // End checking, do update now

        SurveyResults.remove({_id: resultID});
    }
})