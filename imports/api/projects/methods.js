import { Meteor } from 'meteor/meteor';
import { Projects } from './projects';

Meteor.methods({
    insertProject(payload) {
        if (!this.userId) throw new Meteor.Error('Permission error.', 'You must be logged in.');

        // Mutate the payload to projects schema
        return 'SUCCESS';
        // Projects.insert({
        //     projName: name,
        //     groups: listGroups,
        //     allocationType: allocType,
        //     survey: surveyID,
        // });
    },
})