import {Meteor} from 'meteor/meteor';
import {Posts} from '/db';
import {postQuery} from '/db/posts/queries/postQuery';

export default class PostService {
    static createPost(post) {
        post.userId = Meteor.userId();
        return Posts.insert(post);
    }

    static getAllPosts() {
        return postQuery.clone({specificPostById: false}).fetch();
    }

    static updatePost(_id,post) {
        return Posts.update(_id, {
            $set: {
                title: post.title,
                description: post.description,
                type: post.type,
                lastModified: new Date()
            }
        });
    }

    static incrementViewCount(_id) {
        Posts.update(_id, {
            $inc: {
                views: 1
            }
        });
        return postQuery.clone({specificPostById: true, id: _id}).fetchOne();
    }

    static deletePost(_id){
        Posts.remove(_id);
    }

    static getPostById(_id){
        return postQuery.clone({specificPostById: true, id: _id}).fetchOne();
    }
}

