import {Meteor} from 'meteor/meteor'
import {Comments} from '/db';
import {commentQuery} from './commentQuery';

Meteor.methods({
    'comment.create'(comment) {
		comment["ownerId"] = Meteor.userId();

		let newCommentId = "";
		try{
			newCommentId = Comments.insert(comment);
		} catch (e) {
			console.log(e);
		}
        return newCommentId;
    },

    'comment.list' (currentPostId) {
		return commentQuery.clone({getList: true, postId: currentPostId}).fetch();
    },

	'comment.count' (currentPostId) {
		return commentQuery.clone({getList: true, postId: currentPostId}).getCount();
	},

    'comment.edit' (_id, comment) {
		var newDate = new Date();
        Comments.update(_id, {
            $set: {
                text: comment.text,
				lastModified: newDate 
            }
        });
		comment["lastModified"] = newDate;
		return comment;
    },

    'comment.remove' (_id){
        Comments.remove(_id);
    },

	'comment.all.delete' (currentPostId){
		Comments.remove({postId: {$eq: currentPostId}});
	},

    'comment.get' (currentId) {
		return commentQuery.clone({getCommentById: true, id: currentId}).fetchOne();
   	}
});
