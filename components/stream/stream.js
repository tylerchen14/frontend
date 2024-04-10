import React from 'react'
import styles from './stream.module.css'
import { Peer } from "peerjs";
const socket = io('/05-streaming')
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3002",
});

export default function Stream() {

  const myVid = document.createElement('video');
  myVid.muted = true;


  myPeer.on('open', id => {
    socket.emit('join-room', room, id)
    console.log(room);
  })

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  }).then(stream => {
    addStream(myVid, stream)

    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userStream => {
        addStream(video, userStream)
      })
    })
  })

  const addStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    const streamBlock = document.querySelector('#stream-block')
    streamBlock.append(video)
  }

  return (
    <div className={styles['streaming-content']} id='stream-block'>
    </div>
  )
}
