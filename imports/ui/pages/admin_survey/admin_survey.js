import './admin_survey.html';
import { Template } from 'meteor/templating';

Template.admin_survey.helpers({
    questionsArr(){
        return Template.instance().questionsArr.get();
    },importanceValueDisplay(){
        return Template.instance().importanceValueDisplay.get();
    }
    
});

Template.admin_survey.onCreated(function() {

    this.questionsArr = new ReactiveVar([]);
    this.importanceValueDisplay = new ReactiveVar(50);
    // console.log('self.questions',this);

});

Template.admin_survey.events({
    'click #addQuestion': function(evt, template) {
        let questionsArray = template.questionsArr.get();
        questionsArray.push({ 
            question: $('#questionTitle')[0].value,
            importance: $('#importanceValue')[0].value
        });
        template.questionsArr.set(questionsArray);
    },'change #importanceValue': function(evt, template) {
        template.importanceValueDisplay.set(evt.currentTarget.value);
    },
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
 