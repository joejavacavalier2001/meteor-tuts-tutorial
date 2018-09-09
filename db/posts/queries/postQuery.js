import {Match} from 'meteor/check';
import {Posts} from '/db';

const postQuery = Posts.createQuery({
    $filter({filters, options, params}) {
        if (params.specificPostById){
            filters._id = params.id;
        }
    },
    $options: {lastModified : -1},
    type: 1,
    title: 1,
    description: 1,
    lastModified: 1,
    username: 1,
    views: 1,
    userCanEditDelete: 1,
    comments: {
        text: 1,
        username: 1,
        ownerId: 1,
        postId: 1,
        lastModified: 1,
        userCanEdit: 1,
        userCanDelete: 1
    }
}, {
    validateParams: {
        specificPostById: Boolean,
        id: Match.Maybe(String)
    }
});
export {postQuery};

