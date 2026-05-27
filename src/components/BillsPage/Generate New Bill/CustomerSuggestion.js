import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { TextField, Typography, Box, Autocomplete } from '@mui/material'

const CustomerSuggestion = (props) => {
    const { handleCustomerInfo } = props
    const customers = useSelector(state => state.customers)
    const [ value, setValue ] = useState(null)
    const [ inputValue, setInputValue ] = useState('')

    const handleValueChange = (e, newValue) => {
        setValue(newValue)
        handleCustomerInfo(newValue)
    }

    const handleInputChange = (e, newInputValue) => {
        setInputValue(newInputValue)
    }

    return (
        <>
            <Autocomplete 
                value={value}
                onChange={handleValueChange}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                options={customers}
                getOptionLabel={option => option && option.mobile ? `${option.mobile} - ${option.name}` : ''}
                renderInput={(params) => <TextField {...params} margin='dense' label='search customer' variant='outlined' />}
            />

            {
                (value && value._id) ? (
                    <Box sx={{ height: '150px' }} display='flex' flexDirection='column' justifyContent='center'>
                        <Typography variant='body1'><strong>Name: </strong>{value.name}</Typography>
                        <Typography variant='body1'><strong>Email: </strong>{value.email}</Typography>
                        <Typography variant='body1'><strong>Mobile: </strong>{value.mobile}</Typography>
                    </Box>
                ) : (
                    <Box sx={{ height: '150px' }} display='flex' flexDirection='column' justifyContent='center'>
                        <Typography sx={{ wordBreak: 'break-word', color: 'text.secondary' }} variant='body1'>Enter mobile number of customer to display details</Typography>
                    </Box>
                )
            }

        </>
    )
}

export default CustomerSuggestion
