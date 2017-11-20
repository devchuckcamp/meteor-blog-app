import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

import { Posts } from '../api/posts.js';
import { Comments } from '../api/comments.js';

import moment from 'moment';

// Task component - represents a single todo item
export default class Post extends Component {
  
  // toggleChecked() {
  //   Meteor.call('recipes.setChecked', this.props.recipe._id, !this.props.recipe.checked);
  // }
  constructor(props) {
    super(props);

    this.state = {
      commentReady: false,
    };
  }

  deleteThisPost() {
    if ( Meteor.user()){
      Meteor.call('posts.remove', this.props.post._id);  
    }else{
      toastr.warning('You must login to update <b style="color:red;">'+name+'</b> post');
    }
  	
  }

  togglePrivate() {
    Meteor.call('posts.setPrivate', this.props.post._id, ! this.props.post.private);
  }

  getOwner(id) {
    Meteor.call('posts.ownBy',id);
  }

  submitComment(event)  {
    event.preventDefault();
    
    const comment = ReactDOM.findDOMNode(this.refs.commentInput).value.trim();
    
    Meteor.call('comments.insert', this.props.post._id, this.props.post.owner, this.props.post.username, comment);

    // Clear form
    ReactDOM.findDOMNode(this.refs.commentInput).value = '';
    this.setState({ commentReady :!this.state.commentReady });
  }

  commentReady(event) {
    event.preventDefault();
    // const postID = ReactDOM.findDOMNode(this).getAttribute("datapost").value;
    // console.log(Meteor.userId(),this.props.post._id);
    this.setState({ commentReady :!this.state.commentReady });
    console.log(this.state.commentReady);
    return false;
  }

  comment(event) {
    event.preventDefault();
    // const postID = ReactDOM.findDOMNode(this).getAttribute("datapost").value;
    console.log(Meteor.userId(),this.props.post._id);
    return false;
  }

  renderComment(post_id){

    let comments = Comments.find({"post_id":post_id},{},).fetch();

    return comments.map((comment) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = comment.post_owner === currentUserId;
      const owned = comment.comment_by === Meteor.userId() ? true : false ;
      const commentPublishedDate = moment(comment.createdAt).format('MMM DD YYYY h:mm:s');
      return (
        <li 
          className="comment-list"
          key={comment._id}
          commentid={comment._id}
          authorid = {comment.comment_by}
          author = {comment.comment_by_username}
        > 
          { owned ? 'Me' :
            <a href="#">
              {comment.comment_by_username}
            </a>
           } - {commentPublishedDate}
          <p>{comment.comment}</p>
          { owned ? 
            <a href="#">Edit</a>
            :''
          }
        </li>
      );
    });
  }

  render() {
  	// Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const postClassName = this.props.post.checked ? 'checked' : '';
    const likeClass = this.props.post.checked ? 'fa fa-heart-o' : 'fa fa-heart';
    const isLogged = Meteor.user();
    // Format ISO formatted date from mongo using Moment JS
    let publishedDate = moment(this.props.post.createdAt).format('MMM DD YYYY h:mm:s');
    let ownerID = this.props.post.owner;
    let postID = this.props.post._id;
    let userID = Meteor.userId();
    let commentReady = this.state.commentReady;

    return (
      <li className={postClassName}>
        <div>
          <h3>{this.props.post.name} - { publishedDate }</h3>
        </div>
        <div>
          <p>
            {this.props.post.content}
          </p>
        </div>
        <div>
          <span className="text">
            Author:<strong>{ this.props.post.username }</strong>
          </span>
        </div>

        <div>
          <ul className="comment-list-ul">
             {this.renderComment(this.props.post._id)}
          </ul>
        </div>

        <div>
          { commentReady ?
            <div>
              <div>
                <form onSubmit={this.submitComment.bind(this)}>
                  <div className="form-group">
                    <textarea 
                        placeholder="Comment..."
                        ref="commentInput"
                        required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <button onClick={this.commentReady.bind(this)}>
                      X
                    </button>
                    <button type="submit">
                      Submit
                    </button>
                  </div>

                </form>
              </div>
            </div> : '' }
          <span className="text">
            { ! commentReady ?
            <a href="#" onClick={this.commentReady.bind(this)}>
              Comment
            </a> : ''}
          </span>
          
        </div>
      </li>
    );
  }
}
 
Post.propTypes = {

  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  post: PropTypes.object.isRequired,
  showPrivateButton: PropTypes.bool.isRequired,
  comment: PropTypes.array
};