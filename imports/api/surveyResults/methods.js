import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { SurveyResults } from './surveyResult';

Meteor.methods({
    insertSurveyResult(payload) {
        // Add unique ID and date created
        payload._id = Random.id();
        payload.createdAt = Date.now();

        // console.log(payload);

        // Return ID of new survey object
        return SurveyResults.insert(payload);
    }
})