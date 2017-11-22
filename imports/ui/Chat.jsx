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
      updateThisCommentReady: false,
      commentEditReadyList:[]
    };
  }

  getUserProfile(){
    let user = Meteor.user().profile;
    return user;
  }

  deleteThisPost(event,el) {
    // event.preventDefault();
    let userProfile = '';
    let postID = el.target.getAttribute('dataid');
    if(Meteor.user()){
      userProfile = Meteor.user().profile;
    }
    if ( Meteor.user() && userProfile.role == 1){
      console.log('to remove post:', el.target.getAttribute('dataid'));
      Meteor.call('posts.remove', postID);  
    }else{
      toastr.warning('Sorry but you\'re not allowed to remove comments!', 'Permission Denied');
    }
  	
  }

  updateThisCommentReady(event){
    this.setState({ updateThisCommentReady :!this.state.updateThisCommentReady });
    console.log(this.state.updateThisCommentReady);
    
    let commentID = event.target.getAttribute("commentdataid");

    let arraycontainsReadyEditComment = this.isCommentOnReadyMode(commentID);
    if(arraycontainsReadyEditComment){
      console.log('Already Ready');
      this.state.commentEditReadyList.splice(event.target.getAttribute("commentdataid"),1);
    }else{
      this.state.commentEditReadyList.push(event.target.getAttribute("commentdataid"));
    }
    
    console.log(this.state.commentEditReadyList);
  }

  isCommentOnReadyMode(commentID){
    let myarr = this.state.commentEditReadyList;
    let arraycontainsReadyEditComment = (myarr.indexOf(commentID) > -1);
    if(arraycontainsReadyEditComment){
      
      return true;
    }

    return false;
  }

  updateThisComment(event,el){
    // event.preventDefault();
    let userProfile = '';
    let commentID = el.target.getAttribute('dataid');
    if(Meteor.user()){
      userProfile = Meteor.user().profile;
    }
    if ( Meteor.user() && userProfile.role == 1){
      console.log('to remove comment:', el.target.getAttribute('dataid'));
      Meteor.call('comments.remove', commentID);  
    }else{
      toastr.warning('Sorry but you\'re not allowed to remove comments!', 'Permission Denied');
    }
  }

  deleteThisComment(event,el){
    // event.preventDefault();
    let userProfile = '';
    let commentID = el.target.getAttribute('dataid');
    if(Meteor.user()){
      userProfile = Meteor.user().profile;
    }
    if ( Meteor.user() && userProfile.role == 1){
      console.log('to remove comment:', el.target.getAttribute('dataid'));
      Meteor.call('comments.remove', commentID);  
    }else{
      toastr.warning('Sorry but you\'re not allowed to remove comments!', 'Permission Denied');
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
    //console.log(this.state.commentReady);
    return false;
  }

  comment(event) {
    event.preventDefault();
    // const postID = ReactDOM.findDOMNode(this).getAttribute("datapost").value;
    //console.log(Meteor.userId(),this.props.post._id);
    return false;
  }

  updateComment(event,el){
    let commentFieldId = event.target.getAttribute("data-id");
    let newCommentVal = document.getElementById('commentField-'+commentFieldId).value;
    let roleID = this.getUserProfile().role; 
    let arraycontainsReadyEditComment = this.isCommentOnReadyMode(commentFieldId);
    
    if(arraycontainsReadyEditComment){
      
      if(roleID==1){
        this.state.commentEditReadyList.splice(event.target.getAttribute("commentdataid"),1);
        Meteor.call('comments.update',commentFieldId,newCommentVal);
      }else{
        toastr.warning('Sorry but you\'re not allowed to update comments!', 'Permission Denied');
      }
      
    }
   

  }

  renderComment(post_id){

    let comments = Comments.find({"post_id":post_id},{},).fetch();

    return comments.map((comment) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = comment.post_owner === currentUserId;
      const owned = comment.comment_by === Meteor.userId() ? true : false ;
      const commentPublishedDate = moment(comment.createdAt).format('MMM DD YYYY h:mm:s');
      let userProfile = '';
      let commentEditReady = this.isCommentOnReadyMode(comment._id);
      let commentIDField = 'commentField-'+comment._id;

      if(Meteor.user()){
        userProfile = this.getUserProfile();
      }
      // console.log(comment._id);
      return (
        <li 
          className="comment-list"
          key={comment._id}
          commentid={comment._id}
          authorid = {comment.comment_by}
          author = {comment.comment_by_username}
        > 

       
           { 
            userProfile.role ==1 ?
            <div>
              { !commentEditReady ?
                <button className="edit-btn" commentdataid={comment._id} onClick={this.updateThisCommentReady.bind(this)}>
                  <i className="fa fa-pencil"></i>
                  Edit
                </button>
                :
                <button className="edit-btn-close" commentdataid={comment._id} onClick={this.updateThisCommentReady.bind(this)}>
                  <i className="fa fa-close "></i>
                  Cancel
                </button>
              }
              <button className="delete-btn" dataid={comment._id} onClick={this.deleteThisComment.bind(this)}>
                <i className="fa fa-trash"></i>
                Delete
              </button>
            </div> : ''
          }

          { owned ? 'Me' :
            <a href="#">
              {comment.comment_by_username}
            </a>
           } - {commentPublishedDate}

           { commentEditReady ?
              <div>
                <textarea className="full-w" 
                  
                  id={commentIDField}
                  defaultValue={comment.comment}></textarea>
                  <button
                    className="commentField-btn"
                    data-id={comment._id} 
                    onClick={this.updateComment.bind(this)}>
                    Update
                  </button>
              </div>
            : <p>{comment.comment}</p>

           }
          
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
    let userProfile = '';

    if(Meteor.user()){
      userProfile = this.getUserProfile();
    }
    // let userProfile = this.getUser();

    return (
      <li className={postClassName}>
        <div>
          <h3>{this.props.post.name} - { publishedDate }</h3>
          { 
            userProfile.role ==1 ?
          <div>
           
            <button className="delete-btn" dataid={this.props.post._id} onClick={this.deleteThisPost.bind(this,this.dataid)}>
              <i className="fa fa-trash"></i>
              Delete
            </button>

          </div> : ''
          }
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
                  <div className="form-group pad-l-40 pad-t-10 mar-b-0">
                    <textarea 
                        className="full-w"
                        placeholder="Comment..."
                        ref="commentInput"
                        required
                    ></textarea>
                  </div>
                  <div className="form-group pad-l-40">
                    <button className="close-comment" onClick={this.commentReady.bind(this)}>
                      X
                    </button>
                    <button  className="submit-new-comment" type="submit">
                      Submit
                    </button>
                  </div>

                </form>
              </div>
            </div> : '' }
          <span className="text pad-l-40">
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