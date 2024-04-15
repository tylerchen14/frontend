import Title from '@/components/title/title';
import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine, RiCoinFill } from "@remixicon/react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import styles from './streamScreen.module.css';
const StreamContent = dynamic(() => import('@/components/stream/stream'), {
  ssr: false,
})

export default function StreamScreen({ isConnected, onPhone, handleSidebarHide, showSidebar, handleChatroom, showChatroom, showEffect, gList, handleGiveGift, showGift, eList, handleGiveEffect, }) {


  return (
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
      <StreamContent
        isConnected={isConnected}
      ></StreamContent>

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

  )
}
