import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


if (Meteor.isServer) {

  // This code only runs on the server
  	Meteor.publish('allOnlineUsers', function () {
		return Meteor.users.find({});  
	}); 


};

