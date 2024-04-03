import Sidebar from '@/components/sidebar/sidebar';
import StepMap from '@/components/step-map/step-map';
import { RiCloseLine, RiMicFill, RiRecordCircleFill } from "@remixicon/react";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/check-webcam-source.module.css';

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
        <Link href="/">
          <RiCloseLine className={styles['cancel']} />
        </Link>

        {/* 測邊框 */}
        {!onPhone && <Sidebar></Sidebar>}
        {/* 影音來源框 */}
        <div className={`${styles['mainframe']} w-4/5 max-md:w-full max-md:h-full`}>

          {/* 標題 */}
          <div className={styles['title']}>{!onPhone && "第一步: 確認影音來源"}</div>
          {onPhone &&
            <div className='max-md:py-7'></div>
          }
          {/* 白框內 */}
          <div className={styles['white-block']}>
            <div className={styles['innerline']}>
              <div className='text-4xl font-bold mb-1 max-md:text-3xl max-md:mt-2'>連接影音/畫面</div>
              <div className='mb-4 max-md:text-sm max-md:mb-2'>檢查是否有畫面與聲音</div>
              <div className={`${styles['source']}`}></div>
              <div className={styles['bottom-part']}>
                <button className={styles['button']}>刷新</button>
                <div className={`${styles['icon-box']}`}>
                  <RiRecordCircleFill></RiRecordCircleFill>
                  <RiMicFill></RiMicFill>
                </div>
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
