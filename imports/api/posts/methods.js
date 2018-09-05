import {Meteor} from 'meteor/meteor';
import PostSecurity from '/imports/api/posts/security';
import Security from '/imports/api/security';
import PostService from '/imports/api/posts/service';

Meteor.methods({
    'post.create'(post) {
		Security.checkLoggedIn(Meteor.userId());
		return PostService.createPost(post);
    },

    'post.list' () {
		return PostService.getAllPosts();
    },

    'post.edit' (_id, post) {
		Security.checkLoggedIn(Meteor.userId());
		PostSecurity.checkCurrentUserCanEditDelete(_id);
		PostService.updatePost(_id,post);
    },

	'post.increment.views' (_id) {
		return PostService.incrementViewCount(_id);
	},

    'post.remove' (_id){
		Security.checkLoggedIn(Meteor.userId());
		PostSecurity.checkCurrentUserCanEditDelete(_id);
		PostService.deletePost(_id);
    },

    'post.get' (_id) {
		return PostService.getPostById(_id);
    }

});
