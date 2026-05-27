import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { setLogin } from '../../action/loginAction'
import { CircularProgress, Box } from '@mui/material'
import Drawer from './Drawer'
import AppBar from './AppBar'
import PrivateRoute from './PrivateRoute'
import ErrorBoundary from './ErrorBoundary'

const HomePage = lazy(() => import('../HomePage/HomePage'))
const LoginRegisterPage = lazy(() => import('../HomePage/LoginRegisterPage'))
const UserPage = lazy(() => import('../UserPage/UserPage'))
const CustomerPage = lazy(() => import('../CustomerPage/CustomerPage'))
const ProductPage = lazy(() => import('../ProductPage/ProductPage'))
const BillsPage = lazy(() => import('../BillsPage/BillsPage'))
const AddBill = lazy(() => import('../BillsPage/Generate New Bill/AddBill'))
const ViewCustomer = lazy(() => import('../CustomerPage/View Customer/ViewCustomer'))
const BillView = lazy(() => import('../BillsPage/View Bill/BillView'))
const Dashboard = lazy(() => import('../Dashboard/Dashboard'))

const LoadingFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
    </Box>
)

const NavBar = (props) => {
    const isLoggedIn = useSelector(state => state.login)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (localStorage.getItem('tishaUser') && 
            (location.pathname === '/' || location.pathname === '/login-or-register')) {
            dispatch(setLogin())
            navigate('/dashboard')
        } else if (localStorage.getItem('tishaUser')) {
            dispatch(setLogin())
        }
    }, [dispatch, navigate, location.pathname])

    return(
        <ErrorBoundary>
            {
                isLoggedIn ? (
                    <Box display='flex' minHeight='100vh'>
                        <Box component='nav' sx={{ flexShrink: 0 }}>
                            <Drawer />
                        </Box>
                        <Box component='main' sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Suspense fallback={<LoadingFallback />}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login-or-register" element={<LoginRegisterPage />} />
                                <Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
                                <Route path="/customers" element={<PrivateRoute><CustomerPage /></PrivateRoute>} />
                                <Route path="/products" element={<PrivateRoute><ProductPage /></PrivateRoute>} />
                                <Route path="/bills" element={<PrivateRoute><BillsPage /></PrivateRoute>} />
                                <Route path="/addBill" element={<PrivateRoute><AddBill /></PrivateRoute>} />
                                <Route path="/customers/:id" element={<PrivateRoute><ViewCustomer /></PrivateRoute>} />
                                <Route path="/bills/:id" element={<PrivateRoute><BillView /></PrivateRoute>} />
                                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                            </Routes>
                            </Suspense>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <AppBar />
                        <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login-or-register" element={<LoginRegisterPage />} />
                            <Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
                            <Route path="/customers" element={<PrivateRoute><CustomerPage /></PrivateRoute>} />
                            <Route path="/products" element={<PrivateRoute><ProductPage /></PrivateRoute>} />
                            <Route path="/bills" element={<PrivateRoute><BillsPage /></PrivateRoute>} />
                            <Route path="/addBill" element={<PrivateRoute><AddBill /></PrivateRoute>} />
                            <Route path="/customers/:id" element={<PrivateRoute><ViewCustomer /></PrivateRoute>} />
                            <Route path="/bills/:id" element={<PrivateRoute><BillView /></PrivateRoute>} />
                            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        </Routes>
                        </Suspense>
                    </>
                )
            }
        </ErrorBoundary>
    )
}

export default NavBar
