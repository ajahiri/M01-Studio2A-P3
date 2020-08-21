import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';

// Tutor login page
import '../../ui/pages/tutorLogin/tutorLogin';

// Tutor dashboard
import '../../ui/pages/dashboard/dashboard';

// Survey page
import '../../ui/pages/survey_page/survey_page';

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
