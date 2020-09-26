import './survey.html';
import {Surveys} from '../../../api/survey/survey';

Template.survey.onCreated(function() {
    const self = this;
    console.log('SURVEY ID FROM PARAMETERS', FlowRouter.getParam("_id"));
    self.surveyData = new ReactiveVar();


    Meteor.subscribe('studentSurvey', FlowRouter.getParam("_id"), {
        onReady: function () { 
            self.surveyData.set(Surveys.findOne());
            // console.log('survey data', self.surveyData.get());      
        }
    });

})

Template.survey.onRendered(function() {

})

Template.survey.helpers({ 
    surveyCode() {
        return FlowRouter.getParam("_id");
    },
    surveyData() {
        return Template.instance().surveyData.get();
    }
}); 

Template.survey.events({ 
    'submit #studentSurveyForm'(event, target) {
        event.preventDefault();

        const surveyData = Template.instance().surveyData.get();

        // Get data from form
        const data = event.target;
        const studentReponse = {
            surveyID: surveyData._id,
            fullName: data.fullName.value,
            contactEmail: data.contactEmail.value,
            answers: [],
        }

        surveyData.questions.forEach((question) => {
            const id = question._id;
            const answer = {
                questionID: question._id,
                question: question.question,
                answer: document.getElementById(id).value,
                weight: question.weight,
            }
            studentReponse.answers.push(answer);
        })

        // console.log('Student response', studentReponse);

        Meteor.call('insertSurveyResult', studentReponse);
    }
}); 

Template.surveyQuestion.onCreated(function() {
    this.sliderVal = ReactiveVar(50);
    // console.log('Current question object data', Template.currentData());
});

Template.surveyQuestion.events({
    'change .form-control-range'(event) {
        Template.instance().sliderVal.set(event.target.value);
    }
})

Template.surveyQuestion.helpers({
    sliderVal(questionID) {
        return Template.instance().sliderVal.get();
    }
})
