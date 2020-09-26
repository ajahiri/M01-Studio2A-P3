import './editgroups.html'
import { Projects } from '../../../api/projects/projects';
import { SurveyResults } from '../../../api/surveyResults/surveyResult';

Template.App_editgroups.onCreated(function() {
    const self = this;
    let id = FlowRouter.getParam("_id");

    self.currentProject = new ReactiveVar();
    self.projectNotFound = new ReactiveVar(false);
    self.currentResultViewID = new ReactiveVar("");

    Meteor.subscribe('projectByID', id, {
        onReady: function () { 
            const result = Projects.find().fetch();
            console.log(result);
            if (result.length != 0) {
                self.currentProject.set(result[0]);
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
    Meteor.subscribe('surveyResultByProject', id, {
        onReady: function () { 
        },
        onStop: function () {
        }
    });

    // Meteor.call('getProject', id, function(error, result) {
    //     if (!error) {
    //         self.currentProject.set(result);
    //     } else {
    //         console.log(error);
    //     }
    // });

    // let membersList = ["Hsol4kif3kiH8GAh4", "Rrkp7kJE6yNfmzJxH"];
    // Meteor.call('groupsInsert', membersList , id, function(error, result) {
    //     if (!error) {
    //         console.log(result);
    //         // self.currentProject.set(result);
    //     } else {
    //         console.log(error);
    //     }
    // });

    console.log(self.currentProject.get());

});

Template.App_editgroups.helpers({
    currentProject(){
        return Template.instance().currentProject.get();
    },
    projectNotFound() {
        return Template.instance().projectNotFound.get();
    },
    studentResults() {
        console.log(SurveyResults.find().fetch());
        return SurveyResults.find({associatedProject: FlowRouter.getParam("_id")}).fetch();
    },
    studentAnswer() {
        return SurveyResults.findOne({_id: Template.instance().currentResultViewID.get()});
    },
    formatDate(input) {
        
    }
});

Template.App_editgroups.events({
    // 'change #userAnswer': function(evt, template) {
    //     template.currentProject.set(evt.currentTarget.value);
    // },
    'click .showResultButton': function(event) {
        Template.instance().currentResultViewID.set(event.target.id);
    }
});
 