import React from 'react';
import {AutoForm, AutoField, ErrorsField, HiddenField, LongTextField, SubmitField} from 'uniforms-unstyled';
import PostSchema from '/db/posts/schema';

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

    submit = (post) => {
        Meteor.call('post.edit', this.props.match.params._id, post, (err) => {
            if (err) {
                return alert(err.reason);
            }
            alert('Post modified!')
        });
    };

    render() {
        const {history} = this.props;
        const {post} = this.state;

        if (!post) {
            return <div>Loading....</div>
        }

        return (
            <div className="post">
                <AutoForm onSubmit={this.submit} schema={PostSchema} model={post}>
					<ErrorsField />
					<HiddenField name="userId" value="placeholder for required field" />
                    <AutoField name="title" value={post.title} />
                    <LongTextField name="description" value={post.description} />
					<AutoField name="type" />
                    <SubmitField value="Save post changes"/>
                    <button onClick={() => history.push('/posts')}>Back to posts</button>
                </AutoForm>
            </div>
        )
    }
}
