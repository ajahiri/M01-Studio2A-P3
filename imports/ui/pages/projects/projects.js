import './projects.html'

Template.App_projects.onCreated(function() {
    const self = this;
    self.projectsList = new ReactiveVar([]);
    Meteor.call('getUserProjects', function(error, result) {
        if (!error) {
            self.projectsList.set(result);
        } else {
            console.log(error);
        }
    });
    // Reactive Variable to determine projects page flow
    this.currentProjectFlow = new ReactiveVar(1);
    // Give the data some initial values
    this.currentProjectData = new ReactiveVar(
        {
            projectName: 'New Project',
            allocationMethod: 'automatic',
        }
    );
    // Switch to create new mode (link with existing aswell with an extra step)
    this.surveyMode = new ReactiveVar("init");
    Tracker.autorun(function() { 
         console.log('Project object data: ',self.currentProjectData.get());
    });
});

Template.App_projects.events({ 
    'click #new-project': function(event, template) {
        event.preventDefault();
        // Shows newProject flow
        Template.instance().currentProjectFlow.set(2);
    },
    'click .back-button': function(event) {
        event.preventDefault();
        const currFlowPosition = Template.instance().currentProjectFlow.get();
        Template.instance().currentProjectFlow.set(currFlowPosition - 1);
    },
    'click .form-check-input': function(event) {
        let currData = Template.instance().currentProjectData.get();
        currData.allocationMethod = event.target.value;
        Template.instance().currentProjectData.set(currData);
    },
    'click #newProjectNext': function(event) {
        event.preventDefault();
        let currData = Template.instance().currentProjectData.get();
        let projectNameInput = document.getElementById('projectNameInput').value;
        const projectGroupSize = document.getElementById('projectGroupSize').value;
        currData.projectGroupSize = projectGroupSize;
        if (projectNameInput != '' && projectNameInput != undefined) {
            currData.projectName = projectNameInput;
        }
        Template.instance().currentProjectData.set(currData);
        Template.instance().currentProjectFlow.set(
            Template.instance().currentProjectFlow.get() + 1
        );
    },
    'click .create-new-survey-button': function(event) {
        event.preventDefault();
        console.log('Create new survey');
        // Switch to the create survey mode page
        Template.instance().surveyMode.set("new");
    },
    'click .use-existing-survey-button': function(event) {
        event.preventDefault();
        console.log('Create new survey');
        // Switch to the create survey mode page
        Template.instance().surveyMode.set("existing");
    }
});

Template.App_projects.helpers({ 
    currentProjectFlow() {
        return Template.instance().currentProjectFlow.get();
    },
    currentProjectData() {
        return Template.instance().currentProjectData.get();
    },
    surveyMode() {
        return Template.instance().surveyMode.get();
    },
    projectsList(){
        // Meteor.subscribe('countsByRoom', Session.get('roomId'));
        return Template.instance().projectsList.get();
    },
}); 

