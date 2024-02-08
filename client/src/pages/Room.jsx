import React, {useEffect , useCallback, useState} from 'react';
import { useSocket } from '../providers/Socket';
import ReactPlayer from 'react-player';

import { usePeer } from '../providers/Peer';



const RoomPage = () =>{ 
    const { socket } = useSocket();
    const {peer , createOffer , createAnswer, setRemoteAns , sendStream, remoteStream}  = usePeer();
    const [myStream , setMyStream] = useState(null);
   
    const [remoteEmailId , setRemoteEmailId] = useState(null);




  const handleNewUserJoined = useCallback( 
  async(data) =>{
    const {emailId} = data
    console.log("new user joined room" , emailId)
  const offer = await createOffer();
  socket.emit('call-user' , {emailId , offer});
  setRemoteEmailId(emailId);
  }
  ,[createOffer , socket]);

const handleIncomingCall = useCallback(async(data)=>{
    const {from , offer} = data
    console.log("incoming-call from", from, offer);
    const ans = await createAnswer(offer);
    socket.emit('call-accepted', {emailId: from , ans})
    setRemoteEmailId(from);

},[createAnswer , socket])

const handleCallAccepted = useCallback( async (data) => {
    const {ans} =data;
    console.log("call got accepted" , ans);
    await setRemoteAns(ans)
   
}, [ setRemoteAns]);

const getUserMediaStream = useCallback(async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true , video:true});
   
    setMyStream(stream);
},[])

const handleNegosiation = useCallback(()=>{
    const localOffer = peer.localDescription;
   socket.emit('call-user', {emailId:remoteEmailId , offer:localOffer})
    },[])


 useEffect(() =>{
    socket.on('user-joined', handleNewUserJoined)
    socket.on('incoming-call', handleIncomingCall)
    socket.on('call-accepted' , handleCallAccepted )
    return () =>{
        socket.off('user-joined', handleNewUserJoined)
        socket.off('incoming-call', handleIncomingCall)
        socket.off('call-accepted' , handleCallAccepted)
    }
 } ,[handleCallAccepted, handleIncomingCall , handleNewUserJoined, socket])

 // for video player
 useEffect(()=>{
    peer.addEventListener('negotiationneeded', handleNegosiation)
 }, [])


 useEffect(() =>{
    getUserMediaStream();

 }, [getUserMediaStream ])


    return (
        <div className="room-page-container">
            <h1>room page</h1>
            <h4>You are connected to {remoteEmailId}</h4>
            <button onClick = {(e) => sendStream(myStream)}>send My video</button>
            <ReactPlayer url = {myStream} playing  muted/>
            <ReactPlayer url = {remoteStream} playing/>
        </div>
    )
}

export default RoomPage