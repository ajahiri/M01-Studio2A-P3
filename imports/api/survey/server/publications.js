import { Meteor } from 'meteor/meteor';
import { Surveys } from '../survey';
import { Projects } from '../../projects/projects';

Meteor.publish('studentSurvey', function(surveyCode) {
    const associatedProject = Projects.findOne({_id: surveyCode});

    return Surveys.find({_id: associatedProject.survey});
});