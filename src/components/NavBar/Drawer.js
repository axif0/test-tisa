import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router'
import { Box, Drawer as MUIDrawer, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, IconButton, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
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
import { useDispatch } from 'react-redux'
import { setLogout } from '../../action/loginAction'
import { ThemeContext } from '../../App'
import { asyncGetBills } from '../../action/billsAction'
import { asyncGetCustomers } from '../../action/customerAction'
import { asyncGetProducts } from '../../action/productAction'
import { asyncGetUser } from '../../action/userAction'
import Swal from 'sweetalert2'

const useStyle = makeStyles({
    menuItem: {
        paddingLeft: 0, 
        paddingRight: 0
    },
    menuIcon: {
        margin:0, 
        justifyContent: 'center'
    },
    menuText: {
        paddingRight: 25, 
        fontWeight: 600
    },
    menuLink: {
        textDecoration: 'none'
    },
    menuLogout:{
        position: 'absolute',
        bottom: '20px',
        width: '100%'
    }
})

const Drawer = (props) => {
    const classes = useStyle()
    const dispatch = useDispatch()
    const theme = useTheme()
    const { mode, toggleTheme } = useContext(ThemeContext)
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [ open, setOpen ] = useState(false)
    const [ mobileOpen, setMobileOpen ] = useState(false)

    useEffect(() => {
        dispatch(asyncGetBills())
        dispatch(asyncGetCustomers())
        dispatch(asyncGetProducts())
        dispatch(asyncGetUser())
    }, [dispatch])

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const handleMobileToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleMobileClose = () => {
        setMobileOpen(false)
    }

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
            }
        })
    }

    const menuItems = [
        {
            name: 'Dashboard',
            icon: <BarChartIcon fontSize='large' />,
            link: '/dashboard'
        },
        {
            name: 'Customers',
            icon: <PeopleIcon fontSize='large' />,
            link: '/customers'
        },
        {
            name:'Products',
            icon: <LocalOfferIcon fontSize='large' />,
            link: '/products'
        },
        {
            name: 'Bills',
            icon: <ReceiptIcon fontSize='large' />,
            link: '/bills'
        }
    ]

    const drawerContent = (
        <List>
            <Box display='flex' flexDirection='column' justifyContent='space-between' minHeight='90vh'>
                <Box>
                    <ListItemButton className={classes.menuItem} onClick={isMobile ? handleMobileClose : (open ? handleDrawerClose : handleDrawerOpen)}>
                        <ListItemIcon className={classes.menuIcon}>
                            <MenuIcon fontSize='large'/>
                        </ListItemIcon>
                        {
                            (open || isMobile) && <ListItemText> <span className={classes.menuText}>Menu</span> </ListItemText>
                        }
                    </ListItemButton>
                    <ListItemButton className={classes.menuItem} onClick={toggleTheme}>
                        <ListItemIcon className={classes.menuIcon}>
                            <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </Tooltip>
                        </ListItemIcon>
                        {
                            (open || isMobile) && <ListItemText> <span className={classes.menuText}>{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span> </ListItemText>
                        }
                    </ListItemButton>
                    <Link to='/user' className={classes.menuLink} onClick={isMobile ? handleMobileClose : undefined}>
                        <ListItemButton className={classes.menuItem} sx={{ color: 'text.primary' }}>
                            <ListItemIcon className={classes.menuIcon}>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            {
                                (open || isMobile) && <ListItemText> <span className={classes.menuText}>Profile</span> </ListItemText>
                            }
                        </ListItemButton>
                    </Link>
                    {
                        menuItems.map((menu, i) => {
                            const { name, icon, link } = menu
                            return (
                                <Link key={i} to={link} className={classes.menuLink} onClick={isMobile ? handleMobileClose : undefined}>
                                    <ListItemButton onClick={!isMobile && open ? handleDrawerClose : null} className={classes.menuItem} sx={{ color: 'text.primary' }}>
                                        <ListItemIcon className={classes.menuIcon}>
                                            {icon}
                                        </ListItemIcon>
                                        {
                                            (open || isMobile) && <ListItemText> <span className={classes.menuText}>{name}</span> </ListItemText>
                                        }
                                    </ListItemButton>
                                </Link>
                            )
                        })
                    }
                </Box>
                <Link to={'/login-or-register'} className={classes.menuLink}>
                    <ListItemButton className={`${classes.menuItem} ${classes.menuLogout}`} onClick={handleLogout}>
                        <ListItemIcon className={classes.menuIcon}>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        {
                            (open || isMobile) && <ListItemText> <span className={classes.menuText}>Logout</span> </ListItemText>
                        }
                    </ListItemButton>
                </Link>
            </Box>
        </List>
    )

    if (isMobile) {
        return (
            <>
                <IconButton
                    onClick={handleMobileToggle}
                    sx={{ position: 'fixed', top: 10, left: 10, zIndex: 1200 }}
                >
                    <MenuIcon />
                </IconButton>
                <MUIDrawer
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleMobileClose}
                    ModalProps={{ keepMounted: true }}
                >
                    {drawerContent}
                </MUIDrawer>
            </>
        )
    }

    return (
        <MUIDrawer 
            variant='permanent'
        >
            {drawerContent}
        </MUIDrawer>
    )
}

export default Drawer
