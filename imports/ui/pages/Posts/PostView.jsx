import React from 'react';
import {AutoForm, AutoField, LongTextField} from 'uniforms-unstyled';
import PostSchema from '/db/posts/schema';

export default class PostView extends React.Component {
    constructor() {
        super();
        this.state = {post: null};
		this.state = {err: null};
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

        return (
			<div key={postLoaded._id}>
				<p>Post id: {postLoaded._id} </p>
				<p>Post title: {postLoaded.title}</p>
				<p>Post Description: {postLoaded.description} </p>
				<p>Post type: {postLoaded.type} </p>
				<p>Post created on: {postLoaded.createdAt.toString()} </p>
				<p>Post viewed {postLoaded.views} time(s)</p>
				<button onClick={() => {
					history.push("/posts/edit/" + postLoaded._id)
				}}> Edit post
				</button>
			    <button onClick={() => history.push('/posts')}>Back to posts</button>	
			</div>
        )
    }
}
