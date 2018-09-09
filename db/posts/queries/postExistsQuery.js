import {check} from 'meteor/check';
import {Match} from 'meteor/check';
import {Posts} from '/db';

// This is the simpliest way I know to ask
// the Mongo DB whether a post exists.

const postExistQuery = Posts.createQuery({
    $filter({filters, options, params}) {
        filters._id = params.id;
    },
    _id: 1
}, {
    validateParams: {
        id: Match.Where((x) => {
            check(x, String);
            return x.length > 0;
        })
 
    }
});
export {postExistQuery};

