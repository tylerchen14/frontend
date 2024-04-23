import Image from 'next/image'

export default function Process1({ name1, name2, name3, size = 38 }) {
  return (
    <>
      <div className="flex w-full items-center p-2">
        <Image
          src="/icons/actived.svg"
          width={size}
          height={size}
          alt="pro"
          className="w-[22px] md:w-[38px]"
        />
        <div className="h-px  bg-black w-full"></div>
        <Image
          src="/icons/processing.svg"
          width={size}
          height={size}
          alt="act"
          className="w-[22px] md:w-[38px]"
        />

      </div>
      <div className="flex justify-between w-full">
        <div className="text-white text-sm font-medium font-['Noto Sans TC']">
          {name1}
        </div>{' '}
        <div className="text-white text-sm font-medium font-['Noto Sans TC']">
          {name2}
        </div>
      </div>
    </>
  )
}
