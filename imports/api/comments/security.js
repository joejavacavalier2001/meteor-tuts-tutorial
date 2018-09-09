import {Meteor}  from 'meteor/meteor';
import {findCommentAuthor} from '/db/comments/queries/getUser';
import {findCommentPostAuthor} from '/db/comments/queries/getCommentPostAuthor';

export default class CommentSecurity {
    static checkCurrentUserCanEdit(commentId)
    {
        let currentAuthor = findCommentAuthor.clone({id: commentId}).fetchOne();
        if (!currentAuthor){
            throw new Meteor.Error('not-authorized','Cannot find the current comment in the db.');
        }
        let currentAuthorId = currentAuthor["ownerId"];
        if (currentAuthorId !== Meteor.userId()){
            throw new Meteor.Error('not-authorized','You are not authorized to edit the current comment.');
        }
        return true;
    }
    static checkCurrentUserCanDelete(commentId)
    {
        var currentAuthor = findCommentAuthor.clone({id: commentId}).fetchOne();
        if (!currentAuthor){
            throw new Meteor.Error('not-authorized','Cannot find the current comment in the db.');
        }
        var currentUserId = Meteor.userId();
        let currentAuthorId = currentAuthor["ownerId"];
        if (currentAuthorId === currentUserId){
            return true;
        } else {
            let commentPost = findCommentPostAuthor.clone({id: commentId}).fetchOne();
            let currentPostObj = commentPost["post"];
            let currentPostAuthorId = currentPostObj["userId"];
            if (currentPostAuthorId === currentUserId){
                return true;
            }
        }
        throw new Meteor.Error('not-authorized','You are not authorized to delete the current comment.');
    }
	
}
