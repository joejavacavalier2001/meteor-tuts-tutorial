import {Meteor} from 'meteor/meteor'
import {Posts} from '/db';
import Security from '/imports/api/security';

Meteor.methods({
    'post.create'(post) {
		post.userId = Meteor.userId();
        Posts.insert(post);
    },

    'post.list' () {
        let postList = Posts.find({},{sort: {lastModified : -1}}).fetch();
		var currentUserId = Meteor.userId();
		return postList.map((post) => {
			var username = Security.getUserNameById(post["userId"]);
			var ableToEdit = Security.userCanEditPost(post,currentUserId);
			Object.defineProperties(post, {'username': {enumerable: true, value: username}, 'userCanEditDelete': {enumerable: true, value: ableToEdit}} );
			return post;
		});
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

	'post.increment.views' (_id) {
		Posts.update(_id, {
			$inc: {
				views: 1
			}
		});
		var tempPost = Posts.findOne(_id);
		var username = Security.getUserNameById(tempPost["userId"]);
		var ableToEdit = Security.userCanEditPost(tempPost,Meteor.userId());
		Object.defineProperties(tempPost, {'username': {enumerable: true, value: username}, 'userCanEditDelete': {enumerable: true, value: ableToEdit}} );
		return tempPost;
	},

    'post.remove' (_id){
        Posts.remove(_id);
    },

    'post.get' (_id) {
        var tempPost = Posts.findOne(_id);
		var username = Security.getUserNameById(tempPost["userId"]);
		var ableToEdit = Security.userCanEditPost(tempPost,Meteor.userId());
		Object.defineProperties(tempPost, {'username': {enumerable: true, value: username}, 'userCanEditDelete': {enumerable: true, value: ableToEdit}} );
		return tempPost;
    }

});
