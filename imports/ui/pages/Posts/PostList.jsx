import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

export default class PostList extends React.Component {
    constructor() {
        super();
        this.state = {posts: null};

        Meteor.call('getCurrentUserName', (err,currentUserName) => {
            if (err) {
                this.setState({error: err.reason})
                return;
            }
            let curUserName = ((currentUserName) ? ("back " + currentUserName) : "");
            Meteor.call('post.list', (err, postResults) => {
                if (err){
                    this.setState({error: err.reason + " " + err.stack});
                } else {
                    this.setState({username: curUserName, posts: postResults});
                }
            });
        });
    }

    makeCreateEditButtons() {
        let gotoCreateFunction = function(){window.location.href = '/posts/create';};
        let boundGotoLogoutFunction = this.handleLogout.bind(this);
        return (<><button onClick={gotoCreateFunction}>Create a new post</button><button onClick={boundGotoLogoutFunction}>Logout</button></>);
    }

    makeLoginRegisterButtons(){
        let boundGotoLoginFunction = this.handleLogin.bind(this);
        let boundGotoRegisterFunction = this.handleRegister.bind(this);
        return (<><button onClick={boundGotoLoginFunction}>Login</button><button onClick={boundGotoRegisterFunction}>Register</button></>);
    }

    handleError(err) {
        if ((err) && (err.reason)){
            this.setState({error: err.reason});
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
        const {history} = this.props;
        return (
            this.state.posts.map((post) => {
                let buttons = "";
                if (post["userCanEditDelete"]){
                    let editFunction = function(){history.push("/posts/edit/" + post._id);};
                    let deleteFunction = function(){this.handleDelete(post._id);};
                    let boundDeleteFunction = deleteFunction.bind(this);
                    buttons = (<><button onClick={editFunction}>Edit post</button>
						<button onClick={boundDeleteFunction}>Delete post</button></>);
                }
                let viewFunction = function(){
                    history.push("/posts/view/" + post._id);
                };
                return (
                    <div key={post._id}>
                        <p>Post title: {post.title}</p>
                        <p>Post created by: {post.username}</p>
                        <p><a href="javascript:void(0)" onClick={viewFunction}>View post</a></p>
                        {buttons}
                        <p>Number of comments: {(post.comments && post.comments.length) ? post.comments.length : 0}</p>
                        <p>Viewed: {post.views} time{post.views !== 1 ? "s" : ""}</p>
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
				{username ? this.makeCreateEditButtons() : this.makeLoginRegisterButtons()}
			</>
        )
    }
}

PostList.propTypes = {
    history: PropTypes.any
};
