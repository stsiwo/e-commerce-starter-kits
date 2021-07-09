import * as React from 'react'
import { useHistory } from 'react-router';
import TechnicalError from '../TechnicalError';

type ErrorBoundaryStateType = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<{}, ErrorBoundaryStateType> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error);
    console.log(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <TechnicalError />
    }
    return this.props.children;
  }
}
export default ErrorBoundary
