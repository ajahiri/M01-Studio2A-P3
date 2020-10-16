import './dashboard.html';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
// Only for login/signup showcase, should not have too much code for pages
Template.App_dashboard.events({ 
    'click #changeNameButton': function(event, template) { 
        event.preventDefault();
        event.stopPropagation();
        console.log(Meteor.user());
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.name":$('#changeName')[0].value}})
    },
    'click #changePasswordButton': function(event, template) {
        event.preventDefault();
        const oldPassword = $('#originalPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        if (newPassword !== confirmPassword) {
            swal("Error!", "Confirm password must match new password.", "error");
            return;
        };

        Accounts.changePassword(oldPassword, newPassword, function(error) {
            if (!error) {
                swal("Sucess!", "Your password was successfully changed.", "success");
            } else {
                swal("Error changing password!", error.reason, "error");
            }
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