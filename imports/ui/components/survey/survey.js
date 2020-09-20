import './survey.html';
import {Surveys} from '../../../api/survey/survey';

Template.survey.onCreated(function() {
    const self = this;
    console.log('SURVEY ID FROM PARAMETERS', FlowRouter.getParam("_id"));
    self.surveyQuestions = new ReactiveVar([]);
    self.surveyName = new ReactiveVar([]);


    Meteor.subscribe('studentSurvey', FlowRouter.getParam("_id"), {
        onReady: function () { 
            self.surveyQuestions.set(Surveys.findOne().questions);
            self.surveyName.set(Surveys.findOne().surveyName);
            console.log(self.surveyQuestions.get());      
        }
    });

})

Template.survey.onRendered(function() {

})

Template.survey.helpers({ 
    surveyCode() {
        return FlowRouter.getParam("_id");
    },
    surveyQuestions() {
        return Template.instance().surveyQuestions.get();
    },
    surveyName() {
        return Template.instance().surveyName.get();
    }
}); 

Template.survey.events({ 
    
}); 
