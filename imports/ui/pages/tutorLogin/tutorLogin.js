import './tutorLogin.html';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Template.App_tutorLogin.onCreated(function() { 
    // Login view is default mode
     this.loggingIn = new ReactiveVar(true);
});

Template.App_tutorLogin.helpers({
    loggingIn() {
        return Template.instance().loggingIn.get();
    }
})

Template.App_tutorLogin.events({ 
    'click #toggle-signup': function(templateevent, template) {
        event.preventDefault();
        Template.instance().loggingIn.set(false);
    },
    'click #toggle-login': function(event, template) { 
        event.preventDefault();
        Template.instance().loggingIn.set(true);
    },
    'submit #signup-form': function(event, template) {
        event.preventDefault();
        const target = event.target;

        // Add error handling on DOM
        if (target.signupPassword.value !== target.confPassword.value) {
            console.log("Confirm password failed.");
            swal("Oops!", "Confirm password failed.", "error");
            return;
        }
        const userData = {
            email: target.signupEmail.value,
            password: target.signupPassword.value,
            profile: {
                name: `${target.signupFName.value} ${target.signupLName.value}`,
                fistName: target.signupFName.value,
                lastName: target.signupLName.value,
                agreeCheck: target.agreeCheck.value,
            }
        }
         
        Accounts.createUser(userData, function(error) { 
            if (error) {
                console.log("Error signing up", error);
                swal("Oops!", error.message, "error");
            } else {
                console.log("Signup successful!");
                console.log("Signup DATA: ", userData);
                FlowRouter.go('/projects');
            }
        });
    },
    'submit #login-form': function(event, template) {
        event.preventDefault();
        const target = event.target;
        Meteor.loginWithPassword(
            target.loginEmail.value, 
            target.loginPassword.value, 
            function(error) {
                if (error) {
                    swal("Error logging in!", error.message, "error");
                    console.log("Error logging in: ", error);
                } else {
                    FlowRouter.go('/projects');
                }
            }
        );
    },
});