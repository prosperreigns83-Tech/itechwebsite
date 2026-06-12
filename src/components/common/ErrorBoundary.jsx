import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error:", error, errorInfo);
    this.setState(prev => ({ error, errorInfo, errorCount: prev.errorCount + 1 }));
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", textAlign: "center", minHeight: "400px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>??</div>
          <h1>Oops! Something went wrong</h1>
          <p>We're sorry, but something unexpected happened.</p>
          <div style={{ margin: "20px 0" }}>
            <button onClick={this.handleReset} style={{ marginRight: "10px", padding: "10px 20px", cursor: "pointer" }}>Try Again</button>
            <button onClick={() => window.location.href = "/"} style={{ padding: "10px 20px", cursor: "pointer" }}>Go Home</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
