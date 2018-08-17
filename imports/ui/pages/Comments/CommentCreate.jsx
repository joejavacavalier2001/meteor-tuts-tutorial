import { Meteor } from 'meteor/meteor'
import React from 'react';
import {AutoForm, HiddenField, LongTextField} from 'uniforms-unstyled';
import CommentSchema from '/db/comments/schema';

export default class CommentCreate extends React.Component {
    constructor() {
        super();
    }

    submit = (comment) => {
		alert("current ownerId will be " + comment.ownerId);
		alert("postId will be " + comment.postId);
        Meteor.call('comment.create', comment, (err) => {
            if (err) {
                return alert(err.reason);
            }
            alert('Comment added!')
        });
    };

    render() {
        return (
            <div className="comment">
                <AutoForm onSubmit={this.submit} schema={CommentSchema}>
                    <LongTextField name="text"/>
					<HiddenField name="ownerId" value={Meteor.userId()} />
					<HiddenField name="postId" value={this.props.postId} />
                    <button type='submit'>Save comment</button>
                </AutoForm>
            </div>
        )
    }
}
