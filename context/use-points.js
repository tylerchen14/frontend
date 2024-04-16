import React, { useEffect, useState } from 'react'
import { useContext, createContext } from 'react'

const PointContext = createContext()

export function PointContextProvider({ children }) {

  const [pts, setPts] = useState(0)

  const myPoints = async () => {
    try {
      const r = await fetch("http://localhost:3001/05-streaming/u-point/1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await r.json()
      setPts(data)
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    myPoints()
    const intervalId = setInterval(myPoints, 100);
    return () => clearInterval(intervalId);
  }, [])

  return (
    <PointContext.Provider value={{ pts, setPts }}>
      {children}
    </PointContext.Provider>
  )
}

export const usePoint = () => useContext(PointContext)
export default usePoint
