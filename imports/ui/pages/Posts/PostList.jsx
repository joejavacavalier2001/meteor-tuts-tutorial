import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

export default class PostList extends React.Component {
    constructor() {
        super();
        this.state = {posts: null, introductoryString: ""};

        Meteor.call('getCurrentUserName', (err,currentUserName) => {
            if (err) {
                this.setState({error: err.reason})
            } else {
                let newIntroductoryString = ((currentUserName) ? ("back " + currentUserName) : "");
                Meteor.call('post.list', (err, postResults) => {
                    if (err){
                        this.setState({error: err.reason + " " + err.stack});
                    } else {
                        this.setState({introductoryString: newIntroductoryString, posts: postResults});
                    }
                });
            }
        });
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
                        this.setState({introductoryString: "", posts: postResults});
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

    makeCreateEditButtons() {
        let gotoCreateFunction = function(){window.location.href = '/posts/create';};
        let boundGotoLogoutFunction = this.handleLogout.bind(this);
        return (<div><button onClick={gotoCreateFunction}>Create a new post</button><button onClick={boundGotoLogoutFunction}>Logout</button></div>);
    }

    makeLoginRegisterButtons(){
        let boundGotoLoginFunction = this.handleLogin.bind(this);
        let boundGotoRegisterFunction = this.handleRegister.bind(this);
        return (<div><button onClick={boundGotoLoginFunction}>Login</button><button onClick={boundGotoRegisterFunction}>Register</button></div>);
    }

    handleError(err) {
        if ((err) && (err.reason)){
            this.setState({error: err.reason});
        }
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
            this.state.posts.map((individualPost) => {
                let buttons = "";
                if (individualPost["userCanEditDelete"]){
                    let editFunction = function(){history.push("/posts/edit/" + individualPost._id);};
                    let boundDeleteFunction = this.handleDelete.bind(this,individualPost._id);
                    buttons = (<div><button onClick={editFunction}>Edit post</button>
                        <button onClick={boundDeleteFunction}>Delete post</button></div>);
                }
                let viewFunction = function(){
                    history.push("/posts/view/" + individualPost._id);
                };
                return (
                    <div key={individualPost._id}>
                        <p>Post title: {individualPost.title}</p>
                        <p>Post created by: {individualPost.username}</p>
                        <p><a href="javascript:void(0)" onClick={viewFunction}>View post</a></p>
                        {buttons}
                        <p>Number of comments: {(individualPost.comments && individualPost.comments.length) ? individualPost.comments.length : 0}</p>
                        <p>Viewed: {individualPost.views} time{individualPost.views !== 1 ? "s" : ""}</p>
                        <p>&nbsp;</p>
                    </div>
                );
            })
        );
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
        const {introductoryString} = this.state;
        const {error} = this.state;
        const {posts} = this.state;

        if (error){
            return (<p>Error retrieving posts: {error}</p>);
        }
        if (!posts) {
            return (<p>Loading....</p>);
        }

        // I will avoid using the React Fragment syntax. That syntax disrupts the color coding in github!
        return (
            <div>
                <h1>Welcome {introductoryString}</h1>
                {this.createPostsRenderer()}
                {introductoryString ? this.makeCreateEditButtons() : this.makeLoginRegisterButtons()}
            </div>
        );
    }
}

PostList.propTypes = {
    history: PropTypes.any
};
