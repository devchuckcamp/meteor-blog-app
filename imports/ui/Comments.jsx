import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

import { Comments } from '../api/comments.js';
import moment from 'moment';

// Task component - represents a single todo item
export default class Comment extends Component {
  
  // toggleChecked() {
  //   Meteor.call('recipes.setChecked', this.props.recipe._id, !this.props.recipe.checked);
  // }

  render() {
  	// Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    // const postClassName = this.props.post.checked ? 'checked' : '';
    // const likeClass = this.props.post.checked ? 'fa fa-heart-o' : 'fa fa-heart';
    // const isLogged = Meteor.user();
    // // Format ISO formatted date from mongo using Moment JS
    // let publishedDate = moment(this.props.post.createdAt).format('MMM DD YYYY h:mm:s');
    // let ownerID = this.props.post.owner;
    // let postID = this.props.post._id;
    // let userID = Meteor.userId();

    return (
      <p>Comment</p>
    );
  }
}
 
Comment.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  comment: PropTypes.object.isRequired
};
