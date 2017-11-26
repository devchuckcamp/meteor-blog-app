import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/posts.js';
import '../api/users.js';
import { createContainer } from 'meteor/react-meteor-data';


export class ChatUIWrapper extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      chatOpen: false,
      subscription: {
          onlineUsers: Meteor.subscribe('allOnlineUsers')
      }
    };

    this.getUser();

  }

  openChat(){
    this.setState({ chatOpen :!this.state.chatOpen });
    console.log(this.state.chatOpen);
  }

  getUser(){
    //console.log(Meteor.users.find({"username":"admin2"}));
    Meteor.subscribe('userList');
    let c = Meteor.users.find( "status":{"online": true} ).fetch();
    console.log(c);
  }

  render() {
    console.log(this.state.chatOpen);

    let users = this.props.onlineUsers;
    console.log(users);

    return (
   
        
      <div className="pull-right" >
        
            <div className="chat-container"> 
            
              <div className="chat-section">
              { this.state.chatOpen?
                <div  className="chat-block-head">
                  <button className="close-btn" onClick={this.openChat.bind(this)} >
                    Close
                  </button>
                  <button className="close-btn" onClick={this.openChat.bind(this)} >
                    <i className="fa fa-gear"></i>
                  </button>
                  <div className="online-user-block">
                    <ul className="online-user-block-listings">
                      {users.map((user)=>{
                          let me = Meteor.userId();
                          return <li key={user._id} className={me == user._id ? 'hide':''}>{user.status.online ? 'online':'offline'} - {user.username}</li>
                        
                        })
                      }
                    </ul>
                  </div>
                </div>
                
              :<button onClick={this.openChat.bind(this)} >Chat</button>
              }
              </div>
              
            </div>
            
        
        
      </div>
    );
  }
}

export default createContainer(() => {

  return {
    onlineUsers: Meteor.users.find({}).fetch(),
  };
}, ChatUIWrapper);