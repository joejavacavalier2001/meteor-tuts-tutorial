import {Comments} from '/db';
import {Match} from 'meteor/check';

const commentQuery = Comments.createQuery({
    $filter({filters, options, params}) {
        if (params.getList){
            filters.postId = params.postId;
        } else if (params.getCommentById){
            filters._id = filters.id;
        }
    },
    $options: {lastModified : -1},
    text: 1,
    username: 1,
    ownerId: 1,
    postId: 1,
    lastModified: 1,
    userCanEdit: 1,
    userCanDelete: 1
}, {
    validateParams: {
        getList: Boolean,
        getCommentById: Match.Maybe(Boolean),
        id: Match.Maybe(String)
    }
});
export {commentQuery};

