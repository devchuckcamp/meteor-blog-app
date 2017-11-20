import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Comments = new Mongo.Collection('comments');
//export const Likes = new Mongo.Collection('likes');
let dLimit = 2;
const added = 2;
// setInterval(function(){
//   dLimit++;
//   console.log(dLimit);
// },2000);

if (Meteor.isServer) {

  

  // This code only runs on the server
  Meteor.publish('comments', function commentsPublication() {
    // return Recipes.find();
    // console.log(limiter,'limiter');
    dLimit += added;
   
    return Comments.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },

      ],
    },
    {start: 0, limit:dLimit},
    );
  });

  // Meteor.publish('totalRecipes', function() {
  //     // console.log(Recipes.find({}).fetch());
  //     let totalRecipes = Recipes.find({}).fetch().length;
  //     console.log(totalRecipes);
  //     return totalRecipes;
  // });
}

let defaultDisplay = 5;
Meteor.methods({


  'comments.get_post_comments'(post_id) {
    check(post_id, String);
    // Make sure the user is logged in before inserting a task
    if (! Meteor.user()) {
      throw new Meteor.Error('not-authorized');
    }
  
    let com = Comments.find({"post_id":post_id}).fetch();
    console.log(com);
  },
  'comments.insert'(post_id, post_owner, owner_username, comment) {
    check(post_id, String);
    check(post_owner, String);
    check(owner_username, String);
    check(comment, String);

    // Make sure the user is logged in before inserting a task
    if (! Meteor.user()) {
      toastr.warning('You must be logged in to comment on post blogs!');
      throw new Meteor.Error('not-authorized');

    }
    
    console.log(post_id, 'post');
    console.log(post_owner, 'post');
    console.log(owner_username, 'post');
    console.log(comment, 'post');

    Comments.insert({
      post_id,
      post_owner,
      owner_username,
      comment,
      comment_by: Meteor.userId(),
      comment_by_username: Meteor.user().username,
      createdAt: new Date(),
    });
    toastr.success('Comment added');
  },
  'comments.getTotal'() {

    let totalPosts = Comments.find({}).fetch().length;
    console.log(totalPosts);
    return totalPosts;

  },
  'comments.remove'(postID) {
    check(postID, String);
    console.log('ID:'+postID);

    var postInfo = Posts.findOne(postID);
    var postOwner = postInfo.owner;
    
    if (postOwner == Meteor.userId()){
      console.log('Can Delete');
      Comments.remove(postID);
      toastr.warning('Post <b style="color:red;">'+postInfo.name+'</b> has been deleted.', 'Success');
      
    } else {
      toastr.warning('You\'re not allowed to remove <b style="color:red;">'+postInfo.name+'</b> because you\'re not the author.', 'Permission');
      console.log('Not allowed to delete');
    }
    //Recipes.remove(recipeId);
  },
  'comments.setChecked'(postID, setChecked) {
    check(postID, String);
    check(setChecked, Boolean);
 
    Comments.update(postID, { $set: { checked: setChecked } });
  },
  'comments.setPrivate'(postID, setToPrivate) {
    check(postID, String);
    check(setToPrivate, Boolean);
 
    const posts = Comments.findOne(postID);
 
    // Make sure only the recipes owner can make a recipes private
    if (posts.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Comments.update(postsID, { $set: { private: setToPrivate } });
  },
  'comments.ownBy'(postsID) {
    check(postsID, String);

    var rcp = Comments.findOne({_id:postsID});
    var rowner = Meteor.users.findOne(rcp.owner);
 
    // Make sure only the recipes owner can make a recipes private
    // if (recipes.owner !== Meteor.userId()) {
    //   throw new Meteor.Error('not-authorized');
    // }
    console.log(rowner);
    return rowner;
    //Recipes.update(recipeId, { $set: { private: setToPrivate } });
  },

});