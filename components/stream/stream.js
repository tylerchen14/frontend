import useToggle from '@/contexts/use-toggle-show';
import { socket } from '@/src/socket';
import { useRouter } from "next/router";
import { Peer } from "peerjs";
import { useEffect, useRef, useState } from 'react';
import { API_SERVER } from '../config/api-path';

export default function Stream() {
  const router = useRouter()
  const [streamRoom, setStreamRoom] = useState('')
  const { streamId, setStreamId, role, setRole, viewerId, setViewerId, roomCode, setRoomCode, isStreaming, setIsStreaming, vSocketId, setVSocketId, joinRoom, setJoinRoom } = useToggle()
  const localVidsRef = useRef(null)
  const remoteVidsRef = useRef(null)
  const peer = useRef()

  useEffect(() => {
    if (router.isReady) {
      const room = router.query.streamerPath;
      setStreamRoom(room)
      // console.log({ room });
      const newRole = room ? "isStreamer" : "isViewer";
      // console.log({ newRole });
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

      socket.on('streamerStart', async (id) => {
        setStreamId(id)
        setRoomCode(id)

        await fetch(`${API_SERVER}/stream-logon`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            streamId: id,
          })
        })
      })

      socket.on('viewerGo', (id, sId) => {
        setViewerId(id)
        setVSocketId(sId)
      })

      if (role === 'isStreamer') {
        socket.emit('joinRoom', roomCode)
        // console.log({ roomCode });
        navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user"
          },
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

  const calling = async () => {
    try {
      const r = await fetch(`${API_SERVER}/watch-stream/tyler`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await r.json()
      setRoomCode(data[0].stream_code)
      setStreamId(roomCode)
    }
    catch (err) {
      console.log("沒有抓到資料");
    }
  }

  useEffect(() => {
    calling()
  })

  const callStreamer = async () => {

    if (!peer.current || !streamId || !viewerId) {
      console.error(`有空值 -> Peer: ${peer.current}, streamId: ${streamId}`);
      return
    } else {
      socket.emit('joinRoom', roomCode)
      socket.emit('userEnter', { name: "tyler", viewerId: viewerId, socketId: vSocketId }, roomCode)
      setJoinRoom(true)
    }

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment"
      },
      audio: true
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
      {role === "isViewer" &&
        <div className='absolute right-10 top-9 flex gap-3 mb-3 items-center cursor-pointer hover:scale-125 transition-all duration-300 max-md:z-50 max-md:left-3 max-md:top-3' onClick={callStreamer}>
          <img
            src="/images/face-id.png"
            className="bg-white rounded-full p-1 h-[34px]" />
        </div>
      }
      <div
        id='stream-block'
        className=' bg-black w-full flex flex-col mt-2 mb-2 max-h-[75vh] max-md:mt-10'>

        {role === "isStreamer" ?
          <>
            <video
              ref={localVidsRef}
              className={`aspect-video object-contain max-h-[75vh]`}
              controls
              autoPlay
              playsInline
            >
            </video>
          </>
          :
          <>
            <video
              ref={localVidsRef}
              className={`aspect-video object-contain max-h-[75vh]`}
              controls
              autoPlay
              playsInline
              muted
              hidden
            >
            </video>
            <video
              ref={remoteVidsRef}
              className={`aspect-video object-contain max-h-[75vh]`}
              controls
              autoPlay
              playsInline>
            </video>
          </>}
      </div>
    </>
  )
}
