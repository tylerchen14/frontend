import Sidebar from '@/components/sidebar/sidebar';
import StepMap from '@/components/step-map/step-map';
import { RiCloseLine } from "@remixicon/react";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/insert-live-details.module.css';

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
        <Link href="/"><RiCloseLine className={styles['cancel']} /></Link>

        {/* 測邊框 */}
        {!onPhone && <Sidebar></Sidebar>}
        {/* 影音來源框 */}
        <div className={`${styles['mainframe']} w-4/5 max-md:w-full max-md:h-full`}>

          {/* 標題 */}
          <div className={styles['title']}>{!onPhone && "第二步: 輸入直播資訊"}</div>

          {onPhone &&
            <div className='max-md:py-7'></div>
          }

          {/* 白框內 */}
          <div className={styles['white-block']}>
            <div className={styles['innerline']}>

              <div className={styles['first-block']}>
                <div className={styles['title-text']}>給一個酷酷的標題</div>
                <input
                  type="text"
                  maxLength={20}
                  placeholder='請輸入標題，限 20 字'
                  className='bg-stone-900 rounded w-2/5 max-w-sm p-2 text-white
                  max-md:w-9/12 max-md:mb-2
                  '/>
              </div>

              <div className={styles['second-block']}>
                <div className={styles['title-text']}>一句話形容你的直播</div>
                <textarea
                  className='bg-stone-900 rounded w-2/5 max-w-sm p-2 text-white
                  max-md:w-9/12
                  '
                  cols="30"
                  rows="5"
                  maxLength={50}
                  placeholder='限 50 字輸入'
                ></textarea>
              </div>

            </div>
          </div>

          {/* 下一步 */}
          <StepMap></StepMap>

        </div>
      </div>
    </>
  )
}
