import './nav.html';

Template.navbar.helpers({
    user() {
        return Meteor.user();
    }
});

Template.navbar.events({
    'click .projectLink': function(event) {
        
        FlowRouter.reload();
    }
})

Template.navbar.onCreated(function() {

    self.user = new ReactiveVar(Meteor.user());
    console.log(self.user);

});