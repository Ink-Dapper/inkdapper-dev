import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      return (
        <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'monospace', background: '#fff8f8' }}>
          <h2 style={{ color: '#c00', fontSize: '1.4rem', marginBottom: '1rem' }}>
            App Error — check browser console for full details
          </h2>
          <details open style={{ background: '#fff', border: '1px solid #f99', borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#c00' }}>
              {error && error.toString()}
            </summary>
            <pre style={{ marginTop: '0.75rem', whiteSpace: 'pre-wrap', fontSize: '0.8rem', color: '#333' }}>
              {errorInfo && errorInfo.componentStack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '0.5rem 1.5rem', background: '#f97316', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '1rem' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
