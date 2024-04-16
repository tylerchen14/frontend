import { Peer } from "peerjs";
import { useEffect, useRef, useState } from 'react';
import { socket } from '@/src/socket';

export default function Stream() {

  const streamerPath = "streamer"
  const [role, setRole] = useState("")
  const myVidsRef = useRef(null)
  const userVidsRef = useRef(null)
  const room = "liveChatRoom"
  const currentPath = window.location.pathname;

  useEffect(() => {
    const newRole = currentPath === `/05-streaming/${streamerPath}` ? "isStreamer" : "isViewer";
    setRole(newRole)
  }, [currentPath])

  useEffect(() => {
    const myPeer = new Peer();


    const getMedia = async () => {
      const myStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      addStream(myVidsRef.current, myStream);

      myPeer.on('open', id => {
        socket.emit('join-room', room, id, role);
      });

      // streamer
      socket.on('streamer-joined', streamerId => {
        const call = myPeer.call(streamerId, myStream);
        call.on('stream', stream => addStream(userVidsRef.current, stream)
        );
      });

      // viewer
      socket.on('viewer-joined', viewerId => {
        const call = myPeer.call(viewerId, myStream);
        addStream(userVidsRef.current, myStream)

        call.on('close', () => {
          console.log(`用戶 ${viewerId} 離開聊天室`);
        });
      });

      myPeer.on('error', function(err) {
        console.log('PeerJS error:', err);
      });

    };

    if (role === "isStreamer") {
      getMedia()
    }

    return () => {
      myPeer.destroy();
      socket.off('streamer-joined');
      socket.off('viewer-joined');
    };

  }, [role, room]);

  const addStream = (videoFrame, myStream) => {
    videoFrame.srcObject = myStream;
    videoFrame.playsInline = true;
    videoFrame.autoplay = true;
    videoFrame.muted = (role === "isStreamer");

    videoFrame.addEventListener('loadedmetadata', () => {
      videoFrame.play()
    })

    videoFrame.onended = () => {
      videoFrame.srcObject = null;
      videoFrame.remove();
    };
  }

  return (
    <div
      id='stream-block'
      className=' bg-black w-full flex flex-col mt-2 mb-2 max-h-[75vh] max-md:mt-10'>

      {currentPath === `/05-streaming/${streamerPath}` ?
        <video ref={myVidsRef} className='aspect-video object-contain max-h-[75vh] '></video>
        :
        <video ref={userVidsRef} className='aspect-video object-contain max-h-[75vh] '></video>}
    </div>
  )
}
