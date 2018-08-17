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
	
	static checkComment(comment){
		if ((!comment) || (!(comment instanceof Object)) || (!comment.hasOwnProperty("ownerId"))){
			return false;
		}
		return true;
	}

	static checkPost(post){
		if ((!post) || (!(post instanceof Object)) || (!post.hasOwnProperty("userId"))){
			return false;
		}
		return true;
	}

	static userCanEditComment(comment,userId){
		let canEdit = false;
		if (Security.checkComment(comment)){
			try{
				canEdit = ((userId === comment["ownerId"]) ? true : false);
			} catch (e) {
				canEdit = false;
			}
		}
		return canEdit;
	}

	static userCanEditPost(post,currentUserId){
		let canEdit = false;
		if (Security.checkPost(post)){
			canEdit = ((currentUserId === post["userId"]) ? true : false);
		}
		return canEdit;
	}

	static userCanDeleteComment(comment,userId,canEdit){
		let canDelete = false;
		if (canEdit){
			return true; 
		} else {
			try{
				let parentPost = Posts.findOne(comment.postId);
				canDelete = ( ((parentPost) && (parentPost.hasOwnProperty("userId"))) ? (parentPost["userId"] === userId) : false); 
			} catch(e) {
				canDelete = false;
			}
		}
		return canDelete;
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

	static getUserNameById(userId){
		var userName = "";
		if (userId){
			userName = this.getUserName(Meteor.users.findOne(userId));
		}
		return userName;
	}
    // add other business logic checks here that you use throughout the app
    // something like: isUserAllowedToSeeDocument()
    // always keep decoupling your code if this class gets huge.
}
