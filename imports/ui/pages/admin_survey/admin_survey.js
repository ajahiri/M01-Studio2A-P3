import './admin_survey.html';
import '../../components/stateful_submit/stateful_submit'; // Import stateful button component
import { Template } from 'meteor/templating';
import '../../../api/projects/methods';
import '../survey_success/survey_success';

Template.admin_survey.helpers({
    questionsArr(){
        return Template.instance().questionsArr.get();
    },
    importanceValueDisplay(){
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
});

Template.admin_survey.onCreated(function() {

    this.questionsArr = new ReactiveVar([]);
    this.importanceValueDisplay = new ReactiveVar(50);
    this.surveyTitle = new ReactiveVar('New Survey');   // Default name to 'New Survey'
    // console.log('self.questions',this);

    // For stateful loading button
    this.isLoading = new ReactiveVar(false);

    // For showing success page after project add
    this.showSuccessPage = new ReactiveVar(false);

    this.surveyCode = new ReactiveVar('');

    // let defaultQuestions = [
    //     {question: "First and Last Name: ", importance: null},
    //     {question: "Email: ", importance: null}
    // ];
    // this.questionsArr.set(defaultQuestions);
});

Template.admin_survey.events({
    'click #addQuestion': function(evt, template) {
        let questionsArray = template.questionsArr.get();
        questionsArray.push({ 
            question: $('#questionTitle')[0].value,
            importance: $('#importanceValue')[0].value
        });
        template.questionsArr.set(questionsArray);
    },
    'change #importanceValue': function(evt, template) {
        template.importanceValueDisplay.set(evt.currentTarget.value);
    },
    'click #create-survey': function(event, template) {
        Template.instance().isLoading.set(true);
        const instance = Template.instance();
        
        const projectPayload = {
            ...Template.instance().data.projectData,            // Project data passed in from project creation form
            surveyTitle: Template.instance().surveyTitle.get(),
            questions: Template.instance().questionsArr.get(),        // Get data from questions array
        };

        console.log(projectPayload);

        Meteor.call('insertProject', projectPayload, function(error, result) {
            if (!error) {
                console.log('SUCCESSFULLY ADDED PROJECT', result);
                instance.isLoading.set(false);
                instance.surveyCode.set(result);
                instance.showSuccessPage.set(true);
            } else {
                console.log(error);
                instance.isLoading.set(false);
            }
        });
    },
    'change #survey_name': function(event, template) {
        event.preventDefault();
        Template.instance().surveyTitle.set(event.currentTarget.value);
    }
});

Template.question_page.helpers({
    importanceVal(){
        return Template.instance().importanceVal.get();
    }
});

Template.question_page.onCreated(function() {
    this.importanceVal = new ReactiveVar(this.data.importance);
});

Template.question_page.events({
    'change #userAnswer': function(evt, template) {
        template.importanceVal.set(evt.currentTarget.value);
    },
});
 