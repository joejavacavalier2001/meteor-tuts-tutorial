import {Meteor} from 'meteor/meteor'

Meteor.methods({
    'find.random_number'(min, max) {
        if (!min) min = 0;
        if (!max) max = 100;
        const generatedNumber = Math.random() * (max - min) + min;
        return Math.floor(generatedNumber);
    },

    'method.checkString'(myString) {
        if (myString === 'exception') {
            throw new Meteor.Error(500, 'An error has occurred', 'You are not allowed to enter this string');
        }

        return true;
    },

	'getCurrentUserName' (){
		var username = "";
		var userid = Meteor.userId();
		if (userid){
			let userObj = Meteor.users.findOne(userid);
			username = userObj["emails"][0]["address"];
			let atSignIndex = username.indexOf("@");
			if (atSignIndex){
				username = username.substring(0,atSignIndex);
			}
		}
        return username;
	}
});
