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

FlowRouter.route('/projects2', {
  name: 'App.projects2',
  action() {
    BlazeLayout.render('App_body', { main: 'App_projects2' });
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
