import './editgroups.html'

Template.App_editgroups.helpers({
    currentProject(){
        return Template.instance().currentProject.get();
    }
});

Template.App_editgroups.onCreated(function() {
    const self = this;
    let id = FlowRouter.getParam("_id");

    self.currentProject = new ReactiveVar([]);
    Meteor.call('getProject', id, function(error, result) {
        if (!error) {
            self.currentProject.set(result);
        } else {
            console.log(error);
        }
    });

    // let membersList = ["Hsol4kif3kiH8GAh4", "Rrkp7kJE6yNfmzJxH"];
    // Meteor.call('groupsInsert', membersList , id, function(error, result) {
    //     if (!error) {
    //         console.log(result);
    //         // self.currentProject.set(result);
    //     } else {
    //         console.log(error);
    //     }
    // });
    console.log(self.currentProject);

});

// Template.App_editgroups.events({
//     'change #userAnswer': function(evt, template) {
//         template.currentProject.set(evt.currentTarget.value);
//     },
// });
 