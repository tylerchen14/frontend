import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './step-map.module.css';
import Swal from 'sweetalert2'
import useStreamInfo from "@/contexts/use-streamInfo";
import useToggle from "@/contexts/use-toggle-show";

export default function StepMap() {
  const { onPhone, showSidebar, showMember, handleShowMemberlist } = useToggle()
  const { streamTitle, setStreamTitle, streamDesciption, setStreamDesciption } = useStreamInfo()
  const router = useRouter()
  const finalPrepPage = router.pathname.includes("/03");
  const [turnPage, setTurnPage] = useState([{
    url: '/'
  }, {
    url: '/02-check-webcam-source'
  }, {
    url: '/03-insert-live-details'
  }, {
    url: '/05-streaming/streamer'
  }])

  const handlePageChange = () => {

    const currentUrl = window.location.pathname
    const currentPageIndex = turnPage.findIndex(page => page.url === currentUrl)

    if (finalPrepPage && streamTitle === "") {
      Swal.fire({
        toast: true,
        width: 280,
        position: onPhone ? "top" : "top-end",
        icon: 'error',
        iconColor: 'black',
        title: '標題不可空白',
        showConfirmButton: false,
        timer: 2000,
      })
      return
    }

    if (currentPageIndex !== -1 && currentPageIndex < turnPage.length - 1) {
      const nextPageUrl = turnPage[currentPageIndex + 1].url
      router.push(nextPageUrl)
    }
  }

  return (

    <div className={styles['changeUrl']}>
      <div className={styles['prev-step']}
        onClick={() => {
          router.back()
        }}>
        <div>上一步</div>
        <RiArrowUpSLine className={styles['arrow']}></RiArrowUpSLine>
      </div>

      <div className={styles['next-step']}
        onClick={handlePageChange}>
        <div>{finalPrepPage ? "開始直播" : "下一步"}</div>
        <RiArrowDownSLine className={styles['arrow']}></RiArrowDownSLine>
      </div>
    </div>
  )
}
