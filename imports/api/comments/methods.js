import {Meteor} from 'meteor/meteor'
import CommentSecurity from '/imports/api/comments/security';
import Security from '/imports/api/security';
import CommentService from '/imports/api/comments/service';

Meteor.methods({
    'comment.create'(comment) {
        Security.checkLoggedIn(Meteor.userId());
        return CommentService.createComment(comment);
    },

    'comment.list' (currentPostId) {
        return CommentService.getCommentsForPost(currentPostId);
    },

    'comment.count' (currentPostId) {
        return CommentService.getCommentCountForPost(currentPostId);
    },

    'comment.edit' (_id, comment) {
        Security.checkLoggedIn(Meteor.userId());
        CommentSecurity.checkCurrentUserCanEdit(_id);
        return CommentService.updateComment(_id, comment);
    },

    'comment.remove' (_id){
        Security.checkLoggedIn(Meteor.userId());
        CommentSecurity.checkCurrentUserCanDelete(_id);
        CommentService.deleteComment(_id);
    },

    'comment.get' (currentId) {
        return CommentService.getCommentById(currentId);
    }
});
