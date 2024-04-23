import Process0 from '@/components/checkPoint/tyler_process0';
import Sidebar from '@/components/sidebar/sidebar';
import StepMap from '@/components/step-map/step-map';
import styles from '@/styles/check-webcam-source.module.css';
import { RiCloseLine } from "@remixicon/react";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function CheckWebcamSource() {
  const localVidsRef = useRef()
  const [onPhone, setOnPhone] = useState(false);
  let myStream

  useEffect(() => {
    const sizeChange = () => {
      setOnPhone(window.innerWidth < 768)
    }
    sizeChange()
    window.addEventListener('resize', sizeChange)
  })

  useEffect(() => {
    checkCam()
  }, [])


  const checkCam = () => {
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user"
      },
      audio: true
    })
      .then(stream => {
        myStream = stream
        localVidsRef.current.srcObject = stream;
        localVidsRef.current.play();
      })
  }

  const refreshCam = () => {
    if (myStream) {
      myStream.getTracks().forEach(track => {
        track.stop()
      })
      checkCam()
    } else {
      console.log('沒有東西可刷新');
    }
  }

  return (

    <>
      {/* 最大框 */}
      <div className={styles['container']}>

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
            <div className='w-8/12'>
              <Process0
                name1={"確認來源"}
                name2={"輸入標題"}
              ></Process0>
            </div>
          }
          {/* 白框內 */}
          <div className={styles['white-block']}>
            <div className={styles['innerline']}>
              <div className='text-4xl font-bold mb-1 max-md:text-2xl max-md:mt-2'>連接影音/畫面</div>
              <div className='mb-6 max-md:text-sm max-md:mb-6'>檢查是否有畫面與聲音</div>

              <div
                id='stream-block'
                className='flex flex-col max-w-[70vh] w-full max-md:max-w-[40vh]'>
                <video
                  ref={localVidsRef}
                  className={`aspect-video object-cover max-h-[40vh]`}
                  controls
                  autoPlay
                  playsInline>
                </video>
              </div>

              <div className={styles['bottom-part']}>
                <button
                  className={styles['button']}
                  onClick={refreshCam}
                >刷新</button>
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
