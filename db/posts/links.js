import {Meteor} from 'meteor/meteor';
import {Posts} from '/db';
import {Comments} from '/db';

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
			author: {_id: 1} 
		},
		reduce(object) {
			let currentAuthor = object["author"];
			let currentId = Meteor.userId();
			return ((currentId) && (currentId === currentAuthor._id));
		}	
	}
});



