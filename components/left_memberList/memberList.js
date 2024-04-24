import Level from '@/components/level/level';
import Member from '@/components/member/member';
import useToggle from '@/contexts/use-toggle-show';
import { RiCornerUpLeftFill, RiSearchLine } from "@remixicon/react";
import styles from './memberList.module.css';
import { socket } from '@/src/socket';
import { useEffect, useState } from 'react';

export default function MemberList({ totalBonus }) {

  const { onPhone, showSidebar, showMember, handleShowMemberlist } = useToggle()
  const [members, setMembers] = useState([])

  useEffect(() => {
    socket.on('userGo', userData => {
      setMembers(prev => [...prev, userData])
    })

    return () => {
      socket.off('userGo');
    };
  }, [])

  return (
    <div className={`${styles['sidebar']} ${showSidebar ? '' : styles.hidden_left} ${!onPhone ? "" : showMember ? styles.show_up : styles.hidden_down}`}>

      {!onPhone ? "" : !showMember ? "" : <RiCornerUpLeftFill
        className='absolute top-3 left-4 cursor-pointer z-50'
        onClick={handleShowMemberlist}
      />}

      <div className={`${styles['sidebar-container']}`}>

        {/* 搜尋框 */}
        {/* <div className='relative'>
          <input
            type="text"
            placeholder='搜尋現在人員'
            className={styles['search-field']}
          />
          <RiSearchLine
            className={styles['search-icon']}
          ></RiSearchLine>
        </div> */}
        <div className={`text-left mt-5 mb-1 max-md:mt-0 `}>直播總打賞: {totalBonus}</div>
        <hr className="border-2" />
        <hr className={`${styles['line']} mt-1 border-dotted`} />

        <div className={styles['member-list']}>

          {/* 成員排序內容 */}
          {members.map((m, i) => (
            <Member key={i}
            name={m.name}></Member>
          ))}

        </div>
      </div>
    </div>
  )
}
