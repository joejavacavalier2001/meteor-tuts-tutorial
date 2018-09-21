import {check} from 'meteor/check';
import {Match} from 'meteor/check';
import {Comments} from '/db';

const findCommentAuthor = Comments.createQuery({
    $filter({filters, options, params}) {
        filters._id = params.id;
    },
    ownerId: 1
}, {
    validateParams: {
        /*eslint new-cap: ["error", { "capIsNew": false }]*/ /*I can't change how the Meteor API is spelled and/or capitalized.*/
        id: Match.Where((x) => {
            check(x, String);
            return x.length > 0;
        })
    }
});
export {findCommentAuthor};

