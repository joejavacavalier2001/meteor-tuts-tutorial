import React from 'react';
import {AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField} from 'uniforms-unstyled';
import CommentSchema from '/db/comments/schema';

export default class CommentView extends React.Component {
    constructor() {
        super();
        this.state = {editing: false, comment: null};
    }

	submitEdit = (newComment) => {
        Meteor.call('comment.edit', this.state.comment._id, newComment, (err) => {
            if (err) {
                alert(err.reason);
            } else {
				this.setState({comment: newComment, editing: false});
			}
        });
    };
	cancelEdit() {
		this.setState({editing: false});
	}

	renderButtons() {
		let buttonsRenderer = ["",""];
		if (this.state.comment){
			if (this.state.comment.userCanEdit){
				buttonsRenderer[0] = (<button onClick={()=>{this.setState({editing: true})}}>Edit comment</button>);
			}
			if (this.state.comment.userCanDelete){
				buttonsRenderer[1] = (<button onClick={()=>{this.props.deleteCommentFunction(this.state.comment._id);}}>Delete comment</button>);
			} else {
				buttonsRenderer[1] = (<p>User cannot delete</p>);
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
			return (
				<div className="comment">
					<AutoForm onSubmit={this.submitEdit} schema={CommentSchema} model={comment}>
						<ErrorsField />
						<LongTextField name="text"/>
						<HiddenField name="ownerId" value={comment.ownerId} />
						<HiddenField name="postId" value={comment.postId} />
						<SubmitField value="Save comment changes"/>
						<button onClick={() =>{this.setState({editing: false});}}>Cancel Editing</button>
					</AutoForm>
				</div>
			)
		
		} else {
			let newButtons = this.renderButtons();
			let editButton = newButtons[0];
			let deleteButton = newButtons[1];
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
