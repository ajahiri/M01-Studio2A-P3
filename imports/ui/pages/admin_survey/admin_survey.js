import './admin_survey.html';
import { template } from 'lodash';

Template.admin_survey.helpers({
    jack(){
        return "jack";
    }
    
});

Template.admin_survey.onCreated(function(){
    console.log('oncreated');
    
});