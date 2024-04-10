import React from 'react'
import styles from './giftIcon.module.css'
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GiftIcon() {

  const [onPhone, setOnPhone] = useState(false);
  useEffect(() => {
    const sizeChange = () => {
      setOnPhone(window.innerWidth < 768)
    }
    sizeChange()
    window.addEventListener('resize', sizeChange)
  },[])

  const [showGift, setShowGift] = useState(false);

  const giftList = [
    {
      name: "鑿子",
      src: "/images/axe.png",
    }, {
      name: "便當",
      src: "/images/bento.png",
    }, {
      name: "手電筒",
      src: "/images/flashlight.png",
    }, {
      name: "鬼魂",
      src: "/images/ghost.png",
    }, {
      name: "繩索",
      src: "/images/lasso.png",
    }, {
      name: "開鎖",
      src: "/images/padlock.png",
    }, {
      name: "石塊",
      src: "/images/stone.png",
    }, {
      name: "寶藏",
      src: "/images/treasure-chest.png",
    }, {
      name: "水",
      src: "/images/water.png",
    },
  ]

  return (
    <div className={`${styles['gift-bar']} ${!onPhone ? "" : showGift ? "" : styles.hide} `}>
      {giftList.map((c, i) => {
        return (
        <div className={styles['gift']} key={i}>
          <Image width={35} height={35} src={c.src} className={styles['circle']} alt={c.name}></Image>
          <div>{c.name}</div>
        </div>
        )
      })}
    </div>
  )
}
