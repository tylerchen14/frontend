import StreamScreen from '@/components/center_streamScreen/streamScreen';
import MemberList from '@/components/left_memberList/memberList';
import ChatRoom from '@/components/right_chatroom/chatRoom';
import useAni from '@/context/use-animate';
import useE from '@/context/use-effect';
import { socket } from '@/src/socket';
import styles from '@/styles/streaming.module.css';
import { useEffect, useState } from 'react';
import useToggle from '@/context/use-toggle-show';
import useGift from '@/context/use-gift';

export default function Streaming() {
  const { totalBonus, gList, giftRain, handleGiveGift, setGiftRain } = useGift()
  const { onPhone, showChatroom, showSidebar, showGift, showMember, handleChatroom, handleSidebarHide, handleShowGift, handleShowMemberlist } = useToggle()
  const { eList, handleEffectTab, handleGiveEffect, showEffect } = useE()
  const { isAnimating, setIsAnimating } = useAni()
  const [isConnected, setIsConnected] = useState(socket.connected);

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



  // 效果列表



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
          giftRain={giftRain}
          setGiftRain={setGiftRain}
        ></StreamScreen>

        {/* 右欄 */}
        <ChatRoom
          comment={comment}
          setComment={setComment}
          isConnected={isConnected}
          showChatroom={showChatroom}
          onPhone={onPhone}
          handleEffectTab={handleEffectTab}
        ></ChatRoom>
      </div>
    </>
  )
}
