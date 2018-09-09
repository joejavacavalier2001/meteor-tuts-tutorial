import { Meteor } from 'meteor/meteor';
import {Posts} from '/db';

Meteor.users.addLinks({
    'posts': {
        collection: Posts,
        inversedBy: 'author'
    }
});

Meteor.users.addReducers({
    emailUsername: {
        body: {
            emails:1,
        },
        reduce(object) {
            let emails = object["emails"];
            let username = emails[0].address;
            //let atSignIndex = username.indexOf("@");
            //if (atSignIndex){
            //	username = username.substring(0,atSignIndex);
            //}
            return username;
        }
    }
});

