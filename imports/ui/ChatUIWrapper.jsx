import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Meteor } from 'meteor/meteor';
import { Chats } from '../api/chats.js';

import '../api/users.js';

import { createContainer } from 'meteor/react-meteor-data';


export class ChatUIWrapper extends Component {
  
  constructor(props) {
    super(props);



    this.state = {
      chatOpen: false,
      subscription: {
        onlineUsers: Meteor.subscribe('allOnlineUsers')
      },
      openThread:[],
    };
  }

  // Online Users Listings
  openChat(){
    this.setState({ chatOpen :!this.state.chatOpen });
    // console.log(this.state.chatOpen);
  }

  getAUser(event){
    event.preventDefault();
    
    let uid = event.target.getAttribute('data-userid');
    let selectedUser = Meteor.users.find({_id:uid}).fetch();

    this.openChatThread(uid,Meteor.userId());
  }

  // thread box open/create
  openChatThread(to,from){
    //FROM
    let fromUID = Meteor.userId();
    let currentUser = Meteor.users.findOne({_id:fromUID});
    //TO
    let toUID = to;
    console.log(toUID);
    let recieverUser = Meteor.users.findOne({_id:toUID});

    Meteor.subscribe('chats');
    
    let chatThreadBox = this.isChatThreadNew(currentUser,recieverUser);
    
    //Create New Thread with empty messages if not found
    if(!chatThreadBox){
      Meteor.call('chats.insert', currentUser,recieverUser);
    }else{
      this.activeThreadBox();
      console.log('Found Thread');
    }

  }

  //check thread between two users
  isChatThreadNew(currentUser,recieverUser){
    
    let usersThread = [
        {
          _id:currentUser._id,
          username:currentUser.username
        },
        {
          _id:recieverUser._id,
          username:recieverUser.username
        }
    ];

    let usersThread1 = [
      {
        _id:recieverUser._id,
        username:recieverUser.username
      },
      {
        _id:currentUser._id,
        username:currentUser.username
      }
    ];

    let status  = Chats.find({$or: [{users:usersThread},{users:usersThread1}]}).count();
    let thread  = Chats.findOne({$or: [{users:usersThread},{users:usersThread1}]});
    
    if(status){
      return thread;
    }
    return status;
  }

  //Add Box UI
  createThreadBox(thread){

    this.state.openThread.push(thread); 
    console.log(this.state.openThread);
  }

  renderActiveThreadBox(){
    // return (this.state.openThread.map((openThread)=>{
    //   <div>
    //     <ul>
    //       <li>chat 1</li>
    //     </ul>
    //   </div>
    // }));
    const users = [
            {
              _id:"mij94443",
              message:"message 1",
              status:true
            },
            {
              _id:"mij944424",
              message:"message 2",
              status:true
            }
          ];

    let activeThread = [
            {
              _id:"2434324",
              active:true,
              messages:[
                {
                  _id:"mij94444",
                  message:"message 1",
                  status:true
                },
                {
                  _id:"mij944421",
                  message:"message 2",
                  status:true
                }
              ]
            },
            {
              _id:"2434325",
              active:true,
              messages:[
                {
                  _id:"mij9446",
                  message:"message 3",
                  status:true
                },
                {
                  _id:"mij944476",
                  message:"message 4",
                  status:true
                }
              ]
            }
          ];
    console.log(activeThread,'activeThread');
    return (activeThread.map((thread)=>{
      return thread.active ?
          
          <ul key={thread._id} className="active-thread">
            {this.renderMessages(thread.messages)}
          </ul>
          :''
    }));



   // let users = this.props.onlineUsers;

      //Display all users
      // return (users.map((user)=>{
      //   let me = Meteor.userId();
          
      //     return  user.status  ? 
      //     <ul key={user._id} className="active-thread">
      //       <li key={user._id} >
      //         <a href="#" className="users-list-a" data-userid={user._id} onClick={this.getAUser.bind(this)}>
      //           {user.message}
      //         </a>
      //       </li>
      //     </ul>
      //     :<h1>none</h1>
      // }));
    // console.log(users);
    // return (users.map((user)=>{
    //   return 
    //     <div key={user._id}>
    //       <span>{user.username}</span>
    //     </div>
    // }));
  }

  renderMessages(messages){
    
      return (messages.map((msg)=>{
        return msg.message ?
          <li key={msg._id}>
            {msg.message}
          </li>
          :
          <li>
            <span>Empty</span>
          </li>
      }));
  }


  renderOnlineUsers(userID){
      let users = this.props.onlineUsers;

      //Display all users
      return (users.map((user)=>{
        let me = Meteor.userId();
      
            return Meteor.userId() === user._id  || user.status.online===false ? '':

            <li key={user._id} >
              <a href="#" className="users-list-a" data-userid={user._id} onClick={this.getAUser.bind(this)}>
                {user.status.online ? 'online':'offline'} - {user.username}
              </a>
            </li>
      }));
  }

  render() {
    // console.log(this.state.chatOpen);
    return (
      <div>
        
       
        <div className="pull-right" >
              <div className="chat-container"> 
                <div className="active-thread-list">
                  
                    {this.renderActiveThreadBox()}
                  
                </div>

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
                        {this.renderOnlineUsers()}
                      </ul>
                    </div>
                  </div>
                :<button onClick={this.openChat.bind(this)} >Chat</button>
                }
                </div>
              </div>
        </div>
    </div>
    );
  }
}

export default createContainer(() => {

  return {
    onlineUsers: Meteor.users.find({},{status:{online:true}}).fetch(),
    activeThreadBox:Chats.find({}).fetch(),

  };
}, ChatUIWrapper);