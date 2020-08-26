import './nav.html';

Template.navbar.helpers({
    route(){
        return Template.instance().route;
    }
});

Template.navbar.onCreated(function() {

    self.route = new ReactiveVar(location.pathname);
    console.log(self.route.get());
    
});