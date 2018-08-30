import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Comments } from '/db';
import { Posts } from '/db';

export default class Security {
    static checkRole(userId, role) {
        if (!this.hasRole(userId, role)) {
            throw new Meteor.Error('not-authorized');
        }
    }
    static hasRole(userId, role) {
        return Roles.userIsInRole(userId, role);
    }
    static checkLoggedIn(userId) {
        if (!userId) {
            throw new Meteor.Error('not-authorized', 'You are not authorized');
        }
    }
	
	static getUserName(theUserObj){
		var userName = "";
		if (theUserObj){
			try{
				userName = theUserObj["emails"][0]["address"];
				var atSignIndex = userName.indexOf("@");
				if (atSignIndex){
					userName = userName.substring(0,atSignIndex);
				}
			} catch(e){
				userName = "";
			}
		}
		return userName;
	}
	static getCurrentUserName() {
        return Security.getUserName(Meteor.user());
	}
    // add other business logic checks here that you use throughout the app
    // something like: isUserAllowedToSeeDocument()
    // always keep decoupling your code if this class gets huge.
}
