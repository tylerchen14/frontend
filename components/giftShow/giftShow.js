import { motion } from 'framer-motion'
import Image from 'next/image'
import useAni from '@/context/use-animate';

export default function GiftShow({ giftrain, size }) {

  // const { isAnimating, setIsAnimating } = useAni()

  const gift_appear = {

    hidden: {
      y: -400,
      opacity: 1
    },

    visible: {
      y: [-200, 900],
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeIn",
        repeat: 1,
        delay: Math.random() * 2
      }
    },

    exit: {
      y: 900,
      opacity: 0,
    }

  }
  // console.log(`第三次${isAnimating}`);

console.log('跑動畫');
  return (
    <motion.div
      variants={gift_appear}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ position: 'absolute', left: `${Math.random() * 100}%` }}
      onAnimationComplete={() => { 
        // setIsAnimating(false) 
        }
      }
    >
      <Image width={size} height={size} src={giftrain} />
    </motion.div>
  )
}
