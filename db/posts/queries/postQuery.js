import {Match} from 'meteor/check';
import {Posts} from '/db';

// This is the main Grapher query for the PostService module.
// This query can be used to retrieve a single post object or all
// the post objects in the Mongo DB.
//
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
        userCanDelete: 1,
        $options: {lastModified: -1} //Attach and retrieve a comments array in descending sorted order!
    }
}, {
    validateParams: {
        specificPostById: Boolean,
        /*eslint new-cap: ["error", { "capIsNew": false }]*/ /*I can't change how the Meteor API is spelled and/or capitalized.*/
        id: Match.Maybe(String) // I don't always expect an id parameter, but if it exists, it should be a string!
    }
});
export {postQuery};

