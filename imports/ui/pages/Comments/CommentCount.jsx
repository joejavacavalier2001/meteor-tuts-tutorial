import React from 'react';
import CommentView from "./CommentView";
import CommentSchema from '/db/comments/schema';
import {AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField} from 'uniforms-unstyled';
import { Meteor } from 'meteor/meteor';

export default class CommentCount extends React.Component {
    constructor() {
        super();
		this.state = {badUsage: false, error: "", commentsLoaded: null};
    }
	componentDidMount() {
		if (!this.props.currentPostId){
			this.state = {badUsage: true, commentsLoaded: null}
		} else {
			Meteor.call('comment.count', this.props.currentPostId, (err, comments) => {
				if (err){
					this.setState({error: "Error loading initial comments: " + err.reason});
				} else {
					this.setState({commentsLoaded: comments});
				}
			});
		}
	}

    render() {
        const {commentsLoaded} = this.state;
		const {badUsage} = this.state;
		const {error} = this.state;

		if (badUsage){
			return (<div>Invalid parameters sent to CommentCount</div>);
		}
		if (error) {
			return (<div>{error}</div>);
		}
		if (commentsLoaded === null){
			return ("");
		} 
		return (<p>Number of comments: {commentsLoaded}</p>);
    }
}
