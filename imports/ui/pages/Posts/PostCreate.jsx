import React from 'react';
import PropTypes from 'prop-types';
import {AutoField, AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField} from 'uniforms-unstyled';
import { Meteor } from 'meteor/meteor';
import PostSchema from '/db/posts/schema';
import {PostCategoriesEnum} from '/db/posts/enums/categories';

export default class PostCreate extends React.Component {
    constructor() {
        super();
        this.state = {error: ""};
    }

	onSubmit = (post) => {
	    const {history} = this.props;
	    Meteor.call('post.create', post, (err) => {
	        if (err){
	            this.setState({error: err.reason});
	        } else {
	            history.push('/posts');
	        }
	    });
	};

	render() {
	    const {history} = this.props;
	    const {error} = this.state;
	    let errorElement = ((error) ? (<ErrorsField>{error}</ErrorsField>) : (<ErrorsField/>));
	    let submitFunction = function(post){this.onSubmit(post);};
	    let boundSubmitFunction = submitFunction.bind(this);
	    let historyFunction = function(){history.push('/posts');};
	    return (
	        <div className="post">
	            <AutoForm onSubmit={boundSubmitFunction} schema={PostSchema}>
	                {errorElement}
	                <HiddenField name="userId" value="placeholder for required field" />
	                <AutoField name="title"/>
	                <LongTextField name="description"/>
	                <AutoField name="type" value={PostCategoriesEnum.NATURE}/>
	                <SubmitField value="Save post"/>
	            </AutoForm>
	            <button onClick={historyFunction}>Back to posts</button>
	        </div>
	    )
	}
}

PostCreate.propTypes = {
    history: PropTypes.any
};

