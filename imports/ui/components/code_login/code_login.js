import './code_login.html';
Template.code_login.helpers({ 
    
}); 

Template.code_login.events({ 
    'submit #surveyCodeInputForm': function(event, template) { 
        event.preventDefault();
        const target = event.target;

        console.log(target.surveyCodeInput.value);
        // NOTE: Run find code before redirecting
        // For now we will just redirect until we have the actual survey collections ready.
        FlowRouter.go('App.survey', { _id: target.surveyCodeInput.value });  
    } 
}); 
