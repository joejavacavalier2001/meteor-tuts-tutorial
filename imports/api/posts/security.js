import {Meteor}  from 'meteor/meteor';
import {findPostAuthor} from '/db/posts/queries/getUser';

export default class PostSecurity {
	static checkCurrentUserCanEditDelete(postId)
	{
		let currentAuthor = findPostAuthor.clone({id: postId}).fetchOne();
		if (!currentAuthor){
			throw new Meteor.Error('not-authorized','Cannot find the current post in the db.');
		}
		let currentAuthorId = currentAuthor["userId"];
		if (currentAuthorId !== Meteor.userId()){
            throw new Meteor.Error('not-authorized','You are not authorized to edit or delete the current post.');
		}
		return true;		
	}
	
}
