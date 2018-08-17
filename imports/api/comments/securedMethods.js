import {Meteor} from 'meteor/meteor'
import {Comments} from '/db';
import Security from '/imports/api/security';

Meteor.methods({
    'secured.comment_create'(comment) {
        Security.checkLoggedIn(this.userId);
        comment.ownerId = this.userId;
        Comments.insert(comment);
    },

    'secured.comment_list' (currentPostId) {
        return Comments.find({postId: {$eq: currentPostId},{sort: {whenCreated: 1}}).fetch();
    },

    'secured.comment_edit' (_id, commentData) {

        Comments.update({_id: _id, ownerId: this.userId}, {
            $set: {
                text: commentData.text
            }
        });
    },

    'secured.comment_remove' (_id){
        Comments.remove({_id: _id, ownerId: this.userId});
    },

    'secured.comment_get' (_id) {
        return Comments.findOne(_id);
    }
});
