import React from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, Animated } from 'react-native';
import {Header, Icon, Badge, ListItem} from 'react-native-elements';

import { SwipeListView } from 'react-native-swipe-list-view';
import db from '../config';
import firebase from 'firebase';


export default class SwipableFlatlist extends React.Component{
    constructor(props){
        super(props);
        this.state={
            allNotifications:[],
            userId:firebase.auth().currentUser.email
        }
    }
    getNotifications=()=>{
       
        db.collection("all_notifications").where("notification_status","==","unread").where("targeted_user_id","==",this.state.userId).onSnapshot((snapshot)=>{
          var all_notification=[]
          snapshot.docs.map((doc)=>{
              var notifications=doc.data();
              notifications["doc_id"]=doc.id
              all_notification.push(notifications);
          })
          this.setState({
              allNotifications:all_notification
          })
          
        })
    }
    componentDidMount(){
        this.getNotifications()
    }
  /*  renderItem=({item,index})=>{
        return(
            <ListItem key={index} 
         
            title={item.item_name}
            subtitle={item.message}
            bottomDivider
            >

            </ListItem>
        )
    }*/
   renderItem=(data)=>(
        <Animated.View>
            <ListItem
            title={data.item.item_name} titleStyle={{color:"black",fontWeight:'bold'}} subtitle={data.item.message} bottomDivider>

            </ListItem>
        </Animated.View>
    )
   renderHiddenItem=()=>(
        <View style={styles.rowBack}>
            <View style={[styles.backRightBtn,styles.backRightBtnRight]}>
                <Text style={styles.backTextWhite}>Mark as Read</Text>
            </View>
        </View>
    )
    onSwipeValueChange=(swipeData)=>{
        var all_notifications = this.state.allNotifications
        const {key,value} = swipeData
        if(value<-Dimensions.get("window").width){
            const newData = [all_notifications]
            this.updateMarkAsRead(all_notifications[key])
            newData.splice(key)
            this.setState({
                allNotifications:newData
            })
        }
    }
    updateMarkAsRead=(notifications)=>{
        db.collection("all_notifications").doc(notifications.doc_id).update({notification_status:"read"})
    }
    render(){
        return(
            <View style={styles.container}>
         
         <SwipeListView disableRightSwipe 
           data={this.state.allNotifications} 
           renderItem={this.renderItem} 
            renderHiddenItem={this.renderHiddenItem} 
            rightOpenValue={-Dimensions.get("window").width} previewRowKey={"0"} 
          onSwipeValueChange={this.onSwipeValueChange}
                keyExtractor={(item,index)=>index.toString()}>
                    </SwipeListView>

            </View>
        )
    }
}
const styles = StyleSheet.create({ 
container:{ 
backgroundColor: "white", 
flex: 1 
}, 
backTextWhite: { 
color: "#FFF", 
fontWeight: "bold", 
fontSize: 15, 
textAlign: "center", 
alignSelf: "flex-start" 
}, 
rowBack: { 
alignItems: "center", 
backgroundColor: "#bfebff", 
flex: 1, flexDirection: "row", 
justifyContent: "space-between", 
paddingLeft: 15 
},
backRightBtn: { 
alignItems: "center", 
bottom: 0, 
justifyContent: "center", 
position: "absolute", 
top: 0, width: 100 }, 
backRightBtnRight: { 
backgroundColor: "#bfebff", 
right: 0 
} 
});