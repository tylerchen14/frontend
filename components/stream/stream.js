import { Peer } from "peerjs";
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001')
const myPeer = new Peer(undefined);

export default function Stream({ streamerPath }) {

  streamerPath = "apple"
  console.log(streamerPath);
  const [role, setRole] = useState("")
  const myVidsRef = useRef(null)
  const [peerid, setPeerId] = useState()
  const room = "videoStreamRoom"
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const newRole = currentPath === `/05-streaming/${streamerPath}` ? "isStreamer" : "isViewer";
    setRole(newRole)
  }, [streamerPath])

  useEffect(() => {
    if (role === "isStreamer") {
      let mounted = true;

      const getMedia = async () => {
        try {
          const myStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          if (mounted) {
            addStream(myVidsRef.current, myStream);

            myPeer.on('call', call => {
              call.answer(myStream);
              call.on('stream', userVideoStream => {
                if (myVidsRef.current) {
                  addStream(myVidsRef.current, userVideoStream)
                }
              });
            });

            myPeer.on('open', id => {
              if (mounted) {
                setPeerId(id);
                console.log(`我的影像id是 ${id}`);
                socket.emit('join-room', room, id, streamerPath);
              }
            });

            socket.on('user-connected', id => {
              const call = myPeer.call(id, myStream);

              call.on('stream', remoteStream => {
                const newStreams = [...streams, remoteStream];
                setStreams(newStreams);
              });

              call.on('close', () => {
                console.log(`用戶 ${id} 離開聊天室`);
              });
            });
          }
        } catch (e) {
          console.log('連不到設備', e);
        }
      };

      getMedia();

      return () => {
        mounted = false;
        myPeer.destroy();
      };
    }
  }, [role, room]);

  useEffect((myStream) => {

    socket.emit('request-active-streams');

    socket.on('active-streams', (streams) => {
      Object.values(streams).forEach(stream => {
        if (stream.path !== `/05-streaming/${streamerPath}`) { // filter out own stream
          const call = myPeer.call(stream.streamerId, myStream);
          call.on('stream', remoteStream => {
            addStream(myVidsRef.current, remoteStream)
          });
        }
      });
    });
  }, []);

  const addStream = (videoFrame, myStream) => {
    videoFrame.srcObject = myStream;
    videoFrame.playsInline = true;
    videoFrame.muted = true;

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
      {streams.map((stream, index) => (
        <video key={index} autoPlay playsInline ref={ref => {
          if (ref) {
            ref.srcObject = stream;
          }
        }} />
      ))}
      <video ref={myVidsRef} className='aspect-video object-contain max-h-[75vh] '></video>
    </div>
  )
}
