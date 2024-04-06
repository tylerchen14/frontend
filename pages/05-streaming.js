import React from 'react'
import styles from '../styles/streaming.module.css'
import { RiSearchLine, RiCloseLine, RiArrowRightSLine, RiMoneyDollarCircleFill, RiStoreLine, RiDonutChartFill, RiArrowLeftSLine, RiGift2Line, RiUserFill, RiArrowDownSLine, RiArrowUpSLine, RiCornerUpLeftFill, RiReplyFill } from "@remixicon/react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { Peer } from "peerjs";

// 連線後端socket
import { io } from 'socket.io-client'
const socket = io(`http://localhost:4020`, {
  auth: { token: "tyler" }
});

// FIXME: 留言需要與暱稱同一條線
// FIXME: 縮小後框變很擠
// FIXME: 手機版人員無法scroll

export default function Streaming() {

  const [onPhone, setOnPhone] = useState(false);

  useEffect(() => {
    const sizeChange = () => {
      setOnPhone(window.innerWidth < 768)
    }

    sizeChange()
    window.addEventListener('resize', sizeChange)
  })

  // 圖像元件
  const Member = () => {
    return (
      <div className={styles['member-container']}>
        <div className={styles['circle-container']}>
          <div className={styles['small-circle']}></div>
          <div className={styles['big-circle']}>
            <img src="" alt="" />
          </div>
        </div>
        <div>陳泰勒正在做專題</div>
      </div>
    )
  }

  const Level = () => {
    return (
      <>
        <div>Lv.1</div>
        <hr className="border-dotted" />
        <hr className="mt-1 mb-1 border-dotted" />
      </>
    )
  }

  const Gift = () => {
    return (
      <>
        <div className={styles['gift']}>
          <div className={styles['circle']}></div>
          <div>煙火</div>
        </div>
      </>
    )
  }

  // 留言
  const Comment = () => {
    return (
      <div className={styles['comment-chat']} >
        <div className={styles['chat-circle']}></div>
        <span className={styles['chat-name']}>五條物</span>
        <span>他的聊天紀錄他的聊天紀錄他的聊天紀錄他的聊天紀錄</span>
      </div>
    )
  }

  // 標題敘述
  const initDetail = {
    title: "直播標題標題標題標題",
    detail: "直播詳細敘述，限50字直播詳細敘述，限50字直播詳細敘述，限50字"
  }

  const [streamDetail, setstreamDetail] = useState(initDetail)

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

  // 顯示敘述
  const [showDetail, setShowDetail] = useState(false);

  const handleShowDetail = () => {
    setShowDetail(!showDetail)
  }

  // 顯示成員列表（手機）
  const [showMember, setShowMember] = useState(false);

  const handleShowMemberlist = () => {
    setShowMember(!showMember)
    console.log(showMember);
  }



  // 直播功能

  // const socket_stream = io('http://localhost:3030');

  //   const myPeer = Peer(undefined, {
  //     host: "/05-streaming/",
  //     port: "3031",
  //   });

  //   const myVid = document.createElement('video');
  //   myVid.muted = true;

  //   const room = window.location.pathname.split('/')[1];

  //   myPeer.on('open', id => {
  //     socket_stream.emit('join-room', room, id)
  //   })

  //   navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   }).then(stream => {
  //     addStream(myVid, stream)

  //     myPeer.on('call', call => {
  //       call.answer(stream)
  //       const video = document.createElement('video')
  //       call.on('stream', userStream => {
  //         addStream(video, userStream)
  //       })
  //     })
  //   })

  //   const addStream = (video, stream) => {
  //     video.srcObject = stream;
  //     video.addEventListener('loadedmetadata', () => {
  //       video.play()
  //     })
  //     const streamBlock = document.querySelector('#stream-block')
  //     streamBlock.append(video)
  //   }

  const [replyTarget, setreplyTarget] = useState("")

  // 留言功能
  const [comment, setComment] = useState([{
    name: "陳泰勒",
    profile: "/images/face-id.png",
    comment: "測試文字",
  }])

  useEffect(() => {
    socket.on('receiveComment', (receiveComment) => {
      setComment(prevComment => [...prevComment, {
        name: receiveComment.name,
        profile: receiveComment.profile,
        comment: receiveComment.comment,
        reply: receiveComment.reply
      }])
    })
    return () => {
      socket.off('receiveComment')
    }
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const inputComment = e.target.value.trim();
      if (inputComment !== "") {
        const newComment = {
          name: "陳泰勒",
          profile: "/images/face-id.png",
          comment: inputComment,
          reply: replyTarget,
        }
        socket.emit('sendComment', newComment)
        e.target.value = ""
      }
      setreplyTarget("")
    }
  }

  // 回覆功能

  const handleClickIcon = (e) => {
    const target = e.target.previousElementSibling?.textContent;
    console.log(target);
    setreplyTarget(target)
  }

  const handleReply = () => {
    setreplyTarget("")
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



  return (
    <>

      {/* 最大框 */}
      <div className={styles['container']}>

        {/* 左欄 */}
        <div className={`${styles['sidebar']} ${showSidebar ? '' : styles.hidden_left} ${!onPhone ? "" : showMember ? styles.show_up : styles.hidden_down} `}>

          {!onPhone ? "" : !showMember ? "" : <RiCornerUpLeftFill
            className='absolute top-2 left-2 cursor-pointer z-50'
            onClick={handleShowMemberlist}
          />}

          <div className={styles['sidebar-container']}>

            {/* 搜尋框 */}
            <div className='relative'>
              <input
                type="text"
                placeholder='搜尋現在人員'
                className={styles['search-field']}
              />
              <RiSearchLine
                className={styles['search-icon']}
              ></RiSearchLine>
            </div>
            <div className='text-left mt-5 mb-1'>觀看人數: 1000</div>
            <hr className={styles['line']} />
            <hr className={`${styles['line']} mt-1 mb-5 border-dotted`} />

            <div className={styles['member-list']}>
              {/* 成員排序內容 */}
              <Level></Level>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>

              <Level></Level>
              <Member></Member>
              <Member></Member>
              <Member></Member>

              <Level></Level>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>
            </div>
          </div>
        </div>

        {/* 中間欄 */}
        <div className={styles['mainframe']}>

          {/* 左邊收起按鈕 */}
          <div className={`${styles['arrow-box-left']} ${onPhone ? "hidden" : ""}`}
            onClick={handleSidebarHide}
          >
            {showSidebar ? <RiArrowLeftSLine /> : <RiArrowRightSLine />}
          </div>

          {/* 右邊收起按鈕 */}
          <div className={`${styles['arrow-box-right']} ${onPhone ? "hidden" : ""}`}
            onClick={handleChatroom}
          >
            {showChatroom ? <RiArrowRightSLine /> : <RiArrowLeftSLine />}
          </div>

          {/* 跳回上一頁 */}
          <Link href="./index">
            <RiCloseLine className={styles['cancel']} />
          </Link>

          {/* 標題敘述 */}
          <div className={styles['title-container']}>

            {onPhone ? "" : <RiDonutChartFill
              className={styles['steamDetail']}
            ></RiDonutChartFill>}

            <div>
              <div className='flex items-center'>
                <div className='text-xl font-semibold'>{streamDetail.title}</div>
                {showDetail ?
                  <RiArrowUpSLine
                    onClick={handleShowDetail} />
                  :
                  <RiArrowDownSLine
                    onClick={handleShowDetail} />
                }
              </div>
              <div className={`font-semibold text-sm ${showDetail ? "block" : "hidden"}`}
              >{streamDetail.detail}</div>
            </div>
          </div>

          {/* 直播框 */}
          <div className={styles['streaming-content']}>
          </div>

          {/* 禮物框 */}
          <div className={`${styles['gift-bar']} ${!onPhone ? "" : showGift ? "" : styles.hide} `}>
            <Gift></Gift>
            <Gift></Gift>
            <Gift></Gift>
            <Gift></Gift>
            <Gift></Gift>
            <Gift></Gift>
            <Gift></Gift>
            <Gift></Gift>
            <Gift></Gift>
          </div>
        </div>

        {/* 右欄 */}
        <div className={`${styles['chatbar']} ${showChatroom ? '' : styles.hidden_right}`}>
          <div className={styles['chatbar-content']}>
            {onPhone ? "" : <>
              <div className='text-xl'>聊天室</div>
              <hr className={styles['line']} />
            </>}

            {/* 聊天內容 */}
            <div className={`${styles['chat']} `}>
              {comment.map((c, i) => {
                return (
                  <div key={i} className='flex gap-1.5 items-start mb-2'>
                    <Image width={30} height={30} alt='大頭貼' src={c.profile} className='bg-white rounded-full p-1' />
                    <div className='w-2/12 shrink-0'>{c.name}</div>
                    <div className='w-7/12 break-words'>{c.comment}</div>
                    <RiReplyFill
                      className={styles.icon_reply}
                      onClick={handleClickIcon}
                    />
                    <div onClick={() => { handlePin(c.profile, c.name, c.comment) }}>0</div>
                    <div>{c.reply}</div>
                  </div>)
              })}
            </div>


            <div className={`flex gap-1.5 items-start mb-2 ${pin ? "" : "hidden"}`}>
              <Image width={30} height={30} alt='大頭貼' src={pinnedProfile} className='bg-white rounded-full p-1' />
              <div className='w-2/12 shrink-0'>{pinnedName}</div>
              <div className='w-7/12 break-words'>{pinnedComment}</div>
              <button onClick={handleUnpin}>x</button>
            </div>

            <hr className={"border-dotted mb-1"} />
            <hr className={"border-dotted"} />

            <div className='flex justify-between'>
              <span className={styles.repliedTarget}>{replyTarget}</span>
              <button className='mr-2' onClick={handleReply}>{replyTarget ? "x" : ""}</button>
            </div>

            {/* 留言框 */}
            <div className={styles['comment-bar']}>
              <input type="text" placeholder='輸入內容' className='w-full p-1 pl-2 rounded text-black'
                onKeyDown={handleKeyDown}
                maxLength={100}
              />

              <button className={styles['sticker-comment']}>{onPhone ? <RiGift2Line
                onClick={handleShowGift}
              /> : "送出"}</button>
            </div>

            {/* 點數與禮物框 */}
            <div className={styles['chat-bottom']}>
              <div className='flex '>
                <RiMoneyDollarCircleFill></RiMoneyDollarCircleFill>
                <div>123 pts</div>
              </div>
              <div className='flex gap-2'>
                <RiUserFill className={styles.iconstore}
                  onClick={handleShowMemberlist}
                ></RiUserFill>
                <RiStoreLine className={styles.iconstore}></RiStoreLine>
                <div id='block' onClick={handleBlockComment}>x</div>
                <input type="text" id='block' className={`${blockComment ? "hidden" : ""} text-black`} value={blockWord} onChange={handleBlockWord} maxLength={20} />
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
