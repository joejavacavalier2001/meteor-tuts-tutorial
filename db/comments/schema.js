import SimplSchema from 'simpl-schema';

export default new SimplSchema({
	whenCreated: {
		type: Date,
	  	defaultValue: new Date()
	},

	lastModified: {
		type: Date,
	    defaultValue: new Date()
	},
    text: String,
	ownerId: String,
	postId: String
});
