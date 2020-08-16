import './dashboard.html';

// Only for login/signup showcase, should not have too much code for pages
Template.App_dashboard.events({ 
    'click #logoutButton': function(event, template) { 
         Meteor.logout(function() { 
            FlowRouter.go('/tutor-login');
         });
    } 
});