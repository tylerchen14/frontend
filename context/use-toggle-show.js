import { createContext, useContext, useState, useEffect } from 'react'

const ViewToggleContext = createContext(null)

export function ViewToggleContextProvider({ children }) {

  const [onPhone, setOnPhone] = useState(false);
  const [showChatroom, setShowChatroom] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showGift, setShowGift] = useState(false);
  const [showMember, setShowMember] = useState(false);

  // 手機上顯示
  useEffect(() => {
    const sizeChange = () => {
      setOnPhone(window.innerWidth < 768)
    }

    sizeChange()
    window.addEventListener('resize', sizeChange)
  }, [])

  // 顯示聊天室（桌機）
  const handleChatroom = () => {
    setShowChatroom(!showChatroom)
  }

  // 顯示左側成員欄（桌機）
  const handleSidebarHide = () => {
    setShowSidebar(!showSidebar)
  }

  // 顯示禮物介面（手機）

  const handleShowGift = () => {
    setShowGift(!showGift)
  }

  // 顯示成員列表（手機）
  const handleShowMemberlist = () => {
    setShowMember(!showMember)
  }

  return (
    <ViewToggleContext.Provider value={{onPhone,showChatroom,showSidebar,showGift,showMember,handleChatroom,handleSidebarHide,handleShowGift,handleShowMemberlist}}>
      {children}
    </ViewToggleContext.Provider>
  )
}

export const useToggle = () => useContext(ViewToggleContext)
export default useToggle