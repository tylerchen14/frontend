import React, { useRef, useState, useEffect } from 'react'
import { Peer } from "peerjs";
const socket = io('/')
const myPeer = new Peer();
import { v4 as uuidV4 } from 'uuid';


export default function Stream() {

  const myVidsRef = useRef(null)
  const [peerid, setPeerId] = useState()
  const room = uuidV4().toString()

  useEffect(() => {

    try {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).then(myStream => {
        addStream(myVidsRef.current, myStream)

        myPeer.on('open', id => {
          setPeerId(id)
          socket.emit('join-room', room, id);
        });

        socket.on('user-connected', id => {
          callPeer(id);
        });

        const callPeer = (id) => {
          const call = myPeer.call(id, myStream);
          myPeer.on('call', call => {
            call.answer(myStream)
            addStream(myVidsRef.current, myStream)
          })
        }

      })
    }
    catch (e) {
      console.log('連不到設備', e)
    }

    return () => {
      myPeer.destroy();
    };
  }, [])

  const addStream = (video, stream) => {
    video.srcObject = stream;
    video.playsInline = true;
    video.muted = true;

    video.addEventListener('loadedmetadata', () => {
      video.play()
    })

    video.onended = () => {
      video.srcObject = null;
      video.remove();
    };
  }

  return (
    <div
      id='stream-block'
      className='outline bg-black w-full aspect-video flex flex-col overflow-y-auto'>
      <video ref={myVidsRef}></video>
    </div>
  )
}
