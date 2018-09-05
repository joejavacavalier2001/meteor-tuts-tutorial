import {Meteor} from 'meteor/meteor';
import {Posts} from '/db';
import {Comments} from '/db';
import PostSecurity from '/imports/api/posts/security';

Posts.addLinks({
    'author': {
        type: 'one',
        collection: Meteor.users,
        field: 'userId'
    },
	'comments': {
		collection: Comments,
		inversedBy: 'post',
		autoremove: true
	}
});

Posts.addReducers({
	'username': {
		body : {
			author: {emailUsername: 1} 	
		},
		reduce(object) {
			let currentAuthor = object["author"];
			return currentAuthor["emailUsername"];
		}
	},
	'userCanEditDelete': {
		body: {
			_id: 1,
		},
		reduce(object) {
			try{
				PostSecurity.checkCurrentUserCanEditDelete(object["_id"]);
			} catch (e) {
				return false;
			}
			return true;
		}	
	}
});



