import useGift from '@/contexts/use-gift'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function GiftShow({ giftrain, size }) {

  const { setIsAnimating, isAnimating, setGiftRain } = useGift()

  const gift_appear = {

    hidden: {
      y: -400,
      opacity: 1
    },

    visible: {
      y: [-200, 2000],
      zIndex: 600,
      opacity: 1,
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: 0,
        delay: Math.random() * 2
      }
    },
  }

  return (
    <motion.div
      variants={gift_appear}
      initial="hidden"
      animate="visible"
      style={{ position: 'absolute', left: `${Math.random() * 100}%` }}
      onAnimationComplete={() => {

        setIsAnimating(false);
        setGiftRain([]);
        console.log(`動畫結束 ${isAnimating}`);

      }}
    >
      <Image width={size} height={size} src={giftrain} alt='動畫' />
    </motion.div>
  )
}
