import './dashboard.html';
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base';
// Only for login/signup showcase, should not have too much code for pages
Template.App_dashboard.events({ 
    'click #changeNameButton': function(event, template) { 
        event.preventDefault();
        event.stopPropagation();
        console.log(Meteor.user());
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.name":$('#changeName')[0].value}})
    } ,
    'click #changePassword': function(event, template) { 
        event.preventDefault();
        const oldPassword = $('#oldPassword').val();
        const newPassword = $('#newPassword').val();
        const confPassword = $('#confirmPassword').val();

        if (newPassword !== confPassword) {
            console.log("Passwords must match!");
        } else {
            Accounts.changePassword(oldPassword, newPassword, function(error) {
                if (!error) {
                    console.log('Successfully changed password!');
                } else {
                    console.log('Password change failed', error.reason);
                }
            })
        }
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