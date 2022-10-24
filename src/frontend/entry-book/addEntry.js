import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone'
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'
import * as yup from 'yup'
import axios from 'axios'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from "react"
import { TextField, Grid, Typography, Box, Button, InputAdornment, Select, FormControl, MenuItem, Autocomplete } from '@mui/material'
import { calculateExpression } from '../../utils/avail'
import { toast } from "react-toastify"

const defaultPurchasesValues = {
    quantity: "",
    details: "",
    vendor: null,
    price: "",
    total: "",
    mode: 'CREDIT',
    created_at: new Date(),
    updated_at: new Date()
}

const defaultSalesValue = [{
    quantity: "",
    details: "",
    customer: null,
    price: "",
    total: "",
    mode: 'CREDIT',
    created_at: new Date(),
    updated_at: new Date()
}]

const AddEntry = ({ createRecord, updateRecord, dispatch, edit, setEdit, expanded, setExpanded, setDate, actions, user }) => {

    const salesSchema = {
        quantity: yup.number().required(),
        details: yup.string().required(),
        customer: yup.string().required(),
        price: yup.number().required(),
        total: yup.number().required()
    }

    const purchaseSchema = {
        quantity: yup.number().required(),
        details: yup.string().required(),
        vendor: yup.string().required(),
        price: yup.number().required(),
        total: yup.number().required(),
        sales: yup.array().of(yup.object().shape(salesSchema))
    }

    const validateSchema = yup.object().shape(purchaseSchema)

    const [vendors, setVendors] = useState([])

    const [customers, setCustomers] = useState([])

    const [pending, setPending] = useState(false)

    const [blank, setBlank] = useState(false)

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            ...defaultPurchasesValues, "sales": defaultSalesValue
        },
        resolver: yupResolver(validateSchema)
    })


    const { fields, append, remove } = useFieldArray({
        control,
        name: "sales"
    })

    const onSubmit = async (data, e) => {
        e?.preventDefault?.()
        if ((data?.sales?.reduce((prev, curr) => prev + curr.quantity, 0)) !== (data?.quantity)) {
            toast.error("Item Count Doesn't Match !")
            return
        }
        setPending(true)
        try {
            const params = {
                ...data,
                vendor: `${data.vendor}-${user._id}`,
                sales: data.sales.map(sale => {
                    return {
                        ...sale, customer: `${sale.customer}-${user._id}`
                    }
                })
            }
            if (data?._id) {
                const resp = await updateRecord(params, data.created_at)
                if (resp?.data?.status) {
                    dispatch(actions.updateMessage("Entry Updated Successfully"))
                    setExpanded(false)
                    setEdit(null)
                }
            } else {
                const resp = await createRecord(params, data.created_at)
                if (resp?.data?.status) {
                    dispatch(actions.updateMessage("Entry Created Successfully"))
                    setBlank(!blank)
                }
            }
            setDate(new Date(data.created_at))
            setPending(false)
        } catch (e) { console.log(e) }
    }

    useEffect(() => {
        if (edit) {
            reset({ ...edit, vendor: edit?.vendor.split('-')[0], sales: edit?.sales?.map(sale => ({ ...sale, customer: sale?.customer.split('-')[0] })) })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit])

    useEffect(() => {
        (!expanded && edit) ? setExpanded(true) : reset({ ...defaultPurchasesValues, sales: defaultSalesValue })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit, expanded])

    useEffect(() => {
        if (blank) {
            reset({ ...defaultPurchasesValues, sales: defaultSalesValue })
            setBlank(!blank)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blank])

    useEffect(() => {
        const fetchData = async () => {
            const [vendors, customers] = await axios.all([
                axios.post('/api/vendor/list', { conditions: { status: true }, fields: ['_id', 'name'] }),
                axios.post('/api/customer/list', { conditions: { status: true }, fields: ['_id', 'name'] })
            ])
            setVendors(vendors?.data?.data?.map(user => user.name))
            setCustomers(customers?.data?.data?.map(user => user.name))
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate={false}>
            <Box display="flex" gap={3} alignItems="center" mb={2}>
                <Typography variant="p" gutterBottom component="div" marginLeft={1} sx={{ fontWeight: 'normal' }}>
                    Purchases
                </Typography>

            </Box>
            <Grid container spacing={1} marginBottom={2}>
                <Grid item xs={12} md={1.8}>
                    <Controller
                        render={({ field: { value } }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <MobileDatePicker
                                    inputFormat="dd/MM/yyyy"
                                    value={new Date(value)}
                                    disableFuture={true}
                                    closeOnSelect
                                    onChange={date => setValue('created_at', date)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <InsertInvitationIcon fontSize='small' />
                                            </InputAdornment>
                                        )
                                    }}
                                    renderInput={params => (
                                        <TextField
                                            sx={{ width: { xs: '130px' } }}
                                            className='my-date-picker'
                                            size='small'
                                            {...params}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        )}
                        name="created_at"
                        control={control}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <Controller
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <Select
                                    className='my-text-input'
                                    size="small"
                                    placeholder='Mode'
                                    {...field}
                                >
                                    <MenuItem value={'CREDIT'}>Credit</MenuItem>
                                    <MenuItem value={'CASH'}>Cash</MenuItem>
                                    <MenuItem value={'BANK'}>Bank</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        name="mode"
                        control={control}
                    />
                </Grid>
                <Grid item md={8.2} />
                <Grid item xs={12} md={3}>
                    <Controller
                        render={({ field: { value } }) => (
                            <Autocomplete
                                options={vendors}
                                onChange={(e, name) => setValue('vendor', name)}
                                value={value}
                                renderInput={(params) => (
                                    <TextField
                                        fullWidth
                                        error={errors.vendor ? true : false}
                                        className='my-text-input'
                                        placeholder='From'
                                        size="small"
                                        {...params}
                                    />
                                )}
                            />
                        )}
                        name="vendor"
                        control={control}
                    />
                </Grid>
                <Grid item xs={6} md={1}>
                    <Controller
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                error={errors.quantity ? true : false}
                                fullWidth
                                placeholder='qty'
                                className='my-text-input'
                                size="small"
                                value={value}
                                onChange={e => {
                                    onChange(e)
                                    setValue("total", (getValues("quantity") * getValues("price")).toFixed(0))
                                }}
                            />
                        )}
                        name='quantity'
                        control={control}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <Controller
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                error={errors.details ? true : false}
                                fullWidth
                                size="small"
                                className='my-text-input'
                                placeholder='details'
                                value={value}
                                onChange={e => {
                                    onChange(e)
                                    getValues('sales').map((item, index) => setValue(`sales.${index}.details`, e.target.value))
                                }}
                            />
                        )}
                        name='details'
                        control={control}
                    />
                </Grid>
                <Grid item xs={6} md={1.5}>
                    <Controller
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                error={errors.price ? true : false}
                                fullWidth
                                size="small"
                                className='my-text-input'
                                placeholder='price'
                                value={value}
                                onChange={e => {
                                    onChange(e)
                                    setValue("total", (getValues("quantity") * getValues("price")).toFixed(0))
                                }}
                            />
                        )}
                        name="price"
                        control={control}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <Controller
                        render={({ field: { value, onChange } }) => (
                            <TextField
                                error={errors.total ? true : false}
                                fullWidth
                                size="small"
                                className='my-text-input'
                                placeholder='total'
                                value={value}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                sx={{
                                                    padding: 0,
                                                    height: '20px',
                                                    width: '30px',
                                                    minWidth: '0px',
                                                    border: '1px solid',
                                                    borderRadius: 0.5
                                                }}
                                                onClick={() => {
                                                    try {
                                                        return onChange(calculateExpression(value))
                                                    } catch (e) { }
                                                    return onChange(value)
                                                }}
                                            >
                                                =
                                            </Button>
                                        </InputAdornment>
                                    )
                                }}
                                onChange={onChange}
                            />
                        )}
                        name="total"
                        control={control}
                    />
                </Grid>
            </Grid>
            <Box display="flex" gap={3} alignItems="center" mb={2}>
                <Typography variant="p" gutterBottom component="div" marginLeft={1} sx={{ fontWeight: 'normal' }}>
                    Sales
                </Typography>
            </Box>
            <Box>
                {fields.map((item, index) => (
                    <Grid container spacing={1} key={item.id} marginBottom={2}>
                        <Grid item xs={0} md={0.4}></Grid>
                        <Grid item xs={12} md={1.8}>
                            <Controller
                                render={({ field: { value } }) => (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <MobileDatePicker
                                            inputFormat="dd/MM/yyyy"
                                            value={new Date(value)}
                                            disableFuture={true}
                                            closeOnSelect
                                            onChange={date => setValue(`sales.${index}.created_at`, date)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <InsertInvitationIcon fontSize='small' />
                                                    </InputAdornment>
                                                )
                                            }}
                                            renderInput={params => (
                                                <TextField
                                                    sx={{ width: { xs: '130px' } }}
                                                    className='my-date-picker'
                                                    size='small'
                                                    {...params}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                )}
                                name={`sales.${index}.created_at`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Controller
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <Select
                                            className='my-text-input'
                                            size="small"
                                            placeholder='Mode'
                                            {...field}
                                        >
                                            <MenuItem value={'CREDIT'}>Credit</MenuItem>
                                            <MenuItem value={'CASH'}>Cash</MenuItem>
                                            <MenuItem value={'BANK'}>Bank</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                                name={`sales.${index}.mode`}
                                control={control}
                            />
                        </Grid>
                        <Grid item md={7.8} />
                        <Grid item md={0.4} />
                        <Grid item xs={12} md={3}>
                            <Controller
                                render={({ field: { value } }) => (
                                    <Autocomplete
                                        options={customers}
                                        onChange={(e, name) => setValue(`sales.${index}.customer`, name)}
                                        value={value}
                                        renderInput={(params) => (
                                            <TextField
                                                fullWidth
                                                error={errors?.sales?.[index]?.customer ? true : false}
                                                className='my-text-input'
                                                placeholder='To'
                                                size="small"
                                                {...params}
                                            />
                                        )}
                                    />
                                )}
                                name={`sales.${index}.customer`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={6} md={1}>
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        error={errors?.sales?.[index]?.quantity ? true : false}
                                        fullWidth
                                        className='my-text-input'
                                        size="small"
                                        placeholder='qty'
                                        value={value}
                                        onChange={e => {
                                            onChange(e)
                                            setValue(`sales.${index}.total`, (getValues(`sales.${index}.quantity`) * getValues(`sales.${index}.price`)).toFixed(0))
                                        }}
                                    />
                                )}
                                name={`sales.${index}.quantity`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        error={errors?.sales?.[index]?.details ? true : false}
                                        fullWidth
                                        className='my-text-input'
                                        size="small"
                                        placeholder='details'
                                        value={value}
                                        onChange={e => {
                                            onChange(e)
                                            setValue(`details`, e.target.value)
                                        }}
                                    />
                                )}
                                name={`sales.${index}.details`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={5} md={1.5}>
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        error={errors?.sales?.[index]?.price ? true : false}
                                        fullWidth
                                        size="small"
                                        placeholder='price'
                                        className='my-text-input'
                                        value={value}
                                        onChange={e => {
                                            onChange(e)
                                            setValue(`sales.${index}.total`, (getValues(`sales.${index}.quantity`) * getValues(`sales.${index}.price`)).toFixed(0))
                                        }}
                                    />
                                )}
                                name={`sales.${index}.price`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={5} md={2}>
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        error={errors?.sales?.[index]?.total ? true : false}
                                        fullWidth
                                        size="small"
                                        className='my-text-input'
                                        placeholder='total'
                                        value={value}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Button
                                                        sx={{
                                                            padding: 0,
                                                            height: '20px',
                                                            width: '30px',
                                                            minWidth: '0px',
                                                            border: '1px solid',
                                                            borderRadius: 0.5
                                                        }}
                                                        onClick={() => {
                                                            try {
                                                                return onChange(calculateExpression(value))
                                                            } catch (e) { }
                                                            return onChange(value)
                                                        }}
                                                    >
                                                        =
                                                    </Button>
                                                </InputAdornment>
                                            )
                                        }}
                                        onChange={onChange}
                                    />
                                )}
                                name={`sales.${index}.total`}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={2} md={1}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <DeleteForeverTwoToneIcon
                                onClick={() => getValues('sales').length > 1 ? remove(index) : null}
                                htmlColor="red"
                                cursor="pointer"
                            />
                        </Grid>
                    </Grid>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingRight: { md: 3 } }}>
                <Button
                    variant="contained"
                    size="small"
                    type='submit'
                    disabled={pending || new Date() > new Date(user?.active_package?.expires_on)}
                    color="primary"
                >
                    {edit ? !pending ? "Update Entry" : "Updating" : !pending ? "Post Entry" : "Posting"}
                </Button>
                <Box>
                    <Button
                        variant="contained"
                        size='small'
                        color="primary"
                        sx={{ marginRight: 1 }}
                        onClick={() => {
                            reset({ ...defaultPurchasesValues, sales: defaultSalesValue })
                            setEdit(null)
                        }}>
                        Clear
                    </Button>
                    <Button
                        variant="contained"
                        size='small'
                        color="primary"
                        onClick={() => append({
                            quantity: "",
                            details: getValues("details"),
                            customer: null,
                            price: "",
                            total: "",
                            mode: 'CREDIT',
                            created_at: new Date(),
                            updated_at: new Date()
                        })}>
                        more +
                    </Button>
                </Box>
            </Box>
        </form>
    )
}

export default AddEntry