import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/index.js';


// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/tutor-login', {
  name: 'App.tutorLogin',
  action() {
    BlazeLayout.render('App_body', { main: 'App_tutorLogin' });
  },
});

FlowRouter.route('/surveys', {
  name: 'App.surveys',
  action() {
    BlazeLayout.render('App_body', { main: 'admin_survey' });
  },
});

FlowRouter.route('/survey_success', {
  name: 'App.surveysuccess',
  action() {
    BlazeLayout.render('App_body', { main: 'App_surveysuccess' });
  },
});

FlowRouter.route('/view_group', {
  name: 'App.viewgroup',
  action() {
    BlazeLayout.render('App_body', { main: 'App_viewgroup' });
  },
});

FlowRouter.route('/logout', {
  action() {
    Meteor.logout()
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/dashboard', {
  name: 'App.dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'App_dashboard' });
  },
});

FlowRouter.route('/projects', {
  name: 'App.projects',
  action() {
    BlazeLayout.render('App_body', { main: 'App_projects' });
  },
});
FlowRouter.route('/Manual', {
  name: 'App_manual',
  action() {
    BlazeLayout.render('App_body', { main: 'App_manual' });
  },
});


FlowRouter.route('/editgroups', {
  name: 'App_editgroups',
  action() {
    BlazeLayout.render('App_body', { main: 'App_editgroups' });
  },
});

FlowRouter.route('/survey/:_id', {
  name: 'App.survey',
  action(params, queryParams) {
    console.log("PARAMS", params);
    BlazeLayout.render('App_body', { main: 'App_surveyPage' });
  }
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};