import React from 'react';

export default class PostList extends React.Component {
    constructor() {
        super();
        this.state = {posts: null};
    }

    componentDidMount() {
        Meteor.call('post.list', (err, posts) => {
            this.setState({posts});
        });
    }

    render() {
        const {posts} = this.state;
        const {history} = this.props;

        if (!posts) {
            return <div>Loading....</div>
        }

        return (
            <div className="post">
				<h1>Testing</h1>
                {
                    posts.map((post) => {
                        return (
                             <div key={post._id}>
                                <p>Post id: {post._id} </p>
                                <p>Post title: {post.title}</p>
							    <p>Post Description: {post.description} </p>
								<p>Post type: {post.type} </p>
								<p>Post created on: {post.createdAt.toString()} </p>
								<p><a href="javascript:void(0)" onClick={() => {
									history.push("/posts/view/" + post._id)
								}}>Click here to view post</a></p>

                                <button onClick={() => {
                                    history.push("/posts/edit/" + post._id)
                                }}> Edit post
                                </button> 
                            </div>
                        )
                    })}
                <button onClick={() => history.push('/posts/create')}>Create a new post</button>
            </div>
        )
    }
}
