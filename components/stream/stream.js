import { socket } from '@/src/socket';
import { useRouter } from "next/router";
import { Peer } from "peerjs";
import { useEffect, useRef, useState } from 'react';

export default function Stream() {
  const router = useRouter()
  const [role, setRole] = useState("")
  const [streamRoom, setStreamRoom] = useState('')
  const [streamId, setStreamId] = useState('');
  const [viewerId, setViewerId] = useState([])
  const localVidsRef = useRef(null)
  const remoteVidsRef = useRef(null)
  const peer = useRef()

  useEffect(() => {
    if (router.isReady) {
      const room = router.query.streamerPath;
      setStreamRoom(room)
      console.log({ room });
      const newRole = room ? "isStreamer" : "isViewer";
      console.log({ newRole });
      setRole(newRole);
      createPeer(newRole)
    }
  }, [router.isReady, router.query.streamerPath]);

  const createPeer = (role) => {
    if (!peer.current) {
      peer.current = new Peer();
      peer.current.on('open', (id) => {
        console.log(`我的PeerID是${id}`);
        console.log(`我的身份是${role}`);
        socket.emit('check-role', id, role);
      });

      socket.on('streamerStart', (id) => {
        setStreamId(id)
      })

      socket.on('viewerGo', (id) => {
        setViewerId(prev => {
          const newViewerId = [...prev, id]
          console.log(`觀眾列表：${newViewerId}`);
          return newViewerId
        })
      })

      if (role === 'isStreamer') {
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
          .then(stream => {
            localVidsRef.current.srcObject = stream;
            localVidsRef.current.play();
            localVidsRef.current.muted = true

            peer.current.on('call', (call) => {
              call.answer(stream)
            })
          })
      }
    }
  }

  const callStreamer = (streamId) => {

    if (!peer.current || !streamId) {
      console.error(`其中有数值为空，Peer: ${peer.current}, streamId: ${streamId}`);
      return
    }

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
      .then(stream => {
        localVidsRef.current.srcObject = stream;
        localVidsRef.current.play();
        const call = peer.current.call(streamId, stream)

        if (!call) {
          console.log(`叫不到主播 ${streamId}`);
          return;
        }

        call.on('stream', (stream) => {
          remoteVidsRef.current.srcObject = stream;
          remoteVidsRef.current.play();
        })
      })
  }

  return (
    <>
      <input value={streamId} onChange={e => setStreamId(e.target.value)} className="text-black" />
      <button onClick={() => { callStreamer(streamId) }}>call streamer</button>
      <div
        id='stream-block'
        className=' bg-black w-full flex flex-col mt-2 mb-2 max-h-[75vh] max-md:mt-10'>

        {role === "isStreamer" ?
          <>
            <video
              ref={localVidsRef}
              className={`aspect-video object-contain max-h-[30vh]`}
              controls
              autoPlay
              playsInline>
            </video>
          </>
          :
          <>
            <video
              ref={localVidsRef}
              className={`aspect-video object-contain max-h-[30vh]`}
              controls
              autoPlay
              playsInline
              hidden
              >
            </video>
            <video
              ref={remoteVidsRef}
              className={`aspect-video object-contain max-h-[30vh]`}
              controls
              autoPlay
              playsInline>
            </video>
          </>}


      </div>
    </>
  )
}
