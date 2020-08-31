import './projects.html'

Template.App_projects.events({ 
    'click #new-project': function(event, template) {
        event.preventDefault();
        FlowRouter.go('/projects2');
    }
});
