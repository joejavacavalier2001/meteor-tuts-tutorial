import {Meteor} from 'meteor/meteor'

Meteor.methods({
    'find.random_number'(min, max) {
        if (!min) min = 0;
        if (!max) max = 100;
        const generatedNumber = Math.random() * (max - min) + min;
        return Math.floor(generatedNumber);
    },

    'method.checkString'(myString) {
        if (myString === 'exception') {
            throw new Meteor.Error(500, 'An error has occurred', 'You are not allowed to enter this string');
        }

        return true;
    },

    'getCurrentUserName' (){
        let currentUserObj = Meteor.users.createQuery({
            $filters: {
                _id: Meteor.userId()
            },
            _id: 1,
            emailUsername: 1
        }).fetchOne();
        return ((currentUserObj) ? currentUserObj.emailUsername : "");
    },

    'getCurrentUser'() {
        let findUserObj = Meteor.users.createQuery({
            $filters: {
                _id: Meteor.userId()
            },
            _id: 1,
            emailUsername: 1
        });

        return findUserObj.fetchOne();
    }

});
