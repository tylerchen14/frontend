import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseFill, RiCloseLine, RiCoinFill, RiCornerUpLeftFill, RiGift2Line, RiMoneyDollarCircleFill, RiPushpinFill, RiReplyFill, RiSearchLine, RiSpam3Line, RiStoreLine, RiUserFill, RiUser3Fill } from "@remixicon/react";
import Level from '@/components/level/level';
import Member from '@/components/member/member';
import Title from '@/components/title/title';
import styles from '@/styles/streaming.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useReducer, useRef, useState } from 'react';

// 去除 server-side rendering
import dynamic from 'next/dynamic';
const StreamContent = dynamic(() => import('@/components/stream/stream'), {
  ssr: false,
})

  // 導入socket.io-client
  import io from 'socket.io-client';
  const socket = io.connect('http://localhost:3001')

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
  const [replyTarget, setreplyTarget] = useState("")
  const [replyTargetName, setreplyTargetName] = useState("")
  const room = "liveChatRoom"

  const [comment, setComment] = useState([{
    name: "陳泰勒",
    profile: "/images/face-id.png",
    comment: "這是留言",
    reply: ""
  }])

  const [isConnected, setIsConnected] = useState(false)
  const [peopleOnline, setPeopleOnline] = useState(0)

  useEffect(() => {

    const handelConnection = () => {
      console.log(`連線狀況 ${isConnected}`);
      setIsConnected(true)
      socket.emit("joinRoom", room);
      console.log(`房間是 ${room}`);
    }

    const handlePeopleOnline = (liveNum) => {
      setPeopleOnline(liveNum)
    }

    const handleReceiveComment = (receiveComment) => {
      console.log({ receiveComment });
      setComment(prevComment => [...prevComment, {
        name: receiveComment.name,
        profile: receiveComment.profile,
        comment: receiveComment.comment,
        reply: receiveComment.reply
      }])
    }

    socket.on('connect', handelConnection)
    socket.on('updateLiveNum', handlePeopleOnline)
    socket.on('receiveComment', handleReceiveComment)

    return () => {
      socket.off('connect', handelConnection)
      socket.off('updateLiveNum', handlePeopleOnline)
      socket.off('receiveComment', handleReceiveComment)
      socket.disconnect();
    }
  }, [socket, room])

  useEffect(() => {
    console.log(peopleOnline);
  }, [peopleOnline]);


  const handleCommentSubmit = (e) => {
    if (e.key === "Enter") {
      const inputComment = e.target.value.trim();
      if (inputComment !== "") {
        const newComment = {
          name: "陳泰勒",
          profile: "/images/face-id.png",
          comment: inputComment,
          reply: replyTarget,
        }

        if (socket && socket.connected) {
          socket.emit('sendComment', newComment, room)
          console.log({ newComment }, { room });
          e.target.value = ""
          setreplyTarget("")
        } else {
          console.error('socket沒有連線');
        }
      }
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

        {/* 左欄 */}
        <div className={`${styles['sidebar']} ${showSidebar ? '' : styles.hidden_left} ${!onPhone ? "" : showMember ? styles.show_up : styles.hidden_down}`}>

          {!onPhone ? "" : !showMember ? "" : <RiCornerUpLeftFill
            className='absolute top-2 left-2 cursor-pointer z-50'
            onClick={handleShowMemberlist}
          />}

          <div className={`${styles['sidebar-container']}`}>

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
            <div className='text-left mt-5 mb-1'>直播總打賞: {totalBonus}</div>
            <hr className="border-2" />
            <hr className={`${styles['line']} mt-1 border-dotted`} />

            <div className={styles['member-list']}>
              {/* 成員排序內容 */}
              <Level name="探險王" amount="5,000+"></Level>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>

              <Level name="製圖師" amount="3,000+"></Level>
              <Member></Member>
              <Member></Member>
              <Member></Member>

              <Level name="鑑賞員" amount="1,000+"></Level>
              <Member></Member>
              <Member></Member>
              <Member></Member>
              <Member></Member>

              <Level name="駝獸" amount="500+"></Level>
              <Member></Member>
              <Member></Member>

              <Level name="新手村"></Level>
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

          {/* 標題敘述 -桌機 */}
          {onPhone ? "" : <Title></Title>}

          {/* 直播框 */}
          <StreamContent></StreamContent>

          {/* 標題敘述 -手機 */}
          {onPhone ? <Title></Title> : ""}

          {/* 禮物框 */}
          {showEffect ?
            <>
              <div className={`${styles['gift-bar']} ${!onPhone ? "" : showGift ? "" : styles.hide} w-5/12 gap-14`}>
                {eList.map((c, i) => {
                  return (
                    <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer " key={i}>

                      <Image
                        width={44}
                        height={44}
                        src={c.src}
                        className={`${styles['circle']} ${c.grayscale ? "grayscale" : ""}`}
                        alt={c.name}
                        onClick={() => { handleGiveEffect(c.price, c.name) }}
                      ></Image>

                      <div className="text-sm">{c.name}</div>
                      <div className="flex gap-0.5 items-center">
                        <RiCoinFill style={{ color: "#fff400" }} className='mt-1 h-4'></RiCoinFill>
                        <div className='mr-2 text-sm'>{c.price}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
            :
            <>
              <div className={`${styles['gift-bar']} ${!onPhone ? "" : showGift ? "" : styles.hide} gap-8 `}>
                {gList.map((c, i) => {
                  return (
                    <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer" key={i}>

                      <Image
                        width={44}
                        height={44}
                        src={c.src}
                        className={`${styles['circle']} ${c.grayscale ? "grayscale" : ""}`}
                        alt={c.name}
                        onClick={() => { handleGiveGift(c.price, c.chance, c.name) }}
                      ></Image>

                      <div className='text-sm'>{c.name}({c.chance})</div>
                      <div className="flex items-center">
                        <RiCoinFill
                          style={{ color: "#fff400" }}
                          className='mt-1 h-4'></RiCoinFill>

                        <div
                          className='mr-2 text-sm'>{c.price}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>}

        </div>

        {/* 右欄 */}
        <div className={`${styles['chatbar']} ${showChatroom ? '' : styles.hidden_right}`}>
          <div className={styles['chatbar-content']}>
            {onPhone ? "" : <>
              <div className="flex justify-between">
                <div className='text-xl'>聊天室</div>
                <div className="flex items-center">
                  <RiUser3Fill className="h-4 mt-0.5"></RiUser3Fill>
                  {peopleOnline}
                </div>
              </div>
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
                  <RiCloseFill className=' cursor-pointer h-5' onClick={handleUnpin}></RiCloseFill>
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
                onKeyDown={handleCommentSubmit}
                maxLength={100}
              />

              <button className={styles['sticker-comment']}>{onPhone ? "送出" : ""}</button>
            </div>

            {/* 點數與禮物框 */}
            <div className="mt-3 flex justify-between items-center">
              <div className='flex gap-1 '>
                <RiMoneyDollarCircleFill
                  className='cursor-pointer'
                  onClick={handleEffectTab}
                ></RiMoneyDollarCircleFill>
                <div>{points} pts</div>
              </div>
              <div className='flex gap-2'>
                {onPhone ? <>
                  <RiGift2Line
                    className={styles.iconstore}
                    onClick={handleShowGift}
                  />
                  <RiUserFill
                    className={styles.iconstore}
                    onClick={handleShowMemberlist}
                  ></RiUserFill>
                  <RiStoreLine
                    className={styles.iconstore}
                  ></RiStoreLine></>
                  : ""}

                <RiSpam3Line className={styles.iconstore} id='block' onClick={handleBlockComment}></RiSpam3Line>
                <input type="text" id='block'
                  className={` transition-width duration-300 ease-in-out ${blockComment ? "w-0" : "w-[140px]"} max-md:${blockComment ? "w-0" : "w-[100px]"} text-black`}
                  value={blockWord}
                  onChange={handleBlockWord}
                  maxLength={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
