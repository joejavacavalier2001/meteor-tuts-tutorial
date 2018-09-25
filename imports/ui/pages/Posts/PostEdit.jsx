import React from 'react';
import {AutoForm, AutoField, ErrorsField, HiddenField, LongTextField, SubmitField} from 'uniforms-unstyled';
import PostSchema from '/db/posts/schema';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

export default class PostEdit extends React.Component {
    constructor() {
        super();
        this.state = {post: null, error: ""};
    }

    componentDidMount() {
        Meteor.call('post.get', this.props.match.params._id, (err, post) => {
            if (err){
                this.setState({error: err.reason});
            } else {
                this.setState({post});
            }
        });
    }

    submit(post) {
        Meteor.call('post.edit', this.props.match.params._id, post, (err) => {
            if (err) {
                this.setState({error: err.reason});
            } else {
                alert('Post modified!');
            }
        });
    }

    render() {
        const {history} = this.props;
        const {post} = this.state;
        const {error} = this.state;

        let backButton = (<button onClick={backFunction}>Back to posts</button>);
        if (error){
            // I will avoid using the React Fragment syntax. That syntax disrupts the color coding in github!
            return (
                <div>
                    <div>Error editing post: {error}</div>
                    {backButton}
                </div>
            );
        }

        if (!post) {
            return (<div>Loading....</div>);
        }
        let boundSubmitFunction = this.submit.bind(this,post);
        let backFunction = function(){history.push('/posts');};

        return (
            <div>
                <AutoForm onSubmit={boundSubmitFunction} schema={PostSchema} model={post}>
                    <ErrorsField />
                    <HiddenField name="userId" value="placeholder for required field" />
                    <AutoField name="title" />
                    <LongTextField name="description" />
                    <AutoField name="type" />
                    <SubmitField value="Save post changes"/>
                </AutoForm>
                {backButton}
            </div>
        );
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
