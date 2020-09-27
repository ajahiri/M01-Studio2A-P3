import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects';

Meteor.publish('projectByID', function(projectID) {
    try {
        const result = Projects.find({_id: projectID});
        if (result.fetch().length < 1) throw new Meteor.Error(404, 'Could not find project');
        return result;
    } catch (error) {
        throw new Meteor.Error(404, 'Could not find project');
    }
});