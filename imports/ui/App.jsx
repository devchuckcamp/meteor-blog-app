import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types'; 

import { Posts } from '../api/posts.js';
import { Comments } from '../api/comments.js';
// import { Likes } from '../api/likes.js';
import { Template } from 'meteor/templating'; 
import Post from './Posts.jsx';
import Comment from './Comments.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 import { Accounts } from 'meteor/accounts-base';


Template.registerHelper("mdy", function (date) {
  if (date) {
    return moment.utc(date).format('MM/DD/YYYY');
  }
});

// App component - represents the whole app
export class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: true,
    };
  }

  addPost(event) {
    event.preventDefault();
    //console.log(event,'the event');
    // Find the text field via the React ref
    const name = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
    const content = ReactDOM.findDOMNode(this.refs.contentInput).value;
    Meteor.call('posts.insert', name,content);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.titleInput).value = '';
    ReactDOM.findDOMNode(this.refs.contentInput).value = '';
  }

    renderPost(update) {
      let display = update || false;
      let filteredPost = this.props.posts;

      if( !display ){
        filteredPost = this.props.posts;
      }
      
      //console.log(display,filteredPost);
      if (this.state.hideCompleted) {
        filteredPost = filteredPost.filter(post => !post.checked);
      }
      // return filteredPost.map((recipe) => (
      //   <Recipe key={recipe._id} recipe={recipe} />
      // ));

      return filteredPost.map((post) => {
        const currentUserId = this.props.currentUser && this.props.currentUser._id;
        const showPrivateButton = post.owner === currentUserId;
   
        return (
          <Post
            key={post._id}
            post={post}
            showPrivateButton={showPrivateButton}
          />
        );
      });
    }
  getUserProfile(){
    let user = Meteor.user().profile;
    return user;
  }

  render() {
    let user = this.props.currentUser;
    if(Meteor.user()){
      let userProfile = this.getUserProfile();
    }
    
    return (
      <div className="container"  id="container-fluid" >

        <header>
          {user ?
          <label>Hello, </label> 
          :''}          
          <AccountsUIWrapper />
         
        </header>
          
          {user ?
             <form className="new-post" onSubmit={this.addPost.bind(this)} >
              <div className="form-group">
                <input
                  type="text"
                  ref="titleInput"
                  placeholder="Type Post Title"
                  required
                />
              </div>
              <div className="form-group">
                <textarea type="text" required
                  className="full-w"
                  ref="contentInput" placeholder="Share your thoughts"></textarea>
              </div>
              <div className="form-group">
                <button type="submit" className="submit-btn">Post</button>
              </div>
            </form> : ''

          }
          
          <div className="col-md-12">
            <ul className="recipe-list-container" id="recipe-list-container">
              {this.renderPost( false )}
              
            </ul>
          </div>

      </div>
    );
  }
}


App.propTypes = {
  posts: PropTypes.array.isRequired,
  comments: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  Meteor.subscribe('posts');
  Meteor.subscribe('comments');

  return {
    posts: Posts.find({}, { sort: { createdAt: -1 } } ).fetch(),
    comments: Comments.find({}, { sort: { createdAt: -1 } } ).fetch(),
    incompleteCount: Posts.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);