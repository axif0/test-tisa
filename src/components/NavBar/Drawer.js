import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { Box, Drawer as MUIDrawer, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, IconButton, Tooltip, Typography, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PeopleIcon from '@mui/icons-material/People'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ReceiptIcon from '@mui/icons-material/Receipt'
import BarChartIcon from '@mui/icons-material/BarChart'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useDispatch } from 'react-redux'
import { setLogout } from '../../action/loginAction'
import { ThemeContext } from '../../App'
import { asyncGetBills } from '../../action/billsAction'
import { asyncGetCustomers } from '../../action/customerAction'
import { asyncGetProducts } from '../../action/productAction'
import { asyncGetUser } from '../../action/userAction'
import Swal from 'sweetalert2'

const COLLAPSED_WIDTH = 65
const EXPANDED_WIDTH = 240

const Drawer = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()
    const { mode, toggleTheme } = useContext(ThemeContext)
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [open, setOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        dispatch(asyncGetBills())
        dispatch(asyncGetCustomers())
        dispatch(asyncGetProducts())
        dispatch(asyncGetUser())
    }, [dispatch])

    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)
    const handleMobileToggle = () => setMobileOpen(!mobileOpen)
    const handleMobileClose = () => setMobileOpen(false)

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout?',
            text: 'You will be logged out of your account',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('tishaUser')
                dispatch(setLogout())
                navigate('/login-or-register')
            }
        })
    }

    const menuItems = [
        { name: 'Dashboard', icon: <BarChartIcon />, link: '/dashboard' },
        { name: 'Customers', icon: <PeopleIcon />, link: '/customers' },
        { name: 'Products', icon: <LocalOfferIcon />, link: '/products' },
        { name: 'Bills', icon: <ReceiptIcon />, link: '/bills' },
    ]

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

    const drawerWidth = open ? EXPANDED_WIDTH : COLLAPSED_WIDTH

    const itemSx = (active) => ({
        borderRadius: '10px',
        mx: 1,
        mb: 0.5,
        minHeight: 44,
        px: 1.5,
        justifyContent: open ? 'initial' : 'center',
        backgroundColor: active ? `${theme.palette.primary.main}15` : 'transparent',
        color: active ? 'primary.main' : 'text.primary',
        '&:hover': {
            backgroundColor: active ? `${theme.palette.primary.main}25` : 'action.hover',
        },
        transition: 'all 0.15s ease',
    })

    const iconSx = (active) => ({
        minWidth: 0,
        mr: open ? 2 : 'auto',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.secondary',
        transition: 'margin 0.2s ease',
    })

    const textSx = {
        '& .MuiTypography-root': {
            fontWeight: 600,
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.15s ease',
        },
    }

    const drawerContent = (
        <Box
            display='flex'
            flexDirection='column'
            height='100vh'
            sx={{
                overflow: 'hidden',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
                    : 'linear-gradient(180deg, #ffffff 0%, #f8faf9 100%)',
                borderRight: `1px solid ${theme.palette.divider}`,
            }}
        >
            {/* Header */}
            <Box
                display='flex'
                alignItems='center'
                justifyContent={open ? 'space-between' : 'center'}
                sx={{ px: 1.5, minHeight: 64, flexShrink: 0 }}
            >
                {open && (
                    <Typography
                        variant='h6'
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            fontSize: '1.1rem',
                            letterSpacing: '0.5px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Tisha Plastic
                    </Typography>
                )}
                {!isMobile && (
                    <IconButton
                        onClick={open ? handleDrawerClose : handleDrawerOpen}
                        size='small'
                        sx={{
                            borderRadius: '10px',
                            color: 'text.secondary',
                            '&:hover': { backgroundColor: 'action.hover' },
                        }}
                    >
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                )}
            </Box>

            <Divider sx={{ mx: 1.5, opacity: 0.5 }} />

            {/* Navigation */}
            <Box flex={1} sx={{ overflow: 'auto', py: 1.5 }}>
                <List disablePadding>
                    {/* Theme Toggle */}
                    <Tooltip title={open ? '' : (mode === 'dark' ? 'Light Mode' : 'Dark Mode')} placement='right' arrow>
                        <ListItemButton
                            onClick={toggleTheme}
                            sx={{
                                borderRadius: '10px',
                                mx: 1,
                                mb: 0.5,
                                minHeight: 44,
                                px: 1.5,
                                justifyContent: open ? 'initial' : 'center',
                                '&:hover': { backgroundColor: 'action.hover' },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center', color: 'text.secondary' }}>
                                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </ListItemIcon>
                            {open && (
                                <ListItemText
                                    primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                    sx={textSx}
                                />
                            )}
                        </ListItemButton>
                    </Tooltip>

                    {/* Profile */}
                    <Tooltip title={open ? '' : 'Profile'} placement='right' arrow>
                        <Link to='/user' style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} onClick={isMobile ? handleMobileClose : undefined}>
                            <ListItemButton sx={itemSx(isActive('/user'))}>
                                <ListItemIcon sx={iconSx(isActive('/user'))}>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                {open && <ListItemText primary="Profile" sx={textSx} />}
                            </ListItemButton>
                        </Link>
                    </Tooltip>

                    <Divider sx={{ mx: 1.5, my: 1, opacity: 0.5 }} />

                    {/* Menu Items */}
                    {menuItems.map((menu) => {
                        const active = isActive(menu.link)
                        return (
                            <Tooltip key={menu.link} title={open ? '' : menu.name} placement='right' arrow>
                                <Link
                                    to={menu.link}
                                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                                    onClick={isMobile ? handleMobileClose : undefined}
                                >
                                    <ListItemButton
                                        onClick={!isMobile && open ? handleDrawerClose : undefined}
                                        sx={itemSx(active)}
                                    >
                                        <ListItemIcon sx={iconSx(active)}>
                                            {menu.icon}
                                        </ListItemIcon>
                                        {open && <ListItemText primary={menu.name} sx={textSx} />}
                                    </ListItemButton>
                                </Link>
                            </Tooltip>
                        )
                    })}
                </List>
            </Box>

            {/* Logout */}
            <Box sx={{ flexShrink: 0, pb: 1.5 }}>
                <Divider sx={{ mx: 1.5, mb: 1, opacity: 0.5 }} />
                <Tooltip title={open ? '' : 'Logout'} placement='right' arrow>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: '10px',
                            mx: 1,
                            minHeight: 44,
                            px: 1.5,
                            justifyContent: open ? 'initial' : 'center',
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'error.lighter',
                                color: 'error.main',
                                '& .MuiListItemIcon-root': { color: 'error.main' },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary="Logout" sx={textSx} />}
                    </ListItemButton>
                </Tooltip>
            </Box>
        </Box>
    )

    if (isMobile) {
        return (
            <>
                <IconButton
                    onClick={handleMobileToggle}
                    sx={{
                        position: 'fixed',
                        top: 12,
                        left: 12,
                        zIndex: 1200,
                        backgroundColor: 'background.paper',
                        boxShadow: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '12px',
                        '&:hover': { backgroundColor: 'action.hover' },
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <MUIDrawer
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleMobileClose}
                    ModalProps={{ keepMounted: true }}
                    PaperProps={{
                        sx: {
                            width: EXPANDED_WIDTH,
                            boxShadow: 8,
                        },
                    }}
                >
                    {drawerContent}
                </MUIDrawer>
            </>
        )
    }

    return (
        <MUIDrawer
            variant='permanent'
            PaperProps={{
                sx: {
                    width: drawerWidth,
                    overflow: 'hidden',
                    transition: 'width 0.2s ease',
                    boxShadow: 1,
                },
            }}
        >
            {drawerContent}
        </MUIDrawer>
    )
}

export default Drawer
