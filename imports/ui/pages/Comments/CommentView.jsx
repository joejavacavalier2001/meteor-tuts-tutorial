import React from 'react';
import PropTypes from 'prop-types';
import {AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField} from 'uniforms-unstyled';
import CommentSchema from '/db/comments/schema';
import { Meteor } from 'meteor/meteor';

export default class CommentView extends React.Component {
    constructor() {
        super();
        this.state = {editing: false, comment: null};
    }

    submitEdit(newComment){
        Meteor.call('comment.edit', this.state.comment._id, newComment, (err) => {
            if (err) {
                alert(err.reason);
            } else {
                this.setState({comment: newComment, editing: false});
            }
        });
    }

    cancelEdit() {
        this.setState({editing: false});
    }

    renderButtons() {
        let buttonsRenderer = ["",""];
        let turnOnEditingFunction = function(){this.setState({editing: true});};
        let boundTurnOnEditingFunction = turnOnEditingFunction.bind(this);
        let deleteFunction = function(){this.props.deleteCommentFunction(this.state.comment._id);};
        let boundDeleteFunction = deleteFunction.bind(this);
        if (this.state.comment){
            if (this.state.comment.userCanEdit){
                buttonsRenderer[0] = (<button onClick={boundTurnOnEditingFunction}>Edit comment</button>);
            }
            if (this.state.comment.userCanDelete){
                buttonsRenderer[1] = (<button onClick={boundDeleteFunction}>Delete comment</button>);
            }
        }
        return buttonsRenderer;
    }

    componentDidMount() {
        this.setState({comment: this.props.commentInitialContent});
    }

    render() {
        const {comment} = this.state;
        const {editing} = this.state;

        if (!comment) {
            return (<div>Loading....</div>);
        }
		
        if (editing){
            let submitFunction = function(comment){this.submitEdit(comment);};
            let boundSubmitFunction = submitFunction.bind(this);
            let cancelEditFunction = function(){this.cancelEdit();};
            let boundCancelEditFunction = cancelEditFunction.bind(this);
		
            return (
                <div className="comment">
                    <AutoForm onSubmit={boundSubmitFunction} schema={CommentSchema} model={comment}>
                        <ErrorsField />
                        <LongTextField name="text"/>
                        <HiddenField name="ownerId" value={comment.ownerId} />
                        <HiddenField name="postId" value={comment.postId} />
                        <SubmitField value="Save comment changes"/>
                    </AutoForm>
                    <button onClick={boundCancelEditFunction}>Cancel Editing</button>
                </div>
            );
		
        } else {
            let [editButton,deleteButton] = this.renderButtons();
            return (
                <div className="comment">
                    <p>Comment text: {comment.text}</p>
                    <p>Last modified: {comment.lastModified.toString()}</p>
                    <p>Comment written by: {comment.username}</p>
                    {editButton}{deleteButton}
                </div>
            );
        }
    }
}

CommentView.propTypes = {
    deleteCommentFunction: PropTypes.func,
    commentInitialContent: PropTypes.object
};
