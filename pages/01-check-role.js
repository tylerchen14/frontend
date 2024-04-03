import React, { useEffect } from 'react'
import { RiCheckboxFill } from "@remixicon/react";
import { RiCloseLine } from "@remixicon/react";
import styles from '../styles/check-role.module.css'
import { useState } from 'react';
import Link from 'next/link';

export default function CheckRole() {
  const [viewerHover, setViewerHover] = useState(false);
  const [streamerHover, setStreamerHover] = useState(false);
  const [onPhone, setOnPhone] = useState(false);

  const handleViewerMouseEnter = () => {
    setViewerHover(true);
    setStreamerHover(false);
  };

  const handleViewerMouseLeave = () => {
    setViewerHover(false);
  };

  const handleStreamerMouseEnter = () => {
    setStreamerHover(true);
    setViewerHover(false);
  };

  const handleStreamerMouseLeave = () => {
    setStreamerHover(false);
  };

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
        <div className={styles.title}>{!viewerHover && !streamerHover && "你想成為."}</div>

        {/* 第二框 */}
        <div className={styles['content-block']}>

          {/* 觀眾區 */}
          <Link href="./05-streaming">
            <div
              className={!viewerHover && !streamerHover ? styles['viewer-block'] : viewerHover ? `${styles['viewer-block']}` : `${styles['unhover']}`}
              onMouseEnter={handleViewerMouseEnter}
              onMouseLeave={handleViewerMouseLeave}
            >
              <div className='text-5xl font-semibold mb-5 max-md:text-4xl '>觀眾</div>
              <div className='text-xs font-semibold mb-10 max-md:text-sm max-md:mb-0'>{onPhone ? (
                <>
                  加入聊天
                  <br />
                  找尋探險夥伴
                </>
              ) : "立即加入聊天，找尋探險夥伴"}</div>

              <div className="text-left">
                <div className='text-sm pl-1 mb-1 max-md:hidden'>你可以做到</div>
                <div className='text-sm flex flex-row items-center max-md:hidden'><RiCheckboxFill />觀賞探險實況</div>
                <div className='text-sm flex flex-row items-center max-md:hidden'><RiCheckboxFill />實況主即時互動</div>
                <div className='text-sm flex flex-row items-center max-md:hidden'><RiCheckboxFill />找到探險同好</div>
                <div className='text-sm flex flex-row items-center max-md:hidden'><RiCheckboxFill />支持你喜愛的實況主</div>
              </div>
            </div>
          </Link>

          {/* 主播區 */}
          <Link href="./02-check-webcam-source">
            <div
              className={!viewerHover && !streamerHover ? styles['streamer-block'] : streamerHover ? `${styles['streamer-block']}` : `${styles['unhover']}`}
              onMouseEnter={handleStreamerMouseEnter}
              onMouseLeave={handleStreamerMouseLeave}
            >
              <div className='text-5xl font-semibold mb-5 max-md:text-4xl '>主播</div>

              <div className='text-xs font-semibold mb-10 max-md:text-sm max-md:mb-0'>{onPhone ? (
                <>
                  打開鏡頭
                  <br />
                  分享探險旅程
                </>
              ) : "抓起攝影機，馬上分享探險"}</div>

              <div className='text-left'>
                <div className='text-sm pl-1 mb-1 max-md:hidden'>你可以做到</div>
                <div className='text-sm flex flex-row items-center max-md:hidden'><RiCheckboxFill />獲得廣大曝光</div>
                <div className='text-sm flex flex-row items-center max-md:hidden'><RiCheckboxFill />即時聊天室互動</div>
                <div className='text-sm flex flex-row items-center max-md:hidden'><RiCheckboxFill />獲取禮物獎勵</div>
                <div className='text-sm flex flex-row items-center max-md:hidden'><RiCheckboxFill />特有聊天室權限</div>
              </div>

            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
