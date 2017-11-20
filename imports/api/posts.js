import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Posts = new Mongo.Collection('posts');
//export const Likes = new Mongo.Collection('likes');
let dLimit = 2;
const added = 2;
// setInterval(function(){
//   dLimit++;
//   console.log(dLimit);
// },2000);

if (Meteor.isServer) {

  

  // This code only runs on the server
  Meteor.publish('posts', function postsPublication() {
    // return Recipes.find();
    // console.log(limiter,'limiter');
    dLimit += added;
   
    return Posts.find({
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

  
  'posts.insert'(name, content) {
    check(name, String);
    check(content, String);
    console.log('content',content);
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
  
    Posts.insert({
      name,
      content: content,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
    toastr.success('Post <b style="color:red;">'+name+'</b> added');
  },
  'posts.getTotal'() {

    let totalPosts = Posts.find({}).fetch().length;
    console.log(totalPosts);
    return totalPosts;

  },
  'posts.remove'(postID) {
    check(postID, String);
    console.log('ID:'+postID);

    var postInfo = Posts.findOne(postID);
    var postOwner = postInfo.owner;
    
    if (postOwner == Meteor.userId()){
      console.log('Can Delete');
      Posts.remove(postID);
      toastr.warning('Post <b style="color:red;">'+postInfo.name+'</b> has been deleted.', 'Success');
      
    } else {
      toastr.warning('You\'re not allowed to remove <b style="color:red;">'+postInfo.name+'</b> because you\'re not the author.', 'Permission');
      console.log('Not allowed to delete');
    }
    //Recipes.remove(recipeId);
  },
  'posts.setChecked'(postID, setChecked) {
    check(postID, String);
    check(setChecked, Boolean);
 
    Recipes.update(postID, { $set: { checked: setChecked } });
  },
  'posts.setPrivate'(postID, setToPrivate) {
    check(postID, String);
    check(setToPrivate, Boolean);
 
    const posts = Posts.findOne(postID);
 
    // Make sure only the recipes owner can make a recipes private
    if (posts.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Posts.update(postsID, { $set: { private: setToPrivate } });
  },
  'posts.ownBy'(postsID) {
    check(postsID, String);

    var rcp = Posts.findOne({_id:postsID});
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