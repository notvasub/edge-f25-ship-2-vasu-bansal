import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          maxWidth: 640, 
          margin: '2rem auto', 
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          border: '1px solid #ff6b6b',
          borderRadius: 8,
          backgroundColor: '#fff5f5'
        }}>
          <h2 style={{ color: '#ff6b6b', marginTop: 0 }}>Something went wrong</h2>
          <p>An error occurred while rendering this page.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
