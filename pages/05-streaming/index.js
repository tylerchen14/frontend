import StreamScreen from '@/components/center_streamScreen/streamScreen';
import MemberList from '@/components/left_memberList/memberList';
import ChatRoom from '@/components/right_chatroom/chatRoom';
import { socket } from '@/src/socket';
import styles from '@/styles/streaming.module.css';
import { useEffect, useState, useContext } from 'react';
import usePoint from '@/context/use-points';


export default function Streaming() {
  const { pts, setPts } = usePoint()
  const [isConnected, setIsConnected] = useState(socket.connected);
  // const [points, setPoints] = useState(300)
  const [onPhone, setOnPhone] = useState(false);
  const [showChatroom, setShowChatroom] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showGift, setShowGift] = useState(false);
  const [showMember, setShowMember] = useState(false);
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
  const effectList = [
    {
      effect_id: 1,
      name: "吸睛文字",
      src: "/images/marker.png",
      price: "100",
      grayscale: false,
    },
    {
      effect_id: 2,
      name: "替換背景",
      src: "/images/neon.png",
      price: "200",
      grayscale: false,
    },
    {
      effect_id: 3,
      name: "改換字體",
      src: "/images/font.png",
      price: "300",
      grayscale: false,
    },
    {
      effect_id: 4,
      name: "釘選留言",
      src: "/images/pin.png",
      price: "400",
      grayscale: false,
    },
  ]
  const [totalBonus, setTotalBonus] = useState(0)
  const [gList, setGList] = useState(giftList)
  const [showEffect, setShowEffect] = useState(false)
  const [eList, setEList] = useState(effectList)

  // 留言功能
  const [comment, setComment] = useState([{
    id: 1,
    name: "陳泰勒",
    profile: "/images/face-id.png",
    comment: "第一個留言",
    reply: ""
  }])

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log(`連線成功`);
    }

    const onDisconnect = () => {
      setIsConnected(false);
    }

    const handleReceiveComment = (receiveComment) => {

      setComment(prevComment => [...prevComment, {
        id: receiveComment.id,
        name: receiveComment.name,
        profile: receiveComment.profile,
        comment: receiveComment.comment,
        reply: receiveComment.reply
      }])
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receiveComment', handleReceiveComment);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receiveComment', handleReceiveComment);
    };
  }, []);

  // 手機上顯示

  useEffect(() => {
    const sizeChange = () => {
      setOnPhone(window.innerWidth < 768)
    }

    sizeChange()
    window.addEventListener('resize', sizeChange)
  }, [])

  // 顯示聊天室（桌機）


  const handleChatroom = () => {
    setShowChatroom(!showChatroom)
  }

  // 顯示左側成員欄（桌機）


  const handleSidebarHide = () => {
    setShowSidebar(!showSidebar)
  }

  // 顯示禮物介面（手機）

  const handleShowGift = () => {
    setShowGift(!showGift)
  }

  // 顯示成員列表（手機）


  const handleShowMemberlist = () => {
    setShowMember(!showMember)
  }

  // 禮物列表

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

  // 效果列表

  const handleEffectTab = () => {
    setShowEffect(!showEffect)
  }

  const handleGiveEffect = (price, name) => {
    let effect = Number(price)

    const updateList = eList.map(item => {
      return { ...item, grayscale: item.name == name && pts < effect }
    })
    setEList(updateList)

    if (pts >= effect) {
      setPts(prevP => prevP - effect)
    } else {
      return
    }

    const selectedEffect = eList.find(item => item.name === name);

    const effectId = selectedEffect.effect_id;
;

    fetch('http://localhost:3001/use-point', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 1,
        points: effect,
        source: effectId,
      }),
    })
      .then(r => r.json())
      .then(data =>
        console.log(`減少 ${data} 點數`)
      )

  }



  return (
    <>
      {/* 最大框 */}
      <div className={styles['container']}>

        {/* 左欄 */}
        <MemberList
          showSidebar={showSidebar}
          onPhone={onPhone}
          totalBonus={totalBonus}
          showMember={showMember}
        ></MemberList>

        {/* 中欄 */}
        <StreamScreen
          isConnected={isConnected}
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
          comment={comment}
          setComment={setComment}
          isConnected={isConnected}
          showChatroom={showChatroom}
          onPhone={onPhone}
          handleEffectTab={handleEffectTab}
        // points={points}
        // setPoints={setPoints}
        ></ChatRoom>
      </div>
    </>
  )
}
