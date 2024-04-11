import React from 'react'
import styles from '@/styles/streaming.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RiSearchLine, RiCloseLine, RiArrowRightSLine, RiMoneyDollarCircleFill, RiStoreLine, RiDonutChartFill, RiArrowLeftSLine, RiGift2Line, RiUserFill, RiArrowDownSLine, RiArrowUpSLine, RiCornerUpLeftFill, RiReplyFill, RiPushpinFill, RiSpam3Line, RiCloseFill } from "@remixicon/react";

// 去除 server-side rendering
import dynamic from 'next/dynamic'
const StreamContent = dynamic(() => import('@/components/stream/stream'), {
  ssr: false,
})

// 導入socket.io-client
import { io } from 'socket.io-client'
const socket = io('http://localhost:3001');

export default function Streaming() {

  // 手機上顯示
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

  // 留言功能
  const [replyTarget, setreplyTarget] = useState("")
  const [replyTargetName, setreplyTargetName] = useState("")

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

  const giftList = [
    {
      name: "鑿子",
      src: "/images/axe.png",
    }, {
      name: "便當",
      src: "/images/bento.png",
    }, {
      name: "燈光",
      src: "/images/flashlight.png",
    }, {
      name: "鬼魂",
      src: "/images/ghost.png",
    }, {
      name: "繩索",
      src: "/images/lasso.png",
    }, {
      name: "開鎖",
      src: "/images/padlock.png",
    }, {
      name: "石塊",
      src: "/images/stone.png",
    }, {
      name: "寶藏",
      src: "/images/treasure-chest.png",
    }, {
      name: "水瓶",
      src: "/images/water.png",
    },
  ]

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

  const [points, setPoints] = useState(0)
  const [clickedIds, setClickedIds] = useState([])

  useEffect(() => {
    let p = 0
    const getPoints = setInterval(() => {
      const newComment = {
        id: p++,
        name: "系統",
        profile: "/images/treasure.png",
        comment: "點頭貼，領點數！",
      }
      socket.emit('sendComment', newComment)
    }, 100000);

    return () => clearInterval(getPoints)
  }, [])

  const handleGetPoints = (profile, id) => {
    if (profile == "/images/treasure.png" && !clickedIds.includes(id)) {
      setPoints(prevPoint => prevPoint + 100)
      setClickedIds(prevIds => [...prevIds, id])
    }
  }

  return (
    <>

      {/* 最大框 */}
      <div className={styles['container']}>

        {/* 左欄 */}
        <div className={`${styles['sidebar']} ${showSidebar ? '' : styles.hidden_left} ${!onPhone ? "" : showMember ? styles.show_up : styles.hidden_down}`}>

          {!onPhone ? "" : !showMember ? "" : <RiCornerUpLeftFill
            className='absolute top-2 left-2 cursor-pointer z-50'
            onClick={handleShowMemberlist}
          />}

          <div className= {`${styles['sidebar-container']}`}>

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
          <StreamContent></StreamContent>

          {/* 禮物框 */}
          <div className={`${styles['gift-bar']} ${!onPhone ? "" : showGift ? "" : styles.hide} `}>
            {giftList.map((c, i) => {
              return (
                <div className={styles['gift']} key={i}>
                  <Image width={40} height={40} src={c.src} className={styles['circle']} alt={c.name}></Image>
                  <div>{c.name}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 右欄 */}
        <div className={`${styles['chatbar']} ${showChatroom ? '' : styles.hidden_right}`}>
          <div className={styles['chatbar-content']}>
            {onPhone ? "" : <>
              <div className='text-xl'>聊天室</div>
              <hr className="mt-2" />
            </>}

            {/* 聊天內容 */}
            <div className={styles.chat}>
              {comment.map((c, i) => {
                return (
                  <div key={i} className='flex flex-col items-start mb-3'>

                    {c.reply && (
                      <div className={`flex text-sm ml-6 mb-1`}>
                        <RiReplyFill className="h-4" />
                        <div className='w-[200px] break-words'>{c.reply}</div>
                      </div>)}

                    <div className='flex justify-between w-full text-center'>
                      <div className='flex w-6/12 gap-2 items-center justify-start'>
                        <Image width={27} height={27} alt='大頭貼' src={c.profile}
                          onClick={() => handleGetPoints(c.profile, c.id)}
                          className='bg-white rounded-full p-1' />
                        <div className='shrink-0'>{c.name}</div>
                      </div>
                      <div className='flex w-6/12 justify-end'>
                        <RiPushpinFill className={styles.icon_reply} onClick={() => { handlePin(c.profile, c.name, c.comment) }} />
                        <RiReplyFill
                          className={styles.icon_reply}
                          onClick={() => { handleClickIcon(c.comment, c.name) }}
                        />
                      </div>
                    </div>

                    <div className='w-[200px] ml-9 break-words'>{c.comment}</div>

                  </div>)
              })}
            </div>

            {/* 置頂文字 */}
            <div className={`flex flex-col items-start mb-2 ${pin ? "" : "hidden"}`}>
              <div className='flex justify-between w-full text-center'>
                <div className='flex w-6/12 gap-2 items-center justify-start'>
                  <Image width={30} height={30} alt='大頭貼' src={pinnedProfile} className='bg-white rounded-full p-1' />
                  <div className='shrink-0'>{pinnedName}</div>
                </div>
                <div className='w-6/12 flex justify-end items-center'>
                  <RiCloseFill className=' cursor-pointer  h-5' onClick={handleUnpin}></RiCloseFill>
                </div>
              </div>

              <div className='w-[210px] ml-9 break-words'>{pinnedComment}</div>

            </div>

            <hr className="border-dotted mb-1" />
            <hr className="border-dotted" />

            {/* 回覆哪個訊息 */}
            <div className={`flex justify-between ${replyTarget ? "" : "hidden"}`}>
              <span className={`${styles.repliedTarget} w-[200px] text-sm break-words`}>回覆 @{replyTargetName}: {replyTarget}</span>
              <button className='mr-2' onClick={handleReply}>{replyTarget ? <RiCloseFill className='h-5'></RiCloseFill> : ""}</button>
            </div>

            {/* 發訊息 */}
            <div className={styles['comment-bar']}>
              <input type="text" placeholder='輸入內容' className='w-full p-1 pl-2 rounded text-black'
                onKeyDown={handleKeyDown}
                maxLength={100}
              />

              <button className={styles['sticker-comment']}>{onPhone ? "送出" : ""}</button>
            </div>

            {/* 點數與禮物框 */}
            <div className={styles['chat-bottom']}>
              <div className='flex '>
                <RiMoneyDollarCircleFill className='cursor-pointer'></RiMoneyDollarCircleFill>
                <div>{points} pts</div>
              </div>
              <div className='flex gap-2'>
                {onPhone ? <RiGift2Line
                  className={styles.iconstore}
                  onClick={handleShowGift}
                /> : ""}
                <RiUserFill className={styles.iconstore}
                  onClick={handleShowMemberlist}
                ></RiUserFill>
                <RiStoreLine className={styles.iconstore}></RiStoreLine>
                <RiSpam3Line className={styles.iconstore} id='block' onClick={handleBlockComment}></RiSpam3Line>
                <input type="text" id='block' className={`${blockComment ? "hidden" : ""} text-black`} value={blockWord} onChange={handleBlockWord} maxLength={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
