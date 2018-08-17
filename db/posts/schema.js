import { Meteor } from 'meteor/meteor';
import SimplSchema from 'simpl-schema';

export default new SimplSchema({
	type: {
		type: String,
		allowedValues: PostTypes 
	},
	createdAt: {
		type: Date,
	    defaultValue: new Date()
	},
	lastModified: {
		type: Date,
	   	defaultValue: new Date()
	},
	views: {
		type: Number,
	    defaultValue: 0
	},
    title: String,
    description: String,
    userId: String 
});
