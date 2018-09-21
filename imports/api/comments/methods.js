import {Meteor} from 'meteor/meteor'
import CommentSecurity from '/imports/api/comments/security';
import Security from '/imports/api/security';
import CommentService from '/imports/api/comments/services/service';

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

    'comment.edit' (currentId, comment) {
        Security.checkLoggedIn(Meteor.userId());
        CommentSecurity.checkCurrentUserCanEdit(currentId);
        return CommentService.updateComment(currentId, comment);
    },

    'comment.remove' (currentId){
        Security.checkLoggedIn(Meteor.userId());
        CommentSecurity.checkCurrentUserCanDelete(currentId);
        CommentService.deleteComment(currentId);
    },

    'comment.get' (currentId) {
        return CommentService.getCommentById(currentId);
    }
});
