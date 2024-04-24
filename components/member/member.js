import React from 'react'

export default function Member({name}) {
  return (
    <div className="flex gap-3 mb-3 items-center">
      <img
        src="/images/face-id.png"
        className="bg-white rounded-full p-1 h-[34px]" />
      <div>{name}</div>
    </div>
  )
}