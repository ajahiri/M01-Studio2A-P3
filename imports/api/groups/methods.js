import { Meteor } from 'meteor/meteor';
import { Groups } from './group';
import { SurveyResults } from '../surveyResults/surveyResult';
import { Projects } from '../projects/projects';

Meteor.methods({
    groupsInsert(membersList, projID) {
        return Groups.insert({
            groupNumber: 2,
            students: membersList,
            project: "E22ZBPZHFnR4gEk9v",
        });
    },groupsEdit(membersList) {
        return Groups.update({
            students: membersList,
        })
    },async groupsGet( projID) {
        return Groups.findOne({
            project: projID,
        })
    },
    createGroups_AUTO(projectID) {
        let Payload = {};
        const groupSize = Projects.findOne({ _id: projectID }, {groupSize: 1}).groupSize;
        let scores = SurveyResults.find({ associatedProject: projectID }, { fields: {studentScore: 1} }).fetch();
        const numOfGroups = Math.ceil(scores.length/groupSize);
        while (scores.length > 0) {
            for (groupNum=1; groupNum <= numOfGroups; groupNum++) {
                console.log(numOfGroups);
                let students = [minScore_obj(scores)._id, maxScore_obj(scores)._id];
                Payload = {
                    groupNumber: groupNum,
                    students: students,
                    project: projectID 
                };
                console.log(Payload);
                scores = refreshStudents(scores, [minScore_obj(scores), maxScore_obj(scores)]);
            }
        }
    },
});

function minScore_obj(scores) {
    let minScore = Number.MAX_VALUE;
    let minScore_obj = 'Min Score Not Found';
    scores.map((score) => {
        if(score.studentScore < minScore) {
            minScore = score.studentScore;
            minScore_obj = score;
        }
    });
    return minScore_obj;
}

function maxScore_obj(scores) {
    let maxScore = -1;
    let maxScore_obj = 'Max Score Not Found';
    scores.map((score) => {
        if(score.studentScore > maxScore) {
            maxScore = score.studentScore;
            maxScore_obj = score;
        }
    });
    return maxScore_obj;
}

function refreshStudents(scores, processedStudents) {
    let unallocatedStudents = scores;
    processedStudents.map((allocatedStudent) => {
        unallocatedStudents = unallocatedStudents.filter((student_obj) => {
            return student_obj != allocatedStudent;
        });
    });
    return unallocatedStudents;
}