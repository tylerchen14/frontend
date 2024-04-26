import { API_SERVER } from '@/components/config/api-path';
import { socket } from '@/src/socket';
import { createContext, useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import usePoint from './use-points';
import useToggle from './use-toggle-show';

const GiftContext = createContext(null)

export function GiftContextProvider({ children }) {
  const { streamId, roomCode } = useToggle()
  const { pts, myPoints } = usePoint()
  const giftList = [
    {
      name: "鑿子",
      src: "/images/axe.png",
      price: "100",
      grayscale: false,
    }, {
      name: "便當",
      src: "/images/bento.png",
      price: "300",
      grayscale: false,
    }, {
      name: "燈光",
      src: "/images/flashlight.png",
      price: "200",
      grayscale: false,
    }, {
      name: "鬼魂",
      src: "/images/ghost.png",
      price: "500",
      grayscale: false,
    }, {
      name: "繩索",
      src: "/images/lasso.png",
      price: "100",
      grayscale: false,
    }, {
      name: "開鎖",
      src: "/images/padlock.png",
      price: "600",
      grayscale: false,
    }, {
      name: "石塊",
      src: "/images/stone.png",
      price: "1",
      grayscale: false,
    }, {
      name: "寶藏",
      src: "/images/treasure-chest.png",
      price: "1000",
      grayscale: false,
    }, {
      name: "水瓶",
      src: "/images/water.png",
      price: "300",
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
      const response = await fetch(`${API_SERVER}/totalBonus/Noah`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setTotalBonus(data);
      socket.emit('totalBonus', data, roomCode)
    } catch (error) {
      console.error('抓不到 totalBonus:', error);
    }
  };

  useEffect(() => {
    fetchTotalBonus();
    socket.on('updateBonus', data => {
      setTotalBonus(data)
    })
  }, []);

  const handleGiveGift = async (price, name, pic) => {

    if (isAnimating) {
      console.log(`正在跑動畫${isAnimating}`);
      return;
    }

    const remain = pts - price
    const updateList = gList.map(item => {
      if (item.name === name) {
        return { ...item, grayscale: item.name == name && pts < price }
      }
      return item
    })
    setGList(updateList)

    if (pts > price && remain > 0) {
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
          console.log(`新增 ${data.points} 禮物`);
          fetchTotalBonus()
        })

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
          console.log(`減少 ${data.points} 點數`)
          fetchTotalBonus()
          myPoints()
        }
        )

      // 動畫開始
      setGiftRain([]);
      setIsAnimating(true)
      const createGiftArray = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        gift: pic,
        size: `${parseInt(Math.random() * (70 - 10) + 50)}`
      }))
      setGiftRain(createGiftArray)

    } else {
      Swal.fire({
        toast: true,
        width: 280,
        position: "top",
        icon: 'error',
        iconColor: 'black',
        title: '你買不起這個酷東西',
        showConfirmButton: false,
        timer: 2000,
      })
      return
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