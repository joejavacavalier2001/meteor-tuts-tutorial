import React from 'react';
import { Meteor } from 'meteor/meteor';
import CommentCount from "../Comments/CommentCount";

export default class PostList extends React.Component {
    constructor() {
        super();
		this.state = {posts: null};
		Meteor.call('getCurrentUserName', (err,userName) => {
			if (err) {
				this.setState({error: err.reason});
			} else {
				var curUserName = userName;
				var logOutInElements = "";
				if (userName){
					curUserName = "back ";
					curUserName += userName;
				}
				Meteor.call('post.list', (err, postResults) => {
					if (err){
						this.setState({error: err.reason});
					} else {
						this.setState({username: curUserName, posts: postResults});
					}
				});
			}
		});
    }
	makeCreateEditButtons() {
		return (<><button onClick={() => {window.location.href = '/posts/create';}}>Create a new post</button><button onClick={() => {this.handleLogout();}}>Logout</button></>);
	}

	makeLoginRegisterButtons(){
		return (<><button onClick={() => {this.handleLogin();}}>Login</button><button onClick={() => {this.handleRegister();}}>Register</button></>);
	}

	handleError(err) {
		if ((err) && (err.reason)){
			alert(err.reason);
		}
	}
	handleLogout() {
		Meteor.logout((err) => {
			if (err){
				this.handleError(err);
			} else {
				Meteor.call('post.list', (err, postResults) => {
					if (err){
						this.setState({error: err.reason});
					} else {
						this.setState({username: "", posts: postResults});
					}
				});
			}
		});
	}

	handleLogin() {
		window.location.href = '/login';		
	}

	handleRegister() {
		window.location.href = '/register';
	}

	handleDelete(postId) {
		if (postId){
			Meteor.call('post.remove',postId, (err) => {
				if (err){
					this.setState({error: err.reason});
				} else {
					Meteor.call('post.list', (err, postResults) => {
						if (err){
							this.setState({error: err.reason});
						} else {
							this.setState({posts: postResults});
						}
					});
				}
			});
		}
	}

	createPostsRenderer() {
		if ((!this.state.posts) || (!this.state.posts.length)){
			return (<h2>There are no posts yet on this system.</h2>);
		} 
		return (
			this.state.posts.map((post) => {
				let buttons = "";
				if (post["userCanEditDelete"]){
					buttons = (<><button onClick={() => {this.props.history.push("/posts/edit/" + post._id)}}>Edit post</button>
						<button onClick={() => {this.handleDelete(post._id);}}>Delete post</button></>);
				}
				return (
					 <div key={post._id}>
						<p>Post title: {post.title}</p>
						<p>Post created by: {post.username}</p>
						<p><a href="javascript:void(0)" onClick={() => {
							this.props.history.push("/posts/view/" + post._id)
						}}>View post</a></p>
						{buttons}
						<CommentCount currentPostId={post._id} />
						<p>&nbsp;</p>
					</div>
				)   
			})
		)
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (!this.state.posts){
			Meteor.call('post.list', (err, postResults) => {
				if (err){
					this.setState({error: err.reason});
				} else {
					this.setState({posts: postResults});
				}
			});
		}
	}

    render() {
	
        const {history} = this.props;
		const {username} = this.state;

		if (this.state.error){
			return (<p>Error retrieving posts: {this.state.error}</p>);
		}
        if (!this.state.posts) {
            return (<p>Loading....</p>);
        }
		var postRenderer = this.createPostsRenderer();
        return (
            <>
				<h1>Welcome {username}</h1>
                {postRenderer}
				{Meteor.userId() ? this.makeCreateEditButtons() : this.makeLoginRegisterButtons()}
            </>
        )
    }
}
