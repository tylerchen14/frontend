import Level from '@/components/level/level';
import Member from '@/components/member/member';
import useToggle from '@/context/use-toggle-show';
import { RiCornerUpLeftFill, RiSearchLine } from "@remixicon/react";
import styles from './memberList.module.css';

export default function MemberList({ totalBonus }) {

  const { onPhone, showSidebar, showMember, handleShowMemberlist } = useToggle()

  return (
    <div className={`${styles['sidebar']} ${showSidebar ? '' : styles.hidden_left} ${!onPhone ? "" : showMember ? styles.show_up : styles.hidden_down}`}>

      {!onPhone ? "" : !showMember ? "" : <RiCornerUpLeftFill
        className='absolute top-2 left-2 cursor-pointer z-50'
        onClick={handleShowMemberlist}
      />}

      <div className={`${styles['sidebar-container']}`}>

        {/* 搜尋框 */}
        <div className='relative'>
          <input
            type="text"
            placeholder='搜尋現在人員'
            className={styles['search-field']}
          />
          <RiSearchLine
            className={styles['search-icon']}
          ></RiSearchLine>
        </div>
        <div className='text-left mt-5 mb-1'>直播總打賞: {totalBonus}</div>
        <hr className="border-2" />
        <hr className={`${styles['line']} mt-1 border-dotted`} />

        <div className={styles['member-list']}>

          {/* 成員排序內容 */}
          <Level name="探險王" amount="5,000+"></Level>
          <Member></Member>
          <Member></Member>
          <Member></Member>
          <Member></Member>

          <Level name="製圖師" amount="3,000+"></Level>
          <Member></Member>
          <Member></Member>
          <Member></Member>

          <Level name="鑑賞員" amount="1,000+"></Level>
          <Member></Member>
          <Member></Member>
          <Member></Member>
          <Member></Member>

          <Level name="駝獸" amount="500+"></Level>
          <Member></Member>
          <Member></Member>

          <Level name="新手村"></Level>
          <Member></Member>
          <Member></Member>

        </div>
      </div>
    </div>
  )
}
