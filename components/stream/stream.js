import { socket } from '@/src/socket';
import { useRouter } from "next/router";
import { Peer } from "peerjs";
import { useEffect, useRef, useState } from 'react';

export default function Stream() {
  const router = useRouter()
  const [role, setRole] = useState("")
  const [streamerRoom, setStreamerRoom] = useState(null);
  const myVidsRef = useRef(null)
  const [streamId, setStreamId] = useState('');
  const [viewerId, setViewerId] = useState("")

  useEffect(() => {
    if (router.isReady) {
      const room = router.query.streamerPath;
      console.log({ room });
      setStreamerRoom(room);
      const newRole = room ? "isStreamer" : "isViewer";
      setRole(newRole);
    }
  }, [router.isReady, router.query.streamerPath]);

  useEffect(() => {
    const myPeer = new Peer();

    myPeer.on('open', id => {
      socket.emit('join-room', streamerRoom, id, role);
      console.log(`我的ID是${id}`);
      console.log(`我的身份是${role}`);
    });

    socket.on('streamerStart', (id) => {
      setStreamId(id)
    })

    socket.on('viewerGo', (id) => {
      setViewerId(id)
    })

    if (role === "isStreamer") {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
        .then(myStream => {
          addStream(myVidsRef.current, myStream)
          myPeer.on('call', call => {
            call.answer(myStream)
          })
        })
    }

    const call = (streamerId) => {
      if (role === 'isViewer' && streamerId) {
        const call = myPeer.call(streamerId, null)
        call.on('stream', stream => {
          addStream(myVidsRef, stream)
        })
      }
    }

    //   const skip=()={
    //   // const getMedia = async () => {
    //   //   const myStream = await navigator.mediaDevices.getUserMedia({
    //   //     video: true,
    //   //     audio: true
    //   //   });

    //   //   addStream(myVidsRef.current, myStream);
    //   //   const call = myPeer.call(viewerId, myStream)
    //   //   call.answer(myStream)
    //   //   call.on('stream', (myStream) =>
    //   //     addStream(myVidsRef.current, myStream)
    //   //   );
    //   // };

    //   // if (role === "isStreamer") {
    //   //   getMedia()
    //   // }
    // }

    return () => {
      myPeer.destroy();
      socket.off('streamerStart');
      socket.off('viewerGo');
    };

  }, [role, streamerRoom]);

  const addStream = (video, myStream) => {
    video.srcObject = myStream;
    video.playsInline = true;
    video.autoplay = true;
    video.muted = (role === "isStreamer");

    video.addEventListener('loadedmetadata', () => {
      video.play()
    })

    video.onended = () => {
      video.srcObject = null;
      video.remove();
    };
  }

  return (
    <>
      <input value={streamId} onChange={e => setStreamId(e.target.value)} className="text-black" />
      <button onClick={() => { () => call(streamId) }}>text</button>
      <div
        id='stream-block'
        className=' bg-black w-full flex flex-col mt-2 mb-2 max-h-[75vh] max-md:mt-10'>
        <video ref={myVidsRef} className='aspect-video object-contain max-h-[75vh] '></video>
      </div>
    </>
  )
}
