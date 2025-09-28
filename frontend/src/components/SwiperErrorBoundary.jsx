import React from 'react';

class SwiperErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a Swiper-related error
    if (error.message && (
      error.message.includes('getComputedStyle') ||
      error.message.includes('parameter 1 is not of type') ||
      error.message.includes('Swiper')
    )) {
      return { hasError: true, error };
    }
    return null;
  }

  componentDidCatch(error, errorInfo) {
    // Only catch Swiper-related errors
    if (error.message && (
      error.message.includes('getComputedStyle') ||
      error.message.includes('parameter 1 is not of type') ||
      error.message.includes('Swiper')
    )) {
      console.warn('SwiperErrorBoundary caught a Swiper error:', error);
      this.setState({ hasError: true, error });
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for Swiper errors - show a simple grid instead
      return (
        <div className="w-full">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">Loading products...</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {this.props.fallbackContent || (
              <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SwiperErrorBoundary;
