import './stateful_submit.html';

Template.stateful_submit.onCreated(function() {
    console.log('Stateful submit data:',Template.instance().data);
})

Template.stateful_submit.helpers({ 
    loading() {
        if (Template.instance().data.loading) {
            return Template.instance().data.loading;
        } else {
            return false;
        }
    },
    buttonText() {
        return Template.instance().data.buttonText || "Submit";
    },
    buttonID() {
        return Template.instance().data.buttonID || "statefulButton";
    },
    buttonType() {
        return Template.instance().data.buttonType || 'submit';
    }
}); 

Template.stateful_submit.events({ 
    
}); 
