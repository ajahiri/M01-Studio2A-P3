import './survey_success.html'


Template.App_surveysuccess.helpers({ 
    surveyCode() {
        return Template.instance().data.surveyCode;
    },
    surveyLink() {
        return Meteor.absoluteUrl('survey/' + Template.instance().data.surveyCode);
    }
}); 

Template.App_surveysuccess.events({ 
    
}); 
