import React, { useRef, useState, useEffect } from 'react'
import { Peer } from "peerjs";
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')
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

        myPeer.on('call', call => {
          call.answer(myStream)
          addStream(myVidsRef.current, myStream)
        })

        socket.on('user-connected', id => {
          callPeer(id, myStream);
        });

      })
    }
    catch (e) {
      console.log('連不到設備', e)
    }

    return () => {
      myPeer.destroy();
    };
  }, [])

  const callPeer = (id, myStream) => {
    const call = myPeer.call(id, myStream);
  }

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
      className=' bg-black w-full flex flex-col mt-2 mb-2 max-h-[75vh]'>
      <video ref={myVidsRef} className='aspect-video object-contain max-h-[75vh]'></video>
    </div>
  )
}
