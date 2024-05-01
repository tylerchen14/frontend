import Sidebar from '@/components/sidebar/sidebar';
import StepMap from '@/components/step-map/step-map';
import useStreamInfo from '@/contexts/use-streamInfo';
import styles from '@/styles/insert-live-details.module.css';
import { RiCloseLine } from "@remixicon/react";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Process1 from '@/components/checkPoint/tyler_process1';
import { socket } from '@/src/socket';
import useToggle from '@/contexts/use-toggle-show';

export default function CheckWebcamSource() {
  const { streamTitle, setStreamTitle, streamDesciption, setStreamDesciption } = useStreamInfo()
  const { roomCode } = useToggle()
  const [onPhone, setOnPhone] = useState(false);
  const [titleCurrentNum, setTitleCurrentNum] = useState(0)
  const [descriptionCurrentNum, setDescriptionCurrentNum] = useState(0)
  const [titleWarning, setTitleWarning] = useState(false)
  const [desciptionWarning, setDesciptionWarning] = useState(false)

  useEffect(() => {
    const sizeChange = () => {
      setOnPhone(window.innerWidth < 768)
    }
    sizeChange()
    window.addEventListener('resize', sizeChange)
  })

  return (

    <>
      {/* 最大框 */}
      <div className={styles['container']}>

        <Link href="/"><RiCloseLine className={styles['cancel']} /></Link>

        {/* 測邊框 */}
        {!onPhone && <Sidebar></Sidebar>}
        {/* 影音來源框 */}
        <div className={`${styles['mainframe']} w-4/5 max-md:w-full max-md:h-full`}>

          {/* 標題 */}
          <div className={styles['title']}>{!onPhone && "第二步: 輸入直播資訊"}</div>

          {onPhone &&
            <div className='w-8/12'>
              <Process1
                name1={"確認來源"}
                name2={"輸入標題"}
              ></Process1>
            </div>
          }

          {/* 白框內 */}
          <div className={styles['white-block']}>
            <div className={styles['innerline']}>

              <div className={styles['first-block']}>
                <div className={styles['title-text']}>給一個酷酷的標題</div>
                <div className='bg-stone-900 rounded w-2/5 max-w-sm text-white max-md:w-9/12 relative max-md:h-[70px]'>
                  <textarea
                    // type="text"
                    maxLength={20}
                    placeholder='請輸入標題，限 20 字'
                    className='bg-stone-900 rounded w-full max-w-sm p-2 text-white max-md:mb-2 h-full max-md:h-[70px]
                    '
                    value={streamTitle}
                    onChange={(e) => {
                      setStreamTitle(e.target.value)
                      setTitleCurrentNum(e.target.value.length)
                      if (e.target.value.length >= 20) {
                        setTitleWarning(true)
                      } else {
                        setTitleWarning(false)
                      }
                      socket.emit('sendTitle', streamTitle,roomCode)
                    }}
                  />
                  <div className={`absolute right-2 bottom-1 text-xs ${titleWarning ? "text-red-500" : "text-white"}`}>{titleCurrentNum}/20</div>
                </div>
              </div>

              <div className={styles['second-block']}>
                <div className={styles['title-text']}>一句話形容你的直播</div>
                <div className='
                bg-stone-900 rounded w-2/5 max-w-sm text-white max-md:w-9/12 relative'>
                  <textarea
                    className='bg-stone-900 rounded w-full max-w-sm p-2 text-white h-full resize-none
                  '
                    cols="30"
                    rows="5"
                    maxLength={50}
                    placeholder='限 50 字輸入'
                    value={streamDesciption}
                    onChange={(e) => {
                      setStreamDesciption(e.target.value)
                      setDescriptionCurrentNum(e.target.value.length)
                      if (e.target.value.length >= 50) {
                        setDesciptionWarning(true)
                      } else {
                        setDesciptionWarning(false)
                      }
                      socket.emit('sendDescript', streamDesciption,roomCode)
                    }}
                  ></textarea>
                  <div className={`absolute right-2 bottom-1 text-xs ${desciptionWarning ? "text-red-500" : "text-white"}`}>{descriptionCurrentNum}/50</div>
                </div>
              </div>
            </div>
          </div>

          {/* 下一步 */}
          <StepMap></StepMap>

        </div>
      </div >
    </>
  )
}
