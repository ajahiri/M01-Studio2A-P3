import './dashboard.html';
import { Meteor } from 'meteor/meteor'
// Only for login/signup showcase, should not have too much code for pages
Template.App_dashboard.events({ 
    'click #logoutButton': function(event, template) { 
         Meteor.logout(function() { 
            FlowRouter.go('/tutor-login');
         });
    } 
});

Template.App_dashboard.helpers({
    user() {
        return Template.instance().user;
    }
});

Template.App_dashboard.onCreated(function(){

    self.user = new ReactiveVar(Meteor.user());
    console.log('self.user',self.user);

    console.log('Meteor.user()',Meteor.user());
});