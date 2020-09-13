import './survey.html';
import {Surveys} from '../../../api/survey/survey';

Template.survey.onCreated(function() {
    console.log('SURVEY ID FROM PARAMETERS', FlowRouter.getParam("_id"));

    // Subscribe to specific survey using id
    Meteor.subscribe('studentSurvey', FlowRouter.getParam("_id"));
})

Template.survey.onRendered(function() {

})

Template.survey.helpers({ 
    surveyCode() {
        return FlowRouter.getParam("_id");
    },
    surveyData() {
        const surveyData = Surveys.findOne();
        console.log('ASSOCIATED SURVEYDATA', surveyData);
        return surveyData;
    }
}); 

Template.survey.events({ 
    
}); 
