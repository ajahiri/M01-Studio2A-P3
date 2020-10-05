import { Meteor } from 'meteor/meteor';
import { Surveys } from './survey';

Meteor.methods({
    insertSurvey(questions) {
        if (!this.userId) throw new Meteor.Error('Permission error.', 'You must be logged in.');
        const mutatedQuestions = questions.map((question) => {
            return {
                question: question.question,
                weight: question.importance,
            }
        });
        const survey = {
            questions: mutatedQuestions,
            owner: this.userId,
        }

        // Return ID of new survey object
        return Surveys.insert(survey);
    },
})