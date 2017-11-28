import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


if (Meteor.isServer) {

  	// All Users
  	Meteor.publish('allOnlineUsers', function () {
	
		return Meteor.users.find({});  
	
	});
  	//Specific User
  	Meteor.publish('getAUser', function (id) {

		return Meteor.users.findOne({},{_id:id}).fetch();  
	
	});



};