/* eslint-env node, mocha */
import {assert} from 'chai';
import { Meteor } from 'meteor/meteor'
import { PostCategoriesEnum } from '/db/posts/enums/categories';
import CommentService from '/imports/api/comments/service';
import PostService from '/imports/api/posts/service';


describe('Post and Comment Services', function () {
    var samplePost = {title: 'Sample title', description: 'Sample description', type: PostCategoriesEnum.NATURE};
    var sampleComment = {text: 'Sample text'};
    var samplePostId = "-1";
    var sampleCommentId = "-1";
	

    var loginFirstDummyUser = function(){
        let currentUserId;
        try{
            Meteor.loginWithPassword('a@blah', 'a');
        } catch(e) {
            return false;
        }
        currentUserId = Meteor.userId();
        if (!currentUserId){
            assert.isOk(currentUserId,"Meteor system could not login dummy user.");
            return false;
        }
        return true;
    };

    var loginSecondDummyUser = function(){
        let currentUserId;
        try{
            Meteor.loginWithPassword('b@blah', 'b');
        } catch(e) {
            return false;
        }
        currentUserId = Meteor.userId();
        if (!currentUserId){
            return false;
        }
        return true;
    };

    var logoutCurrentUser = function(){
        Meteor.logout();
        if (Meteor.user()){
            return false;
        }
        return true;
    };

    var checkPostObject = function(post){
        if (!post){
            assert.isNotFalse(post,"Coult not obtain a copy of the saved post object");
            return false;
        }
        if (!(post instanceof Object)){
            assert.isObject(post,"Could not obtain a copy of the saved post object");
            return;
        }
        let mustHaveProperties = ['title','description','type','username','userCanEditDelete'];
        let reducerCallback = (acc, currentProp) => {return (acc && post.hasOwnProperty(currentProp));};
        if (mustHaveProperties.reduce(reducerCallback,true)){
            return true;
        }
        assert.containsAllKeys(post,mustHaveProperties,"Retrieved post is missing one or more important properties.");
        return false;
    };

    var checkCommentObject = function(comment){
        if (!comment){
            assert.isNotFalse(comment,"Coult not obtain a copy of the saved comment object");
            return false;
        }
        if (!(comment instanceof Object)){
            assert.isObject(comment,"Could not obtain a copy of the saved comment object");
            return;
        }
        let mustHaveProperties = ['text','username','userCanEdit','userCanDelete'];
        let reducerCallback = (acc, currentProp) => {return (acc && comment.hasOwnProperty(currentProp));};
        if (mustHaveProperties.reduce(reducerCallback,true)){
            return true;
        }
        assert.containsAllKeys(comment,mustHaveProperties,"Retrieved comment is missing one or more important properties.");
        return false;
    };
    beforeEach(function() {
        //If there is a logged in user, try to logout the user before each test
        try{
            Meteor.logout();
        } catch(e) {
            return; //logout might throw an error if a user is logged in, I really don't care about that exception
        }
    });

    it('Should be able to create a post', function () {
        var samplePostObject = null;
        var localSamplePostId = null;

        if (loginFirstDummyUser()){
            try {
                localSamplePostId = PostService.createPost(samplePost);
                if (!localSamplePostId){
                    assert.isString(localSamplePostId,"Post insertion possibily failed. No id available for newly inserted Post object.");
                    return;
                }
                samplePostObject = PostService.getPostById(localSamplePostId);
            } catch(e) {
                assert.isNotOk(e,"Post insertion possibily failed: " + e);
            }
            checkPostObject(samplePostObject);
            logoutCurrentUser();
        }
    });

    it('Should be able to edit a post', function() {
        let samplePostObject = null;
        let postUpdateStatus = 0;
        if (!samplePostId){
            assert.isOk(samplePostId,"Could not get a post id from the previous test. Cannot continue.");
            return;
        }
        if (loginFirstDummyUser()){
            try {
                console.log("global post id is " + samplePostId); // eslint-disable-line no-console
                samplePostObject = PostService.getPostById(samplePostId);
            } catch(e) {
                assert.isNotOk(e,"Could not obtain copy of saved post for editing: " + e);
            }
            if (checkPostObject(samplePostObject)){
                try {
                    samplePostObject['title'] = "Sample title2";
                    samplePostObject['description'] = "Sample description2";
                    samplePostObject['type'] = PostCategoriesEnum.MUSIC;
                } catch(e) {
                    assert.isNotOk(e,"Problem modifying post object properties: " + e);
                    return;
                }
                try {
                    postUpdateStatus = PostService.updatePost(samplePostId,samplePostObject);
                } catch(e){
                    assert.strictEqual(postUpdateStatus,1,"Problem saving specific modified post object: " + e);
                }
                if (postUpdateStatus !== 1){
                    assert.strictEqual(postUpdateStatus,1,"Problem saving specific modified post object");
                    return;
                }
                samplePostObject = null;
                try {
                    samplePostObject = PostService.getPostById(samplePostId);
                } catch(e) {
                    assert.isNotOk(e,"Could not obtain copy of saved post after updating: " + e);
                }
                if (checkPostObject(samplePostObject)){
                    assert.strictEqual(samplePostObject['title'],"Sample title2","Updated post title did not properly save");
                    assert.strictEqual(samplePostObject['description'],"Sample description2","Updated post description did not properly save");
                    assert.strictEqual(samplePostObject['type'],PostCategoriesEnum.MUSIC,"Updated post type did not properly save");
                    return;
                }
            }
            logoutCurrentUser();
        }
    });

    it('Should be able to add a comment to a post', function() {
        let commentCount = 0;
        let commentArray = null;
        if (!samplePostId){
            assert.isOk(samplePostId,"Could not get a post id from the previous test. Cannot continue.");
            return;
        }
        if (loginSecondDummyUser()){
            sampleComment['postId'] = samplePostId;
            try{
                sampleCommentId = CommentService.createComment(sampleComment);
            } catch(e) {
                assert.isNotOk(e,"Problem inserting new comment for the newly created post: " + e);
                return;
            }
            try{
                commentCount = PostService.getCommentCountForPost(samplePostId);
            } catch(e) {
                assert.isNotOk(e,"Problem retrieving comment count for post: " + e);
                return ;
            }
            assert.strictEqual(commentCount,1,"There should only be exactly one comment saved for the current post.");
            assert.isString(global.sampleCommentId,"Comment insertion possibily failed. No id available for newly inserted Comment object.");
            try{
                commentArray = CommentService.getCommentsForPost(samplePostId);
            } catch(e) {
                assert.isNotOk(e,"Could not retrieved recently saved comment: " + e);
                return;
            }
            if ((commentArray) && (commentArray.isArray())){
                commentArray.forEach((comment) => {checkCommentObject(comment);});
            } else {
                assert.isArray(commentArray,"getCommentsForPost did not return an array for the current post");
            }
            logoutCurrentUser();
        }
    });

    it('Should be able to edit a comment',function() {
        let sampleCommentObject = null;
        let modifiedCommentObject = null;
        if (!global.sampleCommentId){
            assert.isOk(sampleCommentId,"Could not get a comment id from the previous test. Cannot continue.");
            return;
        }
        if (loginSecondDummyUser()){
            try{
                sampleCommentObject = CommentService.getCommentById(sampleCommentId);
            } catch(e){
                assert.isNotOk(e,"Problem retrieving saved comment: " + e);
                return;
            }
            if (checkCommentObject(sampleCommentObject)){
                try{
                    sampleCommentObject['text'] = "Sample text2";
                } catch(e){
                    assert.isNotOk(e,"Problem modifying comment properties: " + e);
                    return;
                }
                try{
                    CommentService.updateComment(sampleCommentId,sampleCommentObject);
                }catch(e){
                    assert.isNotOk(e,"Problem saving specific modified comment object: " + e);
                    return;
                }
                try{
                    modifiedCommentObject = CommentService.getCommentById(sampleCommentId);
                } catch(e){
                    assert.isNotOk(e,"Problem retrieving saved comment after updating: " + e);
                    return;
                }
                if (checkCommentObject(modifiedCommentObject)){
                    assert.strictEqual(modifiedCommentObject["text"],"Sample text2","Updated comment text property did not properly save.");
                }
            }
            logoutCurrentUser();
        }
    });

    it('Should be able to delete a post',function(){
        let samplePostObject = null;
        let sampleCommentObject = null;
        if (!samplePostId){
            assert.isOk(samplePostId,"Could not get a post id from the previous test. Cannot continue.");
            return;
        }
        if (loginFirstDummyUser()){
            try{
                PostService.deletePost(samplePostId);
            } catch(e){
                assert.isNotOk(e,"Problem deleting sample post: " + e);
                return;
            }
            try {
                samplePostObject = PostService.getPostById(samplePostId);
            } catch(e){
                assert.isOk(e,"Exception thrown after attempting to retrieve a deleted post: " + e);
                return;
            }
            assert.isNotOk(samplePostObject,"This sample post should have been deleted");
            if (sampleCommentId){
                try{
                    sampleCommentObject = CommentService.getCommentById(sampleCommentId);
                } catch(e){
                    assert.isOk(e,"Exception thrown after attempting to retrieve a deleted comment for a deleted post: " + e);
                    return;
                }
                if ((sampleCommentObject) && (sampleCommentObject instanceof Object)){
                    assert.isNotOk(sampleCommentObject,"Comments for deleted posts should not exist in the database.");
                }
            }
            logoutCurrentUser();
        }
    });
});


