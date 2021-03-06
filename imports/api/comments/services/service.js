import {Meteor} from 'meteor/meteor'
import {Comments} from '/db';
import {commentQuery} from '/db/comments/queries/commentQuery';

export default class CommentService {
    static createComment(comment){
        comment["ownerId"] = Meteor.userId();

        return Comments.insert(comment);
    }

    static getCommentsForPost(currentPostId){
        return commentQuery.clone({getList: true, postId: currentPostId}).fetch();
    }

    static getCommentCountForPost(currentPostId){
        return commentQuery.clone({getList: true, postId: currentPostId}).getCount();
    }

    static updateComment(_id, comment){
        var newDate = new Date();
        Comments.update(_id, {
            $set: {
                text: comment.text,
                lastModified: newDate
            }
        });
        comment["lastModified"] = newDate;
        return comment;
    }

    static deleteComment(_id){
        Comments.remove(_id);
    }

    static getCommentById(currentId){
        return commentQuery.clone({getList: false, getCommentById: true, id: currentId}).fetchOne();
    }

}

