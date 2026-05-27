import React from 'react'
import { Container, Typography, Button } from '@mui/material'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
        this.handleReload = this.handleReload.bind(this)
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        // Error boundary caught an error
    }

    handleReload() {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm" style={{ marginTop: '20vh', textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        Something went wrong
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={this.handleReload}>
                        Reload Page
                    </Button>
                </Container>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
