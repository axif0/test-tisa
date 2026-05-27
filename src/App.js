import React, { createContext, useState, useMemo, useEffect } from 'react'
import NavBar from './components/NavBar/NavBar.js'
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

export const ThemeContext = createContext()

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: { main: '#27a75c' },
        secondary: { main: '#9c27b0' },
        ...(mode === 'dark' && {
            background: {
                default: '#121212',
                paper: '#1e1e1e',
            },
            text: {
                primary: '#e0e0e0',
                secondary: '#aaaaaa',
            },
        }),
    },
    typography: {
        fontFamily: "'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: ({ theme }) => ({
                    ...(theme.palette.mode === 'dark' && {
                        borderColor: 'rgba(255, 255, 255, 0.12)',
                    }),
                }),
            },
        },
    },
})

const App = (props) => {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('tishaTheme')
        if (saved) return saved
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    })

    useEffect(() => {
        localStorage.setItem('tishaTheme', mode)
        document.documentElement.setAttribute('data-theme', mode)
    }, [mode])

    const toggleTheme = () => {
        setMode(prev => prev === 'light' ? 'dark' : 'light')
    }

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <NavBar {...props} />
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}

export default App
