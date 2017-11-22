import { Meteor } from 'meteor/meteor';
import '../imports/api/posts.js';
import '../imports/api/comments.js';

import { Accounts } from 'meteor/accounts-base';
// export const Likes = new Mongo.Collection('blog');


Meteor.startup(() => {
  // code to run on server at startup
});


Accounts.onCreateUser((options, user) => {
  const customizedUser = Object.assign({
    profile:{role: 2,}
  }, user);
  // We still want the default hook's 'profile' behavior.
  if (options.profile) {
    customizedUser.profile = options.profile;
  }
  return customizedUser;
});
