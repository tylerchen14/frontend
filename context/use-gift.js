import { createContext, useContext, useState } from 'react'
import useAni from './use-animate'
import { socket } from '@/src/socket'

const GiftContext = createContext(null)

export function GiftContextProvider({ children }) {
  const giftList = [
    {
      name: "鑿子",
      src: "/images/axe.png",
      price: "100",
      chance: 1,
      grayscale: false,
    }, {
      name: "便當",
      src: "/images/bento.png",
      price: "300",
      chance: 1,
      grayscale: false,
    }, {
      name: "燈光",
      src: "/images/flashlight.png",
      price: "200",
      chance: 1,
      grayscale: false,
    }, {
      name: "鬼魂",
      src: "/images/ghost.png",
      price: "500",
      chance: 1,
      grayscale: false,
    }, {
      name: "繩索",
      src: "/images/lasso.png",
      price: "100",
      chance: 1,
      grayscale: false,
    }, {
      name: "開鎖",
      src: "/images/padlock.png",
      price: "600",
      chance: 1,
      grayscale: false,
    }, {
      name: "石塊",
      src: "/images/stone.png",
      price: "1",
      chance: 1,
      grayscale: false,
    }, {
      name: "寶藏",
      src: "/images/treasure-chest.png",
      price: "1000",
      chance: 1,
      grayscale: false,
    }, {
      name: "水瓶",
      src: "/images/water.png",
      price: "300",
      chance: 100,
      grayscale: false,
    },
  ]
  const [totalBonus, setTotalBonus] = useState(0)
  const [gList, setGList] = useState(giftList)
  const [giftRain, setGiftRain] = useState([])
  const { isAnimating, setIsAnimating } = useAni()

  // 禮物列表

  const handleGiveGift = (price, chance, name, pic) => {
    let gift = Number(price)

    const updateList = gList.map(item => {
      if (item.name === name) {
        let newChance = chance
        if (chance > 0) {
          newChance = chance - 1
        }
        return { ...item, chance: newChance, grayscale: item.name == name && newChance <= 0 }
      }
      return item
    })
    setGList(updateList)

    if (chance > 0) {
      setTotalBonus(prevTotal => prevTotal + gift)
    } else {
      return
    }

    if (isAnimating) {
      return;
    }
    setIsAnimating(true);
    console.log(`第一次${isAnimating}`);
    setGiftRain([]);

    const createGiftArray = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      gift: pic,
      size: `${parseInt(Math.random() * (70 - 10) + 50)}`
    }))
    setTimeout(() => setGiftRain(createGiftArray), 0);
    socket.emit('giveGift', createGiftArray)
    socket.on('giveGiftToOthers', () => {
      setTimeout(() => setGiftRain(createGiftArray), 0);
    })
  }


  return (
    <GiftContext.Provider value={{ totalBonus, gList, giftRain,handleGiveGift, setGiftRain}}>
      {children}
    </GiftContext.Provider>
  )
}

export const useGift = () => useContext(GiftContext)
export default useGift