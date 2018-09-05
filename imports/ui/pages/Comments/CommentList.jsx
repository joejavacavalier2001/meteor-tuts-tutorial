import React from 'react';
import CommentSchema from '/db/comments/schema';
import CommentView from "./CommentView";
import PropTypes from 'prop-types';
import {AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField} from 'uniforms-unstyled';
import { Meteor } from 'meteor/meteor';

export default class CommentList extends React.Component {
    constructor() {
        super();
        this.boundHandleCommentDelete = this.handleCommentDelete.bind(this);
        this.inputTextRef = null;
        this.state = {badUsage: false, error: "", commentsLoaded: null};
    }
    componentDidMount() {
        if (!this.props.currentPostId){
            this.setState({badUsage: true, commentsLoaded: null});
        } else {
            if (this.props.initialCommentList){
                this.setState({commentsLoaded: this.props.initialCommentList});
            } else {
                Meteor.call('comment.list', this.props.currentPostId, (err, comments) => {
                    if (err){
                        this.setState({error: "Error loading initial comments: " + err.reason});
                    } else {
                        this.setState({commentsLoaded: comments});
                    }
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if ((this.inputTextRef) && (this.inputTextRef.current)){
            this.inputTextRef.current.setAttribute("rows","1");
            this.inputTextRef.current.setAttribute("style","height:1.5em;");
            this.inputTextRef.current.value = "";
        }
    }

    handleCommentDelete(commentId){
        Meteor.call('comment.remove',commentId, (err) => {
            if (!err){
                Meteor.call('comment.list',this.props.currentPostId, (err, comments) => {
                    this.setState({commentsLoaded: comments});
                });
            } else {
                this.setState({error: "Error reloading comments after deletion: " + err.reason});
            }
        });
    }

    submit = (comment) => {
        Meteor.call('comment.create', comment, (err,newId) => {
            if (err) {
                alert(err.reason);
            } else {
                Meteor.call('comment.list',this.props.currentPostId, (err, comments) => {
                    if (err){
                        alert(err.reason);
                    } else {
                        this.setState({commentsLoaded: comments});
                    }
                });
            }
        });
    };

    makeCommentsRenderer() {
        if (!this.state.commentsLoaded){
            return (<p>Loading...</p>);
        } else if (!this.state.commentsLoaded.length) {
            return "";
        } else {
            return this.state.commentsLoaded.map((comment) => {
                return (
					 <CommentView commentInitialContent={comment} key={comment._id} deleteCommentFunction={this.boundHandleCommentDelete} />
                );
            });
        }
    }

    makeCreateCommentForm(){
        if (!Meteor.userId()){
            return ("");
        }

        this.inputTextRef = React.createRef();
        return (<>
			<p>Create new comment here:</p>
			<AutoForm onSubmit={this.submit} schema={CommentSchema}>
			    <ErrorsField />
			    <LongTextField name="text" inputRef={this.inputTextRef} />
			    <HiddenField name="ownerId" value="placeholder for required field" />
			    <HiddenField name="postId" value={this.props.currentPostId} />
			    <SubmitField value="Save new comment"/>
			</AutoForm>
		</>);
    }
    render() {
        const {commentsLoaded} = this.state;
        const {badUsage} = this.state;
        const {error} = this.state;

        if (badUsage){
            return (<div>Invalid parameters sent to CommentList</div>);
        }
        if (error) {
            return (<div>{error}</div>);
        }

        let commentListRendered = (commentsLoaded ? this.makeCommentsRenderer() : "");
        return (<>{commentListRendered}{this.makeCreateCommentForm()}</>);
    }
}

CommentList.propTypes = {
    currentPostId: PropTypes.string,
    initialCommentList: PropTypes.arrayOf(PropTypes.object)
};

