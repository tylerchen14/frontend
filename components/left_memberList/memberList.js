import Member from '@/components/member/member';
import useToggle from '@/contexts/use-toggle-show';
import { socket } from '@/src/socket';
import { RiCornerUpLeftFill } from "@remixicon/react";
import { useEffect, useState } from 'react';
import styles from './memberList.module.css';

export default function MemberList({ totalBonus }) {

  const { onPhone, showSidebar, showMember, handleShowMemberlist, roomCode } = useToggle()
  const [members, setMembers] = useState([])

  useEffect(() => {
    socket.on('userGo', viewerIdList => {
      setMembers(viewerIdList);
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
        <div className={`text-left mt-5 mb-1 max-md:mt-0 `}>直播總打賞: {totalBonus}</div>
        <hr className="border-2" />
        <hr className={`${styles['line']} mt-1 border-dotted`} />

        {/* 成員排序內容 */}
        <div className={styles['member-list']}>
          {members.map((m, i) => (
            <Member
              key={m.viewerId}
              index={m.viewerId}
              name={m.name}></Member>
          ))}

        </div>
      </div>
    </div>
  )
}
