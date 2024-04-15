import React from 'react'
import styles from './step-map.module.css'
import Link from 'next/link'
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { useRouter } from 'next/router'
import { useState } from 'react';

export default function StepMap() {

  const router = useRouter()

  const [turnPage, setTurnPage] = useState([{
    url: '/'
  }, {
    url: '/02-check-webcam-source'
  }, {
    url: '/03-insert-live-details'
  }, {
    url: '/04-final-check'
  }])

  const handlePageChange = () => {

    const currentUrl = window.location.pathname
    const currentPageIndex = turnPage.findIndex(page => page.url === currentUrl)

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
        <div>下一步</div>
        <RiArrowDownSLine className={styles['arrow']}></RiArrowDownSLine>
      </div>
    </div>
  )
}
