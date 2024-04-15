import StreamScreen from '@/components/center_streamScreen/streamScreen';
import MemberList from '@/components/left_memberList/memberList';
import ChatRoom from '@/components/right_chatroom/chatRoom';
import styles from '@/styles/streaming.module.css';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export default function Streaming() {

  const socket = useRef(null)

  const [comment, setComment] = useState([{
    id: 0,
    name: "陳泰勒",
    profile: "/images/face-id.png",
    comment: "這是留言",
    reply: ""
  }])

  const [replyTarget, setreplyTarget] = useState("")
  const [replyTargetName, setreplyTargetName] = useState("")
  const room = "liveChatRoom"

  console.log({ comment });

  const [isConnected, setIsConnected] = useState(false)
  const [peopleOnline, setPeopleOnline] = useState(0)

  // 手機上顯示
  const [onPhone, setOnPhone] = useState(false);

  useEffect(() => {
    const sizeChange = () => {
      setOnPhone(window.innerWidth < 768)
    }

    sizeChange()
    window.addEventListener('resize', sizeChange)
  })

  // 顯示聊天室（桌機）
  const [showChatroom, setShowChatroom] = useState(true);

  const handleChatroom = () => {
    setShowChatroom(!showChatroom)
  }

  // 顯示左側成員欄（桌機）
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSidebarHide = () => {
    setShowSidebar(!showSidebar)
  }

  // 顯示禮物介面（手機）
  const [showGift, setShowGift] = useState(false);

  const handleShowGift = () => {
    setShowGift(!showGift)
  }

  // 顯示成員列表（手機）
  const [showMember, setShowMember] = useState(false);

  const handleShowMemberlist = () => {
    setShowMember(!showMember)
  }

  // 留言功能

  useEffect(() => {
    if (!socket.current) {

      socket.current = io.connect("http://localhost:3001")

      const handelConnection = () => {
        console.log(`連線狀況 ${isConnected}`);
        setIsConnected(true)
        socket.current.emit("joinRoom", room);
        console.log(`房間是 ${room}`);
      }

      const handlePeopleOnline = (liveNum) => {
        setPeopleOnline(liveNum)
      }

      const handleReceiveComment = (receiveComment) => {
        console.log({ receiveComment });
        setComment(prevComment => [...prevComment, {
          id: receiveComment.id,
          name: receiveComment.name,
          profile: receiveComment.profile,
          comment: receiveComment.comment,
          reply: receiveComment.reply
        }])
      }

      socket.current.on('connect', handelConnection)
      socket.current.on('updateLiveNum', handlePeopleOnline)
      socket.current.on('receiveComment', handleReceiveComment)

      return () => {
        socket.current.off('connect', handelConnection)
        socket.current.off('updateLiveNum', handlePeopleOnline)
        socket.current.off('receiveComment', handleReceiveComment)
        socket.current.disconnect();
      }
    }
  }, [])

  useEffect(() => {
    console.log(peopleOnline);
  }, [peopleOnline]);

  const handleCommentSubmit = (e) => {
    if (e.key === "Enter") {
      const inputComment = e.target.value.trim();
      let newId = comment.length + 1;
      console.log(newId);
      if (inputComment !== "") {
        const newComment = {
          id: newId,
          name: "陳泰勒",
          profile: "/images/face-id.png",
          comment: inputComment,
          reply: replyTarget,
        }

        if (socket.current && socket.current.connected) {
          socket.current.emit('sendComment', newComment, room)
          console.log({ newComment }, { room });
          e.target.value = ""
          setreplyTarget("")
        } else {
          console.error('socket沒有連線');
        }
      }
    }
  }

  // 回覆功能

  const handleClickIcon = (comment, name) => {
    const target = comment;
    const targetName = name;
    console.log(target);
    setreplyTarget(target)
    setreplyTargetName(targetName)
  }

  const handleReply = () => {
    setreplyTarget("")
    setreplyTargetName("")
  }

  const [blockComment, setBlockComment] = useState(true)
  const [blockWord, setBlockWord] = useState([])

  const handleBlockComment = () => {
    setBlockComment(!blockComment)
  }

  const handleBlockWord = (e) => {
    setBlockWord(e.target.value.split(","))
    console.log(blockWord);
  }

  useEffect(() => {
    const updatedComments = comment.map(c => {
      let updatedComment = c.comment;
      blockWord.forEach(word => {
        if (updatedComment.includes(word)) {
          updatedComment = updatedComment.replace(word, "***");
        }
      });
      return { ...c, comment: updatedComment };
    });
    setComment(updatedComments);
  }, [blockWord]);

  const [pin, setPin] = useState(false)
  const [pinnedComment, setPinnedComment] = useState("")
  const [pinnedProfile, setPinnedProfile] = useState("")
  const [pinnedName, setPinnedName] = useState("")

  const handlePin = (pinP, pinN, pinC) => {
    setPin(!pin)
    setPinnedComment(pinC)
    setPinnedName(pinN)
    setPinnedProfile(pinP)
  }

  const handleUnpin = () => {
    setPin(false)
  }

  // 點數功能

  const [points, setPoints] = useState(300)
  const [clickedIds, setClickedIds] = useState([])

  useEffect(() => {
    let newId = comment.length + 1;
    const getPoints = setInterval(() => {
      const newComment = {
        id: newId,
        name: "系統",
        profile: "/images/treasure.png",
        comment: "點頭貼，領點數！",
      }
      socket.current.emit('sendComment', newComment, room)
    }, 100000);

    return () => clearInterval(getPoints)
  }, [])

  const handleGetPoints = (profile, id) => {
    if (profile == "/images/treasure.png" && !clickedIds.includes(id)) {
      setPoints(prevPoint => prevPoint + 100)
      setClickedIds(prevIds => [...prevIds, id])
    }
  }

  const giftList = [
    {
      name: "鑿子",
      src: "/images/axe.png",
      price: "100",
      chance: 1,
      grayscale: false,
    }, {
      name: "便當",
      src: "/images/bento.png",
      price: "300",
      chance: 1,
      grayscale: false,
    }, {
      name: "燈光",
      src: "/images/flashlight.png",
      price: "200",
      chance: 1,
      grayscale: false,
    }, {
      name: "鬼魂",
      src: "/images/ghost.png",
      price: "500",
      chance: 1,
      grayscale: false,
    }, {
      name: "繩索",
      src: "/images/lasso.png",
      price: "100",
      chance: 1,
      grayscale: false,
    }, {
      name: "開鎖",
      src: "/images/padlock.png",
      price: "600",
      chance: 1,
      grayscale: false,
    }, {
      name: "石塊",
      src: "/images/stone.png",
      price: "1",
      chance: 1,
      grayscale: false,
    }, {
      name: "寶藏",
      src: "/images/treasure-chest.png",
      price: "1000",
      chance: 1,
      grayscale: false,
    }, {
      name: "水瓶",
      src: "/images/water.png",
      price: "300",
      chance: 100,
      grayscale: false,
    },
  ]

  const [totalBonus, setTotalBonus] = useState(0)
  const [gList, setGList] = useState(giftList)

  const handleGiveGift = (price, chance, name) => {
    let gift = Number(price)

    const updateList = gList.map(item => {
      if (item.name === name) {
        let newChance = chance
        if (chance > 0) {
          newChance = chance - 1
        }
        return { ...item, chance: newChance, grayscale: item.name == name && newChance <= 0 }
      }
      return item
    })
    setGList(updateList)

    if (chance > 0) {
      setTotalBonus(prevTotal => prevTotal + gift)
    } else {
      return
    }

  }

  const effectList = [
    {
      name: "吸睛文字",
      src: "/images/marker.png",
      price: "100",
      grayscale: false,
    },
    {
      name: "替換背景",
      src: "/images/neon.png",
      price: "200",
      grayscale: false,
    },
    {
      name: "改換字體",
      src: "/images/font.png",
      price: "300",
      grayscale: false,
    },
    {
      name: "釘選留言",
      src: "/images/pin.png",
      price: "400",
      grayscale: false,
    },
  ]

  const [showEffect, setShowEffect] = useState(false)
  const [eList, setEList] = useState(effectList)

  const handleEffectTab = () => {
    setShowEffect(!showEffect)
  }

  const handleGiveEffect = (price, name) => {
    let effect = Number(price)

    const updateList = eList.map(item => {
      return { ...item, grayscale: item.name == name && points < effect }
    })
    setEList(updateList)

    if (points >= effect) {
      setPoints(prevP => prevP - effect)
    } else {
      return
    }
  }

  return (
    <>

      {/* 最大框 */}
      <div className={styles['container']}>

        <MemberList
        
          showSidebar={showSidebar}
          onPhone={onPhone}
          totalBonus={totalBonus}
          showMember={showMember}></MemberList>

        {/* 中間欄 */}
        <StreamScreen
          onPhone={onPhone}
          handleSidebarHide={handleSidebarHide}
          showSidebar={showSidebar}
          handleChatroom={handleChatroom}
          showChatroom={showChatroom}
          showEffect={showEffect}
          gList={gList}
          handleGiveGift={handleGiveGift}
          showGift={showGift}
          eList={eList}
          handleGiveEffect={handleGiveEffect}
        ></StreamScreen>

        {/* 右欄 */}
        <ChatRoom
          showChatroom={showChatroom}
          onPhone={onPhone}
          peopleOnline={peopleOnline}
          comment={comment}
          pin={pin}
          pinnedProfile={pinnedProfile}
          pinnedName={pinnedName}
          handleUnpin={handleUnpin}
          pinnedComment={pinnedComment}
          replyTarget={replyTarget}
          replyTargetName={replyTargetName}
          handleReply={handleReply}
          handleCommentSubmit={handleCommentSubmit}
          handleEffectTab={handleEffectTab}
          points={points}
          handleBlockComment={handleBlockComment}
          blockComment={blockComment}
          blockWord={blockWord}
          handleBlockWord={handleBlockWord}
          handlePin={handlePin}
          handleClickIcon={handleClickIcon}
        ></ChatRoom>
      </div>
    </>
  )
}
