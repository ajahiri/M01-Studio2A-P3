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
    BlazeLayout.render('App_body_public', { main: 'App_tutorLogin' });
  },
});

FlowRouter.route('/dashboard', {
  name: 'App.dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'App_dashboard' });
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
