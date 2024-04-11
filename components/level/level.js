import React, { useState } from 'react'

export default function Level(props) {

  return (
    <div>
      <div className='mt-6 mb-1'>階級 - {props.name}</div>
      <hr className="border-dotted" />
      <hr className="mt-1 mb-2 border-dotted" />
    </div>
  )
}
