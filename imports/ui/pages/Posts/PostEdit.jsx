import React from 'react';
import {AutoForm, AutoField, ErrorsField, HiddenField, LongTextField, SubmitField} from 'uniforms-unstyled';
import PostSchema from '/db/posts/schema';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

export default class PostEdit extends React.Component {
    constructor() {
        super();
        this.state = {post: null};
    }

    componentDidMount() {
        Meteor.call('post.get', this.props.match.params._id, (err, post) => {
            this.setState({post});
        });
    }

    submit(post) {
        Meteor.call('post.edit', this.props.match.params._id, post, (err) => {
            if (err) {
                return alert(err.reason);
            }
            alert('Post modified!')
        });
    }

    render() {
        const {history} = this.props;
        const {post} = this.state;

        if (!post) {
            return <div>Loading....</div>
        }
        let submitFunction = function(post){this.submit(post);};
        let boundSubmitFunction = submitFunction.bind(this);
        let backFunction = function(){history.push('/posts');};
        return (
            <>
                <AutoForm onSubmit={boundSubmitFunction} schema={PostSchema} model={post}>
                    <ErrorsField />
                    <HiddenField name="userId" value="placeholder for required field" />
                    <AutoField name="title" />
                    <LongTextField name="description" />
                    <AutoField name="type" />
                    <SubmitField value="Save post changes"/>
                    <button onClick={backFunction}>Back to posts</button>
                </AutoForm>
            </>
        )
    }
}

PostEdit.propTypes = {
    history: PropTypes.any,
    match: PropTypes.shape({
        params: PropTypes.shape({
            _id: PropTypes.string
        })
    })
};
