import Sidebar from '@/components/sidebar/sidebar';
import { RiCloseLine } from "@remixicon/react";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/final-check.module.css';

export default function CheckWebcamSource() {

  const [onPhone, setOnPhone] = useState(false);

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

      {/* FIXME:連結用不了 */}
        <Link href="./index">
          <RiCloseLine className={styles['cancel']} />
        </Link>

        {/* 測邊框 */}
        {!onPhone && <Sidebar></Sidebar>}

        {/* 影音來源框 */}
        <div className={`${styles['mainframe']} w-4/5
        max-md:w-full max-md:h-full`}>

          {/* 標題 */}
          <div className={styles['title']}>{!onPhone && "第三步: 最後確認！"}</div>

          {onPhone &&
            <div className='max-md:py-7'></div>
          }
          {/* 白框內 */}
          <div className={styles['white-block']}>
            <div className={styles['innerline']}>
              <div className={`${styles['source']}`}></div>

              <div className={styles['bottom-block']}>
                <div className={styles['first-block']}>
                  <div className={styles['title-text']}>標題</div>
                  <input
                    type="text"
                    placeholder='顯示先前輸入內容'
                    className='bg-stone-900 rounded h-10 max-w-sm p-2 text-white
                      max-md:w-9/12 max-md:mb-2'
                  />
                </div>

                <div className={styles['second-block']}>
                  <div className={styles['title-text']}>內容</div>
                  <textarea
                    className='bg-stone-900 rounded 
                      max-w-sm p-2 text-white pt-2
                      max-md:w-9/12'
                    cols="40"
                    rows="3"
                    maxLength={50}
                    placeholder='顯示先前輸入內容'
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* 下一步 */}
          <Link href="./05-streaming">
            <div className={styles['next-block']}>
              <div className={styles['next-step']}>
                <div className='text-black'>GO</div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </>
  )
}
