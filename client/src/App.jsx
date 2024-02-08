import { useState } from 'react'
import './App.css'
import {Routes , Route} from "react-router-dom";
import { SocketProvider } from './providers/Socket';
import Homepage from './pages/Home';
import RoomPage from './pages/Room';
import { PeerProvider} from './providers/Peer'



function App() {
 
  return (
    <div className="App">
    <PeerProvider>
     <SocketProvider>
      <Routes>
        <Route path = "/" element = {<Homepage />}></Route>
        <Route path = "/room/:roomId" element = {<RoomPage />}></Route>
      </Routes>
      </SocketProvider>
     </PeerProvider>
    </div>
  )
}

export default App
