import {Meteor} from 'meteor/meteor';
import PostSecurity from '/imports/api/posts/security';
import Security from '/imports/api/security';
import PostService from '/imports/api/posts/services/service';

Meteor.methods({
    'post.create'(post) {
        Security.checkLoggedIn(Meteor.userId());
        return PostService.createPost(post);
    },

    'post.list' () {
        return PostService.getAllPosts();
    },

    'post.edit' (currentId, post) {
        Security.checkLoggedIn(Meteor.userId());
        PostSecurity.checkCurrentUserCanEditDelete(currentId);
        PostService.updatePost(currentId,post);
    },

    'post.increment.views' (currentId) {
        return PostService.incrementViewCount(currentId);
    },

    'post.remove' (currentId){
        Security.checkLoggedIn(Meteor.userId());
        PostSecurity.checkCurrentUserCanEditDelete(currentId);
        PostService.deletePost(currentId);
    },

    'post.get' (currentId) {
        return PostService.getPostById(currentId);
    }

});
