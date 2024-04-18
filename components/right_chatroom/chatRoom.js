import useE from "@/context/use-effect";
import usePoint from "@/context/use-points";
import useToggle from "@/context/use-toggle-show";
import { socket } from "@/src/socket";
import { RiCloseFill, RiGift2Line, RiMoneyDollarCircleFill, RiPushpinFill, RiReplyFill, RiSpam3Line, RiStoreLine, RiUser3Fill, RiUserFill } from "@remixicon/react";
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import { API_SERVER } from "../config/api-path";
import styles from './chatRoom.module.css';

export default function ChatRoom({ isConnected, comment, setComment }) {
  const { onPhone, showChatroom, handleShowGift, handleShowMemberlist } = useToggle()
  const { handleEffectTab } = useE()
  const [replyTarget, setreplyTarget] = useState("")
  const [replyTargetName, setreplyTargetName] = useState("")
  const room = "liveChatRoom"
  const [peopleOnline, setPeopleOnline] = useState(0)
  const { pts, setPts } = usePoint()
  const [pin, setPin] = useState(false)
  const [pinnedData, setPinnedData] = useState({
    commentId: null,
    comment: "",
    profile: "",
    name: "",
  })
  const handleCommentFocus = useRef()

  useEffect(() => {

    const handelConnection = () => {
      socket.emit("joinRoom", room);
    }

    const handlePeopleOnline = (liveNum) => {
      setPeopleOnline(liveNum)
    }

    socket.on('connect', handelConnection)
    socket.on('updateLiveNum', handlePeopleOnline)

    return () => {
      socket.off('connect', handelConnection)

      socket.off('updateLiveNum', handlePeopleOnline)
      socket.disconnect();
    }

  }, [])

  let isComposing = false;

  const handleComposition = (e) => {
    if (e.type === "compositionend") {
      isComposing = false;
    } else {
      isComposing = true;
    }
  }

  const [userProfile, setUserProfile] = useState("/images/face-id.png")

  const getUserProfile = async () => {
    const r = await fetch(`${API_SERVER}/user-pic/12`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await r.json()
    setUserProfile(data[0].profile_pic_url)
  }
  useEffect(() => {
    getUserProfile()
  }, [comment])


  const handleCommentSubmit = (e) => {
    if (e.key === "Enter" && !isComposing) {
      const inputComment = e.target.value.trim();
      let newId = Date.now();;

      if (inputComment !== "") {
        const newComment = {
          id: newId,
          name: "陳泰勒",
          profile: userProfile,
          comment: inputComment,
          reply: replyTarget,
        }

        if (isConnected) {
          socket.emit('sendComment', newComment, room)
          console.log({ newComment }, { room });
          e.target.value = ""
          setreplyTarget("")
        } else {
          console.log(`socket尚未連線`);
        }
      }
    }
  }

  // 回覆功能
  const handleClickIcon = (comment, name) => {
    const target = comment;
    const targetName = name;
    setreplyTarget(target)
    setreplyTargetName(targetName)
    handleCommentFocus.current.focus()
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


  // 置頂功能
  useEffect(() => {
    socket.on('pinnedAll', (pinI, pinP, pinN, pinC) => {
      setPin(true)
      setPinnedData({ commentId: pinI, profile: pinP, name: pinN, comment: pinC })
    })

    return () => {
      socket.off('pinnedAll');
    };
  }, [])

  const handlePin = (pinI, pinP, pinN, pinC) => {
    setPin(!pin)
    setPinnedData({
      commentId: pinI,
      comment: pinC,
      profile: pinP,
      name: pinN,
    })

    socket.emit('pinnedComment', pinI, pinP, pinN, pinC);
  }

  const handleUnpin = () => {
    setPin(false)
    socket.emit('unpinComment')
  }

  useEffect(() => {
    socket.on('unpinAll', () => {
      setPin(false)
    })
  })

  // 點數功能
  const [clickedIds, setClickedIds] = useState([])

  useEffect(() => {
    let newId = Date.now();;
    const getPoints = setInterval(() => {
      const newComment = {
        id: newId,
        name: "系統",
        profile: "/images/treasure.png",
        comment: "點頭貼，領點數！",
      }
      socket.emit('sendComment', newComment, room)
    }, 100000);

    return () => clearInterval(getPoints)
  }, [])

  const handleGetPoints = (profile, id) => {
    if (profile == "/images/treasure.png" && !clickedIds.includes(id)) {

      let userId = 1
      fetch(`${API_SERVER}/add-point`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(r => r.json())
        .then(data => {
          console.log(`新增 ${data} 點數`);
          setClickedIds(prevIds => [...prevIds, id]);
        })
    }
  }

  return (
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
          {comment.map((c) => {
            return (
              <div key={c.id} className='flex flex-col items-start mb-4'>

                {c.reply && (
                  <div className={`flex text-xs ml-6 `}>
                    <RiReplyFill className="h-4" />
                    <div className='w-[200px] break-words'>{c.name}: {c.reply}</div>
                  </div>)}

                <div className='flex justify-between w-full text-center'>
                  <div className='flex w-6/12 gap-2 items-center justify-start'>
                    <Image width={27} height={27} alt='大頭貼' src={c.profile}
                      onClick={() => handleGetPoints(c.profile, c.id)}
                      className='bg-white rounded-full p-1' />
                    <div className='shrink-0'>{c.name}</div>
                  </div>
                  <div className='flex w-6/12 justify-end'>
                    <RiPushpinFill className={styles.icon_reply} onClick={() => { handlePin(c.id, c.profile, c.name, c.comment) }} />
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
              <Image width={30} height={30} alt='大頭貼' src={pinnedData.profile} className='bg-white rounded-full p-1' />
              <div className='shrink-0'>{pinnedData.name}</div>
            </div>
            <div className='w-6/12 flex justify-end items-center'>
              <RiCloseFill className=' cursor-pointer h-5' onClick={handleUnpin}></RiCloseFill>
            </div>
          </div>
          <div className='w-[210px] ml-9 break-words'>{pinnedData.comment}</div>
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
            onCompositionStart={handleComposition}
            onCompositionEnd={handleComposition}
            maxLength={100}
            ref={handleCommentFocus}
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
            <div>{pts} pts</div>
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
  )
}
