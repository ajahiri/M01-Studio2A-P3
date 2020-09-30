import './survey.html';
import {Surveys} from '../../../api/survey/survey';
import {isEmail, isAlpha} from 'validator';

Template.survey.onCreated(function() {
    const self = this;
    console.log('SURVEY ID FROM PARAMETERS', FlowRouter.getParam("_id"));
    self.surveyData = new ReactiveVar();
    self.isLoading = new ReactiveVar(false);
    self.showSuccessPage = new ReactiveVar(false);
    self.surveyNotFound = new ReactiveVar(false);

    Meteor.subscribe('studentSurvey', FlowRouter.getParam("_id"), {
        onReady: function () { 
            // console.log('survey data', self.surveyData.get());
            const result = Surveys.find().fetch();
            if (result.length != 0) {
                self.surveyData.set(result[0]);
            }     
        },
        onStop: function () {
            // Handle error sate where the id was not associated with anything
            self.surveyNotFound.set(true);
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
        const instance = Template.instance();
        return instance.surveyData.get();
    },
    isLoading() {
        return Template.instance().isLoading.get();
    },
    showSuccessPage() {
        return Template.instance().showSuccessPage.get();
    },
    surveyNotFound() {
        return Template.instance().surveyNotFound.get();
    }
}); 

Template.survey.events({ 
    'submit #studentSurveyForm'(event, target) {
        event.preventDefault();
        const instance = Template.instance();

        // Get data from form
        const data = event.target;

        if (!isAlpha(data.fullName.value.replace(/\s/g,''))) {
            swal("Invalid input!", "Full name is of invalid type.", "error");
            return;
        }

        if (!isEmail(data.contactEmail.value)) {
            swal("Invalid input!", "Email must be of valid format.", "error");
            return;
        }

        instance.isLoading.set(true);

        const surveyData = instance.surveyData.get();
        
        const studentReponse = {
            surveyID: surveyData._id,
            associatedProject: FlowRouter.getParam("_id"),
            fullName: data.fullName.value,
            contactEmail: data.contactEmail.value,
            answers: [],
        }

        surveyData.questions.forEach((question) => {
            const id = question._id;
            const answer = {
                questionID: id,
                question: question.question,
                answer: document.getElementById(id).value,
                weight: question.weight,
            }
            studentReponse.answers.push(answer);
        })

        // console.log('Student response', studentReponse);

        Meteor.call('insertSurveyResult', studentReponse, function(error, result) {
            if (!error) {
                instance.isLoading.set(false);
                instance.showSuccessPage.set(true);
            } else {
                console.log(error);
                instance.isLoading.set(false);
            }
        });
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
    sliderVal() {
        return Template.instance().sliderVal.get();
    }
})
