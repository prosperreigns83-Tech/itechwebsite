import React, { useEffect, useMemo, useState } from 'react'

function pad(n){return String(n).padStart(2,'0')}

export default function FlashTimer({ endTime, duration = 15 * 60 * 60 * 1000, onSeeAll, title = 'Flash Sales', buttonLabel = 'See All' }){
  const targetTime = useMemo(() => {
    return endTime ? new Date(endTime).getTime() : Date.now() + duration
  }, [endTime, duration])

  const [remaining, setRemaining] = useState(() => Math.max(targetTime - Date.now(), 0))
  const [repeatEnabled, setRepeatEnabled] = useState(false)

  useEffect(() => {
    let target = targetTime
    const tick = () => {
      const now = Date.now()
      let r = Math.max(target - now, 0)
      if (r === 0 && repeatEnabled) {
        target = Date.now() + 4 * 60 * 60 * 1000
        r = Math.max(target - Date.now(), 0)
      }
      setRemaining(r)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetTime, repeatEnabled])

  const hrs = Math.floor(remaining / 3600000)
  const mins = Math.floor((remaining % 3600000) / 60000)
  const secs = Math.floor((remaining % 60000) / 1000)

  return (
    <div className="flash-timer">
      <div className="flash-left">
        <div className="flash-badge">{title}</div>
        <div className="flash-copy">TIME LEFT: <span className="flash-time">{pad(hrs)}h : {pad(mins)}m : {pad(secs)}s</span></div>
      </div>
      <div className="flash-right">
        {remaining < 24 * 60 * 60 * 1000 && (
          <label style={{display:'inline-flex',alignItems:'center',gap:8,marginRight:12,fontSize:12,color:'rgba(255,255,255,0.92)'}}>
            <input type="checkbox" checked={repeatEnabled} onChange={e => setRepeatEnabled(e.target.checked)} />
            <span style={{opacity:0.95}}>Repeat every 4h</span>
          </label>
        )}
        {onSeeAll && (
          <button className="flash-button" onClick={onSeeAll}>{buttonLabel}</button>
        )}
      </div>
    </div>
  )
}
