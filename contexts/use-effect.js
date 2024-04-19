import { createContext, useContext, useState } from 'react'
import usePoint from './use-points'
import { API_SERVER } from '@/components/config/api-path';

const EffectContext = createContext(null)

export function EffectContextProvider({ children }) {
  const effectList = [
    {
      effect_id: 1,
      name: "吸睛文字",
      src: "/images/marker.png",
      price: "100",
      grayscale: false,
    },
    {
      effect_id: 2,
      name: "替換背景",
      src: "/images/neon.png",
      price: "200",
      grayscale: false,
    },
    {
      effect_id: 3,
      name: "改換字體",
      src: "/images/font.png",
      price: "300",
      grayscale: false,
    },
    {
      effect_id: 4,
      name: "釘選留言",
      src: "/images/pin.png",
      price: "400",
      grayscale: false,
    },
  ]
  const [showEffect, setShowEffect] = useState(false)
  const [eList, setEList] = useState(effectList)
  const { pts, setPts } = usePoint()

  const handleEffectTab = () => {
    setShowEffect(!showEffect)
  }

  const handleGiveEffect = (price, name) => {
    let effect = Number(price)

    const updateList = eList.map(item => {
      return { ...item, grayscale: item.name == name && pts < effect }
    })
    setEList(updateList)

    if (pts >= effect) {
      setPts(prevP => prevP - effect)
    } else {
      return
    }

    const selectedEffect = eList.find(item => item.name === name);

    const effectId = selectedEffect.effect_id;
    ;

    fetch(`${API_SERVER}/use-point`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 1,
        points: effect,
        source: effectId,
      }),
    })
      .then(r => r.json())
      .then(data =>
        console.log(`減少 ${data} 點數`)
      )

  }

  return (
    <EffectContext.Provider value={{ eList, handleEffectTab, handleGiveEffect, showEffect }}>
      {children}
    </EffectContext.Provider>
  )
}

export const useE = () => useContext(EffectContext)
export default useE