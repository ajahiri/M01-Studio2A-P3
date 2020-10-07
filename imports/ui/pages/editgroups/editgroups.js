import './editgroups.html'
import { Projects } from '../../../api/projects/projects';
import { SurveyResults } from '../../../api/surveyResults/surveyResult';
import loPullAt from 'lodash/pullAt';

Template.App_editgroups.onCreated(function() {
    const self = this;
    let id = FlowRouter.getParam("_id");

    self.currentProject = new ReactiveVar({});
    self.projectNotFound = new ReactiveVar(false);
    self.currentResultViewID = new ReactiveVar("");
    self.projectGroupings = new ReactiveVar();
    self.numOfGroups = new ReactiveVar(0);
    self.surveyName = new ReactiveVar("Survey Name");
    self.isEmailLoading = new ReactiveVar(false);
    self.studentName = new ReactiveVar("Student");
    self.currentStudentResult = new ReactiveVar('');

    Tracker.autorun(function() { 
        Meteor.subscribe('projectByID', id, {
            onReady: function () { 
                const result = Projects.find({_id: id}).fetch()[0];
                console.log(result);
                const call = Meteor.call('getSurvey', result.survey, (error, surveyResult) => {
                    if (!error) {
                        console.log(surveyResult.surveyName);
                        self.surveyName.set(surveyResult.surveyName);
                    } else {
                        console.log(error);
                    };
                });
                if (result.length != 0) {
                    self.currentProject.set(result);
                } else {
                    self.projectNotFound.set(true);
                }
            },
            onStop: function () {
                // Handle error sate where the id was not associated with anything
                console.log('PROJECT NOT FOUND!');
                self.projectNotFound.set(true);
            }
        });
    
        // Get results associate with this project using project id
        Meteor.subscribe('surveyResultByProject', id);
        
    });
    
});

Template.App_editgroups.onRendered(function() {
    $('.toast').toast({animation: true, autohide: true, delay: 3000});
});

Template.App_editgroups.helpers({
    currentProject(){
        return Template.instance().currentProject.get();
    },
    surveyName() {
        return Template.instance().surveyName.get();
    },
    projectNotFound() {
        return Template.instance().projectNotFound.get();
    },
    studentResults() {
        console.log(SurveyResults.find().fetch());
        return SurveyResults.find({associatedProject: FlowRouter.getParam("_id")}).fetch();
    },
    resultCount() {
        return SurveyResults.find({associatedProject: FlowRouter.getParam("_id")}).count();
    },
    studentAnswer() {
        return SurveyResults.findOne({_id: Template.instance().currentResultViewID.get()});
    },
    surveyLink() {
        const currentProject = Template.instance().currentProject.get();
        return Meteor.absoluteUrl('survey/' + currentProject._id);
    },
    studentGroupings() {
        const instance = Template.instance();
        const currentProject = Template.instance().currentProject.get();
        const responses = SurveyResults.find({associatedProject: FlowRouter.getParam("_id")}).fetch();
        if (currentProject.groupSize > 0) {
            instance.numOfGroups.set(Math.ceil(responses.length/currentProject.groupSize));
        }
        return Template.instance().numOfGroups.get();
    },
    groupList() {
        const groupsDropdown = [];
        for (let index = 1; index <= Template.instance().numOfGroups.get(); index++) {
            // console.log('list index', index);
            groupsDropdown.push({
                name: `Group ${index}`,
                number: index,
            })
        }
        // console.log('size of list', groupsDropdown);
        return groupsDropdown;
    },
    currentStudentGroup(studentObject) {
        // Finds the associated group for each student
        // console.log(studentObject);
        const project =  Projects.findOne({_id: FlowRouter.getParam("_id")});
        const groupsArray = project.groups;
        let result = "No group";
        let hasFound = false;

        if (!Array.isArray(groupsArray) || !project.groups) return result;
        // Find student in array, display the correct group
        groupsArray.forEach((group, grpIndex) => {
            if (hasFound === true) return;
            if (group.students) {
                group.students.forEach((id, stuIndex) => {
                    if (id === studentObject._id) {
                        hasFound = true;
                        result = `Group ${grpIndex+1}`
                        return;
                    }
                })
            };
        });
        return result;
    },
    isEmailLoading() {
        return Template.instance().isEmailLoading.get();
    },
    studentName() {
        return Template.instance().studentName.get();
    }
});

Template.App_editgroups.events({
    // 'change #userAnswer': function(evt, template) {
    //     template.currentProject.set(evt.currentTarget.value);
    // },
    'click .showResultButton': function(event) {
        Template.instance().currentResultViewID.set(event.target.id);
    },
    'click .group-selector': function(event, template) {
        const studentResultID = event.target.id;
        const desiredGroup = event.target.getAttribute("data");

        const studentName = $(event.target).parent().parent().parent().parent().children()[1].innerHTML;
        Template.instance().studentName.set(studentName);

        const project = Projects.findOne({_id: FlowRouter.getParam("_id")});
        const currentGroupArray = project.groups;

        // "Groups" array of objs shape
        // groups = [
        //     {
        //         number: 1,
        //         name: "Group 1",
        //         students: ["studentResultID1", "studentResultID2"],
        //     },
        //     {
        //         number: 2,
        //         name: "Group 2",
        //         students: ["studentResultID3", "studentResultID4"],
        //     }
        // ]

        // Search group array to see if already assigned or not.
        // No assign = add/ already assigned = remove current and add new
        let hasFound = false;
        let groupIndex = -1;
        let studentIndex = -1;
        currentGroupArray.forEach((group, grpIndex) => {
            if (hasFound === true) return; // Kill loop if found
            // Students array may not exist yet & only continue if 
            if (group.students) {
                group.students.forEach((id, stuIndex) => {
                    // console.log('checking ID ' + id);
                    if (id === studentResultID) {
                        hasFound = true;
                        studentIndex = stuIndex;
                        groupIndex = grpIndex;
                        return;
                    }
                })
            };
        });

        // Check the array size and shape first
        if (currentGroupArray.length < Template.instance().numOfGroups.get()) {
            console.log('GROUP ARRAY IS TOO SMALL, NEED TO RESIZE');
            // Resize the array to needed amount of groups (start from end of current array)
            // Only add the groups that are needed
            // Will handle scenarios where the amount of groups needed has changed as more results have come in
            for (let index = currentGroupArray.length; index < Template.instance().numOfGroups.get(); index++) {
                console.log(`Adding an object to groups array, current index: ${index}`);
                currentGroupArray.push({
                    number: index + 1,
                    name: `Group ${index + 1}`,
                    students: [],
                })
            }
        }

        if (hasFound === false) {
            // Add the student to the array
            // Should be the right size now so we can add without problems
            currentGroupArray[desiredGroup - 1].students.push(studentResultID);
        } else {
            console.log(`STUDENT IS ALREADY ASSIGNED A GROUP at group index ${groupIndex} and student index ${studentIndex}`);
            // currentGroupArray[groupIndex].students.splice(studentIndex);
            // Pull student from current group
            loPullAt(currentGroupArray[groupIndex].students, studentIndex);
            // Add student to new group
            currentGroupArray[desiredGroup - 1].students.push(studentResultID);
        }

        project.groups = currentGroupArray;

        Meteor.call('updateGroupsArray', project, function(error) {
            if (!error) {
                console.log("SUCCESSFULLY UPDATED GROUPS!");
                $('#editGroupToast').toast('show')
            } else {
                console.log('UPDATE GROUPS ERROR', error);
            }
        });
    },
    'click #doRandomAllocation': function(event) {
        Meteor.call('generateRandomAllocation', Projects.findOne({_id: FlowRouter.getParam("_id")}), function(error) {
            if (!error) {
                console.log("SUCCESSFULLY UPDATED GROUPS!");
                swal("Success!", "Random allocation completed successfully.", "success");
            } else {
                console.log('RANDOM ALLOCATION FAILED', error);
                swal("API Error occured!", error.reason, "error");
            }
        })
    },
    'click #doAutomaticAllocation': function () {
        // Meteor.call('createGroups_AUTO', Template.instance().currentProject.get()._id);
        Meteor.call('generateAutomaticAllocation', Projects.findOne({_id: FlowRouter.getParam("_id")}), function(error) {
            if (!error) {
                console.log("SUCCESSFULLY UPDATED GROUPS!");
                swal("Success!", "Algorithmic allocation completed successfully.", "success");
            } else {
                console.log('RANDOM ALLOCATION FAILED', error);
                swal("API Error occured!", error.reason, "error");
            }
        })
    },
    'click #sendEmailResults': function(event, template) {
        const instance = Template.instance();
        instance.isEmailLoading.set(true);
        Meteor.call('sendStudentEmails', FlowRouter.getParam("_id"), function(error) {
            if (!error) {
                console.log("SUCCESSFULLY UPDATED GROUPS!");
                swal("Success!", "Successfully notified students of grouping assignments.", "success");
                instance.isEmailLoading.set(false);
            } else {
                console.log('Error sending emails!', error);
                swal("Error sending Emails.", error.reason, "error");
                instance.isEmailLoading.set(false);
            }
        })
    },
    'click #deleteProjectButton': function(event, template) {
        console.log('DELETE PROJECT WITH ID:', FlowRouter.getParam("_id"));
        Meteor.call('deleteProject', FlowRouter.getParam("_id"), function(error) {
            if (!error) {
                FlowRouter.go('/projects');
                console.log("SUCCESSFULLY DELETED PROJECT!");
                swal("Success!", "Successfully deleted project and its associated documents.", "success");
            } else {
                console.log('Error deleting project!', error);
                swal("Error deleting project.", error.reason, "error");
            }
        })
    },
    'click .triggerStudentResultDelete': function(event, template) {
        console.log('DELTE STUDENT RESULT WITH ID: ', event.target.id);
        Template.instance().currentStudentResult.set(event.target.id);
    },
    'click #deleteStudentResultButton': function(event, template) {
        const targetResult = Template.instance().currentStudentResult.get();
        const instance = Template.instance();
        Meteor.call('deleteStudentResult', targetResult, FlowRouter.getParam("_id"), function(error) {
            if (!error) {
                instance.currentStudentResult.set('');
                $('#studentAnswerModal').modal('hide');
                swal("Success!", "Successfully deleted student submission.", "success");
            } else {
                swal("Error deleting submission.", error.reason, "error");
            }
        })
    }
});