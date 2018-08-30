import {Meteor} from 'meteor/meteor';
import {Comments} from '/db';
import {Posts} from '/db';

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
			author: {_id: 1} 
		},
		reduce(object) {
			let currentAuthor = object["author"];
			let currentId = Meteor.userId();
			return ((currentId) && (currentId === currentAuthor._id));
		}	
	},
	'userCanDelete': {
		body: {
			author: {_id: 1},
			post: {userId: 1},
			userCanEdit: 1
		},
		reduce(object) {
			let canEdit = object["userCanEdit"]; //((currentId) && (currentId === currentAuthor._id));
			if (canEdit){
				return true;
			}
			let currentAuthor = object["author"];
			let currentPost = object["post"];
			let currentId = Meteor.userId();
			return (currentPost.userId === currentId);
		}
	}
});



