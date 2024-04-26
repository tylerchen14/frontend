import { createContext, useContext, useState } from 'react'

const StreamInfoContext = createContext(null)

export function StreamInfoContextProvider({ children }) {
  const [streamTitle, setStreamTitle] = useState('')
  const [streamDesciption, setStreamDesciption] = useState('')

  return (
    <StreamInfoContext.Provider value={{ streamTitle, setStreamTitle, streamDesciption, setStreamDesciption }}>
      {children}
    </StreamInfoContext.Provider>
  )
}

export const useStreamInfo = () => useContext(StreamInfoContext)
export default useStreamInfo