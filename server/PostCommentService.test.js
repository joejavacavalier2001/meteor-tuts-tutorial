/* eslint-env node, mocha */
import {assert} from 'chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Factory } from 'meteor/dburles:factory';
import { Meteor } from 'meteor/meteor'
import { PostCategoriesEnum } from '/db/posts/enums/categories';
import CommentService from '/imports/api/comments/services/service';
import PostService from '/imports/api/posts/services/service';

import '/db/links';

describe('Post and Comment Services', function () {
    var samplePostId = "-1";
    var sampleCommentId = "-1";
    var firstUserName = "";
    var secondUserName = "";
    var userCollection = null;
    var userStub = null;
    var userIdStub = null;

    var loginDummyUser = function(username){
        if (userStub){userStub.restore();}
        if (userIdStub){userIdStub.restore();}

        try{
            if (userCollection.has(username)){
                let newCurrentUser = userCollection.get(username);
                userStub = sinon.stub(Meteor,'user');
                userIdStub = sinon.stub(Meteor,'userId');
                userStub.returns(newCurrentUser);
                userIdStub.returns(newCurrentUser._id);
            } else {
                let emailArray = [];
                emailArray.push({address: username, verified: true});
                let dummyUser = Factory.create('user',{emails: emailArray, createdAt: Date.now(), services: {}});
                userStub = sinon.stub(Meteor, 'user');
                userIdStub = sinon.stub(Meteor, 'userId');
                userStub.returns(dummyUser);
                userIdStub.returns(dummyUser._id);
                userCollection.set(username,dummyUser);
            }
        } catch(e) {
            return false;
        }
        return true;
    };

    var loginFirstDummyUser = function(){
        return loginDummyUser(firstUserName);
    };

    var loginSecondDummyUser = function(){
        return loginDummyUser(secondUserName);
    };

    var checkPostObject = function(post){
        if (!post){
            assert.isNotFalse(post,"Could not obtain a copy of the saved post object");
            return false;
        }
        if (!(post instanceof Object)){
            assert.isObject(post,"Could not obtain a copy of the saved post object");
            return;
        }
        let mustHaveProperties = ['title','description','type','username','userCanEditDelete'];
        let reducerCallback = (previousConditions, currentProperty) => {return (previousConditions && post.hasOwnProperty(currentProperty));};
        if (mustHaveProperties.reduce(reducerCallback,true)){
            return true;
        }
        mustHaveProperties.forEach((missingKey) => {assert.property(post,missingKey,"The post object is missing the property: \"" + missingKey + "\".");});
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
        let reducerCallback = (previousConditions, currentProperty) => {return (previousConditions && comment.hasOwnProperty(currentProperty));};
        if (mustHaveProperties.reduce(reducerCallback,true)){
            return true;
        }
        assert.containsAllKeys(comment,mustHaveProperties,"Retrieved comment is missing one or more important properties.");
        return false;
    };

    before(function() {
        Factory.define('user', Meteor.users, {
        });
        userCollection = new Map();
        firstUserName = Math.random().toString(36).substring(7) + "@blah.com";
        secondUserName = Math.random().toString(36).substring(7) + "@blah.com";
    });

    it('Should be able to create a post', function () {
        var samplePost = {title: 'Sample title', description: 'Sample description', type: PostCategoriesEnum.NATURE};
        var samplePostObject = null;

        if (loginFirstDummyUser()){
            try {
                //Try to inform the other tests about the id of the newly created post.
                samplePostId = PostService.createPost(samplePost);
            } catch(e) {
                assert.isNotOk(e,"Post insertion possibily failed: " + e);
                return;
            }
            try{
                if (!samplePostId){
                    assert.isString(samplePostId,"Post insertion possibily failed. No id available for newly inserted Post object.");
                    return;
                }
                // Can I retrieve the newly inserted object? Does the new object exists in the Mongo DB?
                samplePostObject = PostService.getPostById(samplePostId);
            } catch(e) {
                assert.isNotOk(e,"Error retrieving newly saved post using id '" + samplePostId + "': " + e);
                return;
            }
            checkPostObject(samplePostObject); // Does the retrieved object look like a post object?
        } else {
            assert.isNotOk(true,"dummy user could not be logged in");
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
                    assert.isNotOk(e,"Problem saving modified post object: " + e);
                    return;
                }
                if (postUpdateStatus !== 1){
                    assert.strictEqual(postUpdateStatus,1,"Problem saving modified post object. Return value from updatePost = " + postUpdateStatus);
                    return;
                }
                samplePostObject = null;
                try {
                    samplePostObject = PostService.getPostById(samplePostId);
                } catch(e) {
                    assert.isNotOk(e,"Could not obtain copy of saved post after updating: " + e);
                    return;
                }
                if (checkPostObject(samplePostObject)){
                    assert.strictEqual(samplePostObject['title'],"Sample title2","Updated post title did not properly save");
                    assert.strictEqual(samplePostObject['description'],"Sample description2","Updated post description did not properly save");
                    assert.strictEqual(samplePostObject['type'],PostCategoriesEnum.MUSIC,"Updated post type did not properly save");
                    return;
                }
            }
        } else {
            assert.isNotOk(true,"dummy user could not be logged in");
        }
    });

    it('Should be able to add a comment to a post', function() {
        var sampleComment = {text: 'Sample text'};
        var commentArray = null;
        if (!samplePostId){
            assert.isOk(samplePostId,"Could not get a post id from the previous tests. Cannot continue.");
            return;
        }
        if (loginSecondDummyUser()){
            sampleComment['postId'] = samplePostId; // Manually tie a comment object to a parent post object
            try{
                //Try to inform the other tests about the id of the newly created comment.
                sampleCommentId = CommentService.createComment(sampleComment);
            } catch(e) {
                assert.isNotOk(e,"Problem inserting new comment for the newly created post: " + e);
                return;
            }
            assert.isString(sampleCommentId,"Comment insertion possibily failed. No id available for newly inserted Comment object.");
            try{
                // Can I retrieve the newly inserted object? Does the new object exists in the Mongo DB?
                commentArray = CommentService.getCommentsForPost(samplePostId);
            } catch(e) {
                assert.isNotOk(e,"Could not retrieved recently saved comment: " + e);
                return;
            }
            if (Array.isArray(commentArray)){
                //Do all the retrieved comment object(s) look like proper comment object(s)?
                commentArray.forEach((comment) => {checkCommentObject(comment);});
            } else {
                assert.isArray(commentArray,"getCommentsForPost did not return an array for the current post");
            }
        } else {
            assert.isNotOk(true,"dummy user could not be logged in");
        }
    });

    it('Should be able to edit a comment',function() {
        let sampleCommentObject = null;
        let modifiedCommentObject = null;
        if (!sampleCommentId){
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
        } else {
            assert.isNotOk(true,"dummy user could not be logged in");
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
                assert.isNotOk(e,"Exception thrown after attempting to retrieve a deleted post: " + e);
                return;
            }
            assert.isNotOk(samplePostObject,"This sample post should have been deleted");
            if (sampleCommentId){
                try{
                    sampleCommentObject = CommentService.getCommentById(sampleCommentId);
                } catch(e){
                    assert.isNotOk(e,"Exception thrown after attempting to retrieve a deleted comment for a deleted post: " + e);
                    return;
                }
                if ((sampleCommentObject) && (sampleCommentObject instanceof Object)){
                    assert.isNotOk(sampleCommentObject,"Comments for deleted posts should not exist in the database.");
                }
            }
        } else {
            assert.isNotOk(true,"dummy user could not be logged in");
        }

    });
});


