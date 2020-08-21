import './survey.html';

Template.survey.onCreated(function() {
    console.log('SURVEY ID FROM PARAMETERS', FlowRouter.getParam("_id"));
})

Template.survey.helpers({ 
    surveyCode() {
        return FlowRouter.getParam("_id");
    },
}); 

Template.survey.events({ 
    
}); 
