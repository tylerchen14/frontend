import { API_SERVER } from '@/components/config/api-path';
import { createContext, useContext, useEffect, useState } from 'react';
import useToggle from './use-toggle-show';
import { socket } from '@/src/socket';

const GiftContext = createContext(null)

export function GiftContextProvider({ children }) {
  const { streamId, roomCode } = useToggle()
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
  const [totalBonus, setTotalBonus] = useState(null)
  const [gList, setGList] = useState(giftList)
  const [giftRain, setGiftRain] = useState([])
  const [isAnimating, setIsAnimating] = useState(false);

  // 禮物列表

  const fetchTotalBonus = async () => {
    try {
      const response = await fetch(`${API_SERVER}/totalBonus/Noah`);
      const data = await response.json();
      setTotalBonus(data);
      socket.emit('totalBonus', data, roomCode)
    } catch (error) {
      console.error('抓不到 totalBonus:', error);
    }
  };

  useEffect(() => {
    // if (roomCode === streamId) {
    fetchTotalBonus();
    socket.on('updateBonus', data => {
      setTotalBonus(data)
    })
    // }
  }, []);

  const handleGiveGift = async (price, chance, name, pic) => {

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
      await fetch(`${API_SERVER}/give-streamer-point`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "Noah",
          gift: name,
          point: price
        })
      })
        .then(r => r.json())
        .then(data => {
          console.log(`新增 ${data} 禮物`);
          fetchTotalBonus()
        })
    } else {
      return
    }

    await fetch(`${API_SERVER}/use-point`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 1,
        points: price,
        source: name,
      }),
    })
      .then(r => r.json())
      .then(data => {
        console.log(`減少 ${data} 點數`)
        fetchTotalBonus()
      }
      )


    if (isAnimating) {
      return;
    } else {
      setIsAnimating(true)
      setGiftRain([]);
      const createGiftArray = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        gift: pic,
        size: `${parseInt(Math.random() * (70 - 10) + 50)}`
      }))
      setGiftRain(createGiftArray)
    }

  }

  return (
    <GiftContext.Provider value={{ totalBonus, gList, giftRain, handleGiveGift, setGiftRain, isAnimating, setIsAnimating, fetchTotalBonus }}>
      {children}
    </GiftContext.Provider>
  )
}

export const useGift = () => useContext(GiftContext)
export default useGift