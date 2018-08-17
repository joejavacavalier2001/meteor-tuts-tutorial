import React from 'react';
import {AutoField, AutoForm, BaseForm, ErrorsField, HiddenField, LongTextField, SubmitField} from 'uniforms-unstyled';
import { Meteor } from 'meteor/meteor';
import PostSchema from '/db/posts/schema';

export default class PostCreate extends React.Component {
    constructor() {
        super();
    }

	onSubmit = (post) => {
		const {history} = this.props;
		console.log("Inside PostCreate submit");
		Meteor.call('post.create', post, (err) => {
			if (err) {
				console.log(err.reason);
			}
			console.log('Post added!');
		});
		history.push('/posts');
	};

	handleSubmitFailure(err) {
		console.log(err);
	}

    render() {
        const {history} = this.props;

        return (
            <div className="post">
                <AutoForm onSubmit={(post) => this.onSubmit(post)} schema={PostSchema}>
					<ErrorsField />
					<HiddenField name="userId" value="placeholder for required field" />
                    <AutoField name="title"/>
                    <LongTextField name="description"/>
					<AutoField name="type" />
                    <SubmitField value="Save post"/>
                </AutoForm>
                <button onClick={() => history.push('/posts')}>Back to posts</button>
            </div>
        )
    }
}
