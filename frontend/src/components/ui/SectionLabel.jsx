export default function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#6c757d',
      marginBottom: 6,
      fontWeight: 500
    }}>
      {children}
    </div>
  )
}