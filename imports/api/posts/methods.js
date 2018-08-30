import {Meteor} from 'meteor/meteor';
import {Posts} from '/db';
import {postQuery} from './postQuery';

Meteor.methods({
    'post.create'(post) {
		post.userId = Meteor.userId();
        Posts.insert(post);
    },

    'post.list' () {
		return postQuery.clone({specificPostById: false}).fetch();
    },

    'post.edit' (_id, post) {
        Posts.update(_id, {
            $set: {
                title: post.title,
                description: post.description,
				type: post.type,
				lastModified: new Date()
            }
        });
    },

	'post.increment.views' (currentId) {
		Posts.update(currentId, {
			$inc: {
				views: 1
			}
		});
		return postQuery.clone({specificPostById: true, id: currentId}).fetchOne();
	},

    'post.remove' (_id){
        Posts.remove(_id);
    },

    'post.get' (currentId) {
		return postQuery.clone({specificPostById: true, id: currentId}).fetchOne();
    }

});
