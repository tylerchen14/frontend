import { RiArrowDownSLine, RiArrowUpSLine, RiArrowRightSLine } from "@remixicon/react";
import { useState } from 'react';
import styles from './title.module.css';

export default function Title() {

  // 標題敘述
  const initDetail = {
    title: "這是我的直播，我最多 20 字",
    detail: "直播細節會寫在這裡，我最多 50 字，我可以被收起來，也可以換行，還剩下九個字喔！"
  }
  const [streamDetail, setstreamDetail] = useState(initDetail)

  // 顯示敘述
  const [showDetail, setShowDetail] = useState(false);

  const handleShowDetail = () => {
    setShowDetail(!showDetail)
  }

  return (
    <div className={styles['title-container']}>
    {showDetail ?
            <RiArrowRightSLine
              onClick={handleShowDetail} />
            :
            <RiArrowDownSLine
              onClick={handleShowDetail} />
          }
      <div>
        <div className='flex items-center'>
          <div className='text-xl font-semibold max-md:text-base'>{streamDetail.title}</div>
          
        </div>
        <div className={`font-semibold text-sm max-md:w-[300px] ${showDetail ? "block" : "hidden"}`}
        >{streamDetail.detail}</div>
      </div>
    </div>
  )
}
