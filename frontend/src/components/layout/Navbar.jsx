import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div style={{
      gridColumn: '1 / -1',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1.25rem', borderBottom: '1px solid #dee2e6',
      background: 'white', height: 52
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, background: '#534AB7', borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 14, fontWeight: 700
        }}>M</div>
        <span style={{ fontWeight: 600, fontSize: 15 }}>MathProf</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, color: '#6c757d' }}>Plan: Free</span>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: '#EEEDFE', color: '#534AB7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600
        }}>AM</div>
      </div>
    </div>
  )
}