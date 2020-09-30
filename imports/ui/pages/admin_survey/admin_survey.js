import './admin_survey.html';
import '../../components/stateful_submit/stateful_submit'; // Import stateful button component
import {
    Template
} from 'meteor/templating';
import '../../../api/projects/methods';
import '../survey_success/survey_success';
import {isAlphanumeric} from 'validator';

Template.admin_survey.helpers({
    questionsArr() {
        return Template.instance().questionsArr.get();
    },
    importanceValueDisplay() {
        return Template.instance().importanceValueDisplay.get();
    },
    isLoading() {
        return Template.instance().isLoading.get();
    },
    showSuccessPage() {
        return Template.instance().showSuccessPage.get();
    },
    surveyCode() {
        return Template.instance().surveyCode.get();
    },
    enablequestions() {
        return Template.instance().enablequestions.get();
    }
});

Template.admin_survey.onCreated(function () {
    const self = this;
    this.questionsArr = new ReactiveVar([]);
    this.importanceValueDisplay = new ReactiveVar(50);
    this.enablequestions = new ReactiveVar(false);
    this.surveyTitle = new ReactiveVar('New Survey'); // Default name to 'New Survey'
    console.log(Template.instance(), Template.currentData(), "emk");

    let id = FlowRouter.getParam("_id");

    if (id != undefined || id != '') {
        Meteor.call('getSurvey', id, function (error, result) {
            if (!error) {
                console.log(error, result);
                self.questionsArr.set(result.questions);
                self.enablequestions.set(true);
    
            } else {
                console.log(error, result);
            }
        });
    }

    // For stateful loading button
    this.isLoading = new ReactiveVar(false);

    // For showing success page after project add
    this.showSuccessPage = new ReactiveVar(false);

    this.surveyCode = new ReactiveVar('');
});
// Template.admin_survey.onRendered(function () {

//     let id = FlowRouter.getParam("_id");
//     Meteor.call('getSurvey', id, function (error, result) {
//         if (!error) {
//             this.questionsArr.set(result.questions);
//             console.log(error, result.questions);
//         } else {
//             console.log(error, result);
//         }
//     });
// });

Template.admin_survey.events({
    'click #addQuestion': function (evt, template) {
        let questionsArray = template.questionsArr.get();
        if (!isAlphanumeric($('#questionTitle')[0].value.replace(/\s/g,'')) || $('#questionTitle')[0].value.length < 3) {
            swal("Invalid input!", "Question title must be alpha-numeric, minimum 3 characters.", "error");
            return;
        }
        questionsArray.push({
            question: $('#questionTitle')[0].value,
            importance: $('#importanceValue')[0].value
        });
        template.questionsArr.set(questionsArray);
    },
    'change #importanceValue': function (evt, template) {
        template.importanceValueDisplay.set(evt.currentTarget.value);
    },
    'click #create-survey': function (event, template) {
        Template.instance().isLoading.set(true);
        const instance = Template.instance();
        let projectPayload;

        let allocationMethod = FlowRouter.getParam("allocationMethod");
        let projectGroupSize = FlowRouter.getParam("projectGroupSize");
        let projectName = FlowRouter.getParam("projectName");

        if (!isAlphanumeric(Template.instance().surveyTitle.get().replace(/\s/g,'')) || Template.instance().surveyTitle.get().replace(/\s/g,'').length < 3) {
            swal("Invalid input!", "Survey title must be alpha-numeric, minimum 3 characters.", "error");
            Template.instance().isLoading.set(false);
            return;
        }
        if (Template.instance().questionsArr.get().length < 1 && 
        (allocationMethod === "automatic" || Template.instance().data.projectData.allocationMethod === "automatic")) {
            swal("Invalid input!", "Must have at least one question in your survey!", "error");
            Template.instance().isLoading.set(false);
            return;
        }

        

        if (!Template.instance().data.projectData) {
            projectPayload = {
                allocationMethod,
                projectGroupSize,
                projectName,
                surveyTitle: Template.instance().surveyTitle.get(),
                questions: Template.instance().questionsArr.get(), // Get data from questions array
            };
        } else {
            projectPayload = {
                ...Template.instance().data.projectData, // Project data passed in from project creation form
                surveyTitle: Template.instance().surveyTitle.get(),
                questions: Template.instance().questionsArr.get(), // Get data from questions array
            };
        }

        console.log(projectPayload);

        Meteor.call('insertProject', projectPayload, function (error, result) {
            if (!error) {
                console.log('SUCCESSFULLY ADDED PROJECT', result);
                instance.isLoading.set(false);
                FlowRouter.go(`/surveysuccess?code=${result}`);
            } else {
                console.log(error);
                instance.isLoading.set(false);
            }
        });
    },
    'change #survey_name': function (event, template) {
        event.preventDefault();
        Template.instance().surveyTitle.set(event.currentTarget.value);
    }
});

Template.question_page.helpers({
    importanceVal() {
        return Template.instance().importanceVal.get();
    }
});

Template.question_page.onCreated(function () {
    this.importanceVal = new ReactiveVar(this.data.importance);
});

Template.question_page.events({
    'change #userAnswer': function (evt, template) {
        template.importanceVal.set(evt.currentTarget.value);
    },
});