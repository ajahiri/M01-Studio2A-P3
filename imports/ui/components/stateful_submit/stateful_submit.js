import './stateful_submit.html';

Template.stateful_submit.onCreated(function() {
    
})

Template.stateful_submit.helpers({ 
    loading() {
        if (Template.instance().data.loading) {
            return Template.instance().data.loading;
        } else {
            return false;
        }
    },
}); 

Template.stateful_submit.events({ 
    
}); 
