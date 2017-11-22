import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Chats = new Mongo.Collection('chats');
//export const Likes = new Mongo.Collection('likes');
let dLimit = 2;
const added = 2;
// setInterval(function(){
//   dLimit++;
//   console.log(dLimit);
// },2000);

if (Meteor.isServer) {

  

  // This code only runs on the server
  Meteor.publish('chats', function postsPublication() {
    // return Recipes.find();
    // console.log(limiter,'limiter');
    dLimit += added;
   
    return Chats.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },

      ],
    },
    {start: 0, limit:dLimit},
    );
  });
}





let defaultDisplay = 5;
Meteor.methods({
  
  'chats.insert'(name, content) {
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
  'chats.getTotal'() {

    let totalPosts = Posts.find({}).fetch().length;
    console.log(totalPosts);
    return totalPosts;

  },
  'chats.remove'(postID) {
    check(postID, String);
    console.log('ID:'+postID);

    var postInfo = Posts.findOne(postID);
    var postOwner = postInfo.owner;
    var userProfile = Meteor.user().profile;
    console.log(userProfile.role);

    if (Meteor.user() && userProfile.role == 1){
      console.log('Can Delete');
      Posts.remove(postID);
      toastr.warning('Post has been deleted.', 'Deleted');

    } else {
      toastr.warning('You\'re not allowed to remove a Post because you\'re not the author.', 'Permission Denied');
    }

  },
  'chats.setChecked'(postID, setChecked) {
    check(postID, String);
    check(setChecked, Boolean);
 
    Recipes.update(postID, { $set: { checked: setChecked } });
  },
  'chats.setPrivate'(postID, setToPrivate) {
    check(postID, String);
    check(setToPrivate, Boolean);
 
    const posts = Posts.findOne(postID);
 
    // Make sure only the recipes owner can make a recipes private
    if (posts.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Posts.update(postsID, { $set: { private: setToPrivate } });
  },
  'chats.ownBy'(postsID) {
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