import { Peer } from "peerjs";
import { useEffect, useRef, useState } from 'react';
import { socket } from '@/src/socket';


export default function Stream() {

  const streamerPath = "streamer"
  const [role, setRole] = useState("")
  const myVidsRef = useRef(null)
  const userRef = useRef(null)
  const room = "liveChatRoom"
  const currentPath = window.location.pathname;

  useEffect(() => {

    const newRole = currentPath === `/05-streaming/${streamerPath}` ? "isStreamer" : "isViewer";
    setRole(newRole)
  }, [streamerPath])

  useEffect(() => {
    const myPeer = new Peer(undefined, {
      port: 3002,
    });

    if (role === "isStreamer") {
      const getMedia = async () => {
        const myStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        addStream(myVidsRef.current, myStream);

        myPeer.on('open', id => {
          console.log(`影像id是 ${id}`);
          socket.emit('join-room', room, id, role);
        });

        myPeer.on('call', call => {
          call.answer(myStream);
        });

        socket.on('streamer-joined', streamerId => {
          const call = myPeer.call(streamerId, null);
          call.on('stream', userVideoStream => {
            userRef.current.srcObject = userVideoStream;
            userRef.current.playsInline = true;
            userRef.current.autoplay = true;
          });
          call.on('close', () => {
            console.log(`主播 ${streamerId} 離開聊天室`);
          });
        });

        socket.on('viewer-joined', viewrId => {
          const call = myPeer.call(viewrId, myStream);
          call.on('stream', userVideoStream => {
            addStream(myVidsRef.current, userVideoStream);
          });

          call.on('close', () => {
            console.log(`用戶 ${viewrId} 離開聊天室`);
          });
        });
      };

      getMedia();

      // return () => {
      //   myPeer.destroy();
      // };
    }
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

      {currentPath === `/05-streaming/${streamerPath}` ? <video ref={myVidsRef} className='aspect-video object-contain max-h-[75vh] '></video>
        :
        <video ref={userRef} className='aspect-video object-contain max-h-[75vh] '></video>}

    </div>
  )
}
