import {Meteor} from 'meteor/meteor';
import {Comments} from '/db';
import {Posts} from '/db';
import CommentSecurity from '/imports/api/comments/security';

Comments.addLinks({
    'author': {
        type: 'one',
        collection: Meteor.users,
        field: 'ownerId'
    },
	'post': {
		type: 'one',
		collection: Posts,
		field: 'postId'
	}
});

Comments.addReducers({
	'username' : {
		body : {
			author: {emailUsername: 1} 	
		},
		reduce(object) {
			let currentAuthor = object["author"];
			return currentAuthor["emailUsername"];
		}
	},
	'userCanEdit': {
		body: {
			_id: 1
		},
		reduce(object) {
			try{
				CommentSecurity.checkCurrentUserCanEdit(object["_id"]);
			} catch(e) {
				return false;
			}
			return true;
		}	
	},
	'userCanDelete': {
		body: {
			_id: 1
		},
		reduce(object) {
			try{
				CommentSecurity.checkCurrentUserCanDelete(object["_id"]);
			} catch (e) {
				return false;
			}
			return true;
		}
	}
});



