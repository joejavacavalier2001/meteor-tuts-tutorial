import { Meteor } from 'meteor/meteor'
import React from 'react';
import {AutoForm, HiddenField, LongTextField} from 'uniforms-unstyled';
import PropTypes from 'prop-types';
import CommentSchema from '/db/comments/schema';

export default class CommentCreate extends React.Component {
    constructor() {
        super();
    }

    submit(comment) {
        alert("current ownerId will be " + comment.ownerId);
        alert("postId will be " + comment.postId);
        Meteor.call('comment.create', comment, (err) => {
            if (err) {
                return alert(err.reason);
            }
            alert('Comment added!')
        });
    }

    render() {
        const {postId} = this.props;
        let submitFunction = function(comment){this.submit(comment);};
        return (
            <div className="comment">
                <AutoForm onSubmit={submitFunction} schema={CommentSchema}>
                    <LongTextField name="text"/>
                    <HiddenField name="ownerId" value={Meteor.userId()} />
                    <HiddenField name="postId" value={postId} />
                    <button type='submit'>Save comment</button>
                </AutoForm>
            </div>
        )
    }
}

CommentCreate.propTypes = {
    postId: PropTypes.string
};

