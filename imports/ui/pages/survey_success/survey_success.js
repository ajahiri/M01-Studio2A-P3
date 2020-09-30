import './survey_success.html'


Template.App_surveysuccess.onCreated(function() {
    this.surveyCode = new ReactiveVar(FlowRouter.getQueryParam("code"));
});


Template.App_surveysuccess.helpers({ 
    surveyCode() {
        return Template.instance().surveyCode.get();
    },
    surveyLink() {
        return Meteor.absoluteUrl('survey/' + Template.instance().surveyCode.get());
    }
}); 

Template.App_surveysuccess.events({ 
    
}); 
