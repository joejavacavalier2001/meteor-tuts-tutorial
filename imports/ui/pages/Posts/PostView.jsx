import React from 'react';
import { Meteor } from 'meteor/meteor';
import CommentList from '/imports/ui/pages/Comments/CommentList';
import PropTypes from 'prop-types';

export default class PostView extends React.Component {
    constructor() {
        super();
        this.state = {post: null, err: null};
    }

    componentDidMount() {
        Meteor.call('post.increment.views', this.props.match.params._id, (err, post) => {
            if (err){
                this.setState({err: err.reason});
            } else {
                this.setState({'postLoaded': post});
            }
        });
    }

    render() {
        const {history} = this.props;
        const {postLoaded} = this.state;

        // I will avoid using the React Fragment syntax. That syntax disrupts the color coding in github!
        if (this.state.err) {
            return (
                <div>
                    <p>Error retrieving post information:</p>
                    <p>{this.state.err}</p>
                </div>
            );
        }
        let gotoPostsFunction = function(){history.push('/posts');};
        if (!postLoaded) {
            return (
                <div>
                    <p>Loading....</p>
                    <button onClick={gotoPostsFunction}>Back to posts</button>
                </div>
            );
        }
        let editFunction = function(){history.push("/posts/edit/" + postLoaded._id)};
        let editButton = ((postLoaded.userCanEditDelete) ? (<button onClick={editFunction}>Edit post</button>) : (""));
        return (
            <div>
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
                <button onClick={gotoPostsFunction}>Back to posts</button>
            </div>
        );
    }
}

PostView.propTypes = {
    history: PropTypes.any,
    match: PropTypes.shape({
        params: PropTypes.shape({
            _id: PropTypes.string
        })
    })
};

