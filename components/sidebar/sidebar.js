import React, { useEffect } from 'react'
import styles from './sidebar.module.css'
import { useState } from 'react';

export default function Sidebar() {

  const [onPage1, setOnPage1] = useState(false);
  const [onPage2, setOnPage2] = useState(false);
  const [onPage3, setOnPage3] = useState(false)

  // 網址改變後做確認
  useEffect(() => {
    const linkChange = () => {
      if (window.location.href.includes('check-webcam-source')) {
        setOnPage1(true)
      } else if (window.location.href.includes('insert-live-details')) {
        setOnPage2(true)
      } else if (window.location.href.includes('final-check')) {
        setOnPage3(true)
      }
    }
    linkChange()

    // 出現網址改變後跑程式
    window.addEventListener('popstate', linkChange);

    return () => {
      window.removeEventListener('popstate', linkChange);
    };
  }, [])

  return (
    <>
      {/* 側邊框 */}
      <div className={`${styles['sidebar']} w-1/5`}>
        <div className='mb-4'>基本設定</div>
        <hr className={styles['line']} />

        <a href="/02-check-webcam-source"><div className={onPage1 ? `${styles['selected-section']} pl-2.5` : `pl-2.5`}>確認影音來源</div></a>

        <a href="/03-insert-live-details"><div className={onPage2 ? `${styles['selected-section']} pl-2.5` : `pl-2.5`}>輸入直播資訊</div></a>

        <a href="/04-final-check"><div className={onPage3 ? `${styles['selected-section']} pl-2.5` : `pl-2.5`}>開始直播!</div></a>

      </div>
    </>
  )
}
