import React from 'react';
import {AutoForm, AutoField, LongTextField} from 'uniforms-unstyled';
import { Meteor } from 'meteor/meteor';
import PostSchema from '/db/posts/schema';
import CommentList from '/imports/ui/pages/Comments/CommentList';

export default class PostView extends React.Component {
    constructor() {
        super();
        this.state = {post: null, err: null};
    }

    componentDidMount() {
		Meteor.call('post.increment.views', this.props.match.params._id, (err, post) => {
			if (err){
				this.setState({err: err.reason});
			}
			else{
				this.setState({'postLoaded': post});
			}
		});
    }

    render() {
        const {history} = this.props;
		const {postLoaded} = this.state;

		if (this.state.err) {
				return (
						<div>
							<p>Error retrieving post information:</p>
							<p>{this.state.err}</p>
						</div>
					   )
		}
        if (!postLoaded) {
            return (
				<div>
					<p>Loading....</p>
					<button onClick={() => history.push('/posts')}>Back to posts</button>
				</div>
			);
        }
	   	let editButton = ((postLoaded.userCanEditDelete) ? (<button onClick={() => {history.push("/posts/edit/" + postLoaded._id)}}>Edit post</button>) : (""));	
        return (
			<div key={postLoaded._id}>
				<p>Post id: {this.props.match.params._id}</p>
				<p>Post title: {postLoaded.title}</p>
				<p>Post Description: {postLoaded.description} </p>
				<p>Post type: {postLoaded.type} </p>
				<p>Post modified: {postLoaded.lastModified.toString()} </p>
				<p>Post viewed {postLoaded.views} time(s)</p>
				<p>Post owner: {postLoaded.username} </p>
				{editButton}
				<p>Comments:</p>
				<CommentList currentPostId={postLoaded._id} initialCommentList={postLoaded.comments} />
			    <button onClick={() => history.push('/posts')}>Back to posts</button>	
			</div>
        )
    }
}
