import { Meteor } from 'meteor/meteor';
import { Surveys } from '../survey';
import { Projects } from '../../projects/projects';

Meteor.publish('studentSurvey', function(surveyCode) {
    const associatedProject = Projects.findOne({_id: surveyCode});

    console.log('Project found', associatedProject);

    try {
        const result = Surveys.find({_id: associatedProject.survey})
        return result;
    } catch (error) {
        throw new Meteor.Error(404, 'Could not find project');
    }
});