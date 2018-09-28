import { Meteor } from 'meteor/meteor';
import {Posts} from '/db';

Meteor.users.addLinks({
    'posts': {
        collection: Posts,
        inversedBy: 'author'
    }
});


// Return the first email address on file whenever anyone asks for a "username"
Meteor.users.addReducers({
    emailUsername: {
        body: {
            emails:1
        },
        reduce(object) {
            let emails = object["emails"];
            let username = emails[0].address;
            return username;
        }
    }
});

