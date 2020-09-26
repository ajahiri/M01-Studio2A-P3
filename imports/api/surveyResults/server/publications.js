import { Meteor } from 'meteor/meteor';
import { Projects } from '../../projects/projects';
import { SurveyResults } from '../surveyResult';

Meteor.publish('surveyResultByProject', function(projectID) {
    return SurveyResults.find({associatedProject: projectID});
});