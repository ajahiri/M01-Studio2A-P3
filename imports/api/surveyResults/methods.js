import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { SurveyResults } from './surveyResult';

Meteor.methods({
    insertSurveyResult(payload) {
        // Add unique ID and date created
        payload._id = Random.id();
        payload.createdAt = new Date();

        let totalScore = 0;

        payload.answers.forEach(answer => {
            totalScore += (answer.answer * (answer.weight/100));
        });

        totalScore = parseFloat(totalScore.toFixed(2));

        payload.studentScore = totalScore;

        console.log(payload);

        // Return ID of new survey object
        return SurveyResults.insert(payload);
    }
})