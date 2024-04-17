import { createContext, useContext, useState } from 'react'

const AnimateContext = createContext(null)

export function AnimateContextProvider({ children }) {

  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <AnimateContext.Provider value={{ isAnimating, setIsAnimating }}>
      {children}
    </AnimateContext.Provider>
  )
}

export const useAni = () => useContext(AnimateContext)
export default useAni