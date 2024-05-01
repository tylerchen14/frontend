import useStreamInfo from "@/contexts/use-streamInfo";
import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/react";
import { useEffect, useState } from 'react';
import styles from './title.module.css';
import { socket } from "@/src/socket";

export default function Title() {

  const { streamTitle, setStreamTitle, streamDesciption, setStreamDesciption } = useStreamInfo()

  // 顯示敘述
  const [showDetail, setShowDetail] = useState(false);

  const handleShowDetail = () => {
    setShowDetail(!showDetail)
  }

  useEffect(() => {
    socket.on('sendTitle', (title) => {
      setStreamTitle(title)
    })

    socket.on('sendDescript', (description) => {
      setStreamDesciption(description)
    })

  }, [])

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
          <div className='text-xl font-semibold max-md:text-base'>{streamTitle}</div>

        </div>
        <div className={`font-semibold text-sm max-md:w-[300px] ${showDetail ? "block" : "hidden"}`}
        >{streamDesciption}</div>
      </div>
    </div>
  )
}
