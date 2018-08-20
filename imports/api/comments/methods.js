import {Meteor} from 'meteor/meteor'
import {Comments} from '/db';
import {Posts} from '/db';
import Security from '/imports/api/security';

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
        let commentList = Comments.find({postId: currentPostId},{sort: {lastModified : -1}}).fetch();
		var currentUserId = Meteor.userId();
		return commentList.map((comment) => {
			let username = Security.getUserNameById(comment["ownerId"]);
			let ableToEdit = Security.userCanEditComment(comment,currentUserId);
			let ableToDelete = Security.userCanDeleteComment(comment,currentUserId,ableToEdit);
			Object.defineProperties(comment, {
				'username': {
					enumerable: true, 
					value: username
				}, 
				'userCanEdit': {
					enumerable: true, 
					value: ableToEdit
				},
				'userCanDelete': {
					enumerable: true,
					value: ableToDelete
				},
			});
			return comment;
		});
    },

	'comment.count' (currentPostId) {
		return Comments.find({postId: currentPostId}).fetch().length;
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

    'comment.get' (_id) {
		let tempComment = Comments.findOne(_id);
		let currentUserId = Meteor.userId();
		let username = Security.getUserNameById(tempComment["ownerId"]);
		let ableToEdit = Security.userCanEditComment(tempComment,currentUserId);
		let ableToDelete = Security.userCanDeleteComment(tempComment,currentUserId,ableToEdit);
		Object.defineProperties(tempComment, {
			'username': {
				enumerable: true, 
				value: username
			}, 
			'userCanEdit': {
				enumerable: true, 
				value: ableToEdit
			},
			'userCanDelete': {
				enumerable: true,
				value: ableToDelete
			},
		});
        return tempComment;
   	}
});
