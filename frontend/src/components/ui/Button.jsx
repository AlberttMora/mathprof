export default function Button({ children, variant = 'primary', onClick, disabled, fullWidth }) {
  const styles = {
    primary: {
      background: '#534AB7', color: 'white', border: 'none'
    },
    secondary: {
      background: 'white', color: '#495057', border: '1px solid #dee2e6'
    },
    danger: {
      background: 'white', color: '#dc3545', border: '1px solid #dc3545'
    }
  }

  return (
    <button
      type="button" // 🔥 IMPORTANTE
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: '7px 16px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: variant === 'primary' ? 500 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'opacity 0.15s'
      }}
    >
      {children}
    </button>
  )
}