import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Posts} from '/db';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

class PostListReactive extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        const {posts, history} = this.props;

        if (!posts) {
            return <div>Loading....</div>
        }
        let gotoCreateFunction = function(){history.push("/posts/create");};
        return (
            <div className="post">
                {
                    posts.map((post) => {
                        post.views++;
                        let gotoEditFunction = function(){history.push("/posts/edit/" + post._id);};
                        return (
                            <div key={post._id}>
                                <p>Post id: {post._id} </p>
                                <p>Post title: {post.title}, Post Description: {post.description} </p>
                                <p>Post type: {post.type} </p>
                                <p>Post created: {post.createdAt} </p>
                                <p>Post viewed: {post.views} </p>
                                <button onClick={gotoEditFunction}>Edit post</button>
                            </div>
                        )
                    })}
                <button onClick={gotoCreateFunction}>Create a new post</button>
            </div>
        )
    }
}

PostListReactive.propTypes = {
    history: PropTypes.any,
    posts: PropTypes.array
};

export default withTracker(props => {
    const handle = Meteor.subscribe('posts');

    return {
        loading: !handle.ready(),
        posts: Posts.find().fetch(),
        ...props
    };
})(PostListReactive);


