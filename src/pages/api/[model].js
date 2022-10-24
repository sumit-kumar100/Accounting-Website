import connectDB from '../../backend/database'
import Models from '../../backend/models'
import utils from '../../backend/utils'
import withProtect from '../../backend/middlewares/withProtect'

const handler = async (req, res) => {
    try {
        let model = Models[req?.query?.model?.toUpperCase()]

        if (!model || req?.query?.model === 'user') {
            return utils.sendResponse(
                {
                    res,
                    status: false,
                    statusCode: 500,
                    error: !model ? utils.message.INVALID_MODEL : utils.message.UN_AUTHORISED_ROUTE
                }
            )
        }

        switch (req?.method) {
            case 'POST':
                await model.create(
                    {
                        ...req.body,
                        auth: req?.user?._id
                    }
                )
                return utils.sendResponse(
                    {
                        res,
                        data: null,
                        message: utils.message.CREATED
                    }
                )
            case 'PUT':
                if (!req?.query?.model === 'vendor' && !req?.query?.model === 'customer') {
                    req.body.conditions ? (
                        await model.updateOne(
                            {
                                auth: req?.user?._id,
                                ...req.body.conditions.query
                            },
                            req.body.conditions.update)
                    ) : await model.findByIdAndUpdate(req.body._id, { ...req.body })

                    return utils.sendResponse(
                        {
                            res,
                            data: null,
                            message: utils.message.UPDATED
                        }
                    )
                }
                const entry = Models['ENTRY']

                if (req?.query?.model === 'vendor' && req?.body?.updateName) {

                    const vendorModel = Models['VENDOR']

                    const vendor = await vendorModel.findById(req?.body?._id)

                    await entry.updateMany(
                        {
                            vendor: `${vendor.name}-${req?.user?._id}`
                        },
                        {
                            vendor: req?.body?.name
                        }
                    )
                }
                if (req?.query?.model === 'customer' && req?.body?.updateName) {

                    const customerModel = Models['CUSTOMER']

                    const customer = await customerModel.findById(req?.body?._id)

                    await entry.updateMany(
                        {
                            'sales.customer': `${customer.name}-${req?.user?._id}`
                        },
                        {
                            'sales.$.customer': req?.body?.name
                        }
                    )
                }
                req.body.conditions ? (
                    await model.updateOne(
                        {
                            auth: req?.user?._id,
                            ...req.body.conditions.query
                        },
                        req.body.conditions.update)
                ) : await model.findByIdAndUpdate(req.body._id, { ...req.body })

                return utils.sendResponse(
                    {
                        res,
                        data: null,
                        message: utils.message.UPDATED
                    }
                )
            case 'DELETE':
                if (!req?.query?.model === 'vendor' && !req?.query?.model === 'customer') {
                    await model.findByIdAndDelete(req.body._id)

                    return utils.sendResponse(
                        {
                            res,
                            data: null,
                            message: utils.message.DELETED
                        }
                    )
                }
                const e = Models['ENTRY']

                if (req?.query?.model === 'vendor') {
                    const isEntryExist = await e.find(
                        {
                            vendor: req?.body?.name
                        }
                    )

                    const vendorModel = Models['VENDOR']

                    const vendor = await vendorModel.findById(req?.body?._id)

                    if (isEntryExist.length || vendor.credit || vendor.debit.length) {  // if entry exist or any previos balance added or any amount received then make status to false

                        vendor.status = false

                        vendor.save()

                        return utils.sendResponse(
                            {
                                res,
                                data: null,
                                message: utils.message.VENDOR_DEACTIVATED
                            }
                        )
                    }
                }
                if (req?.query?.model === 'customer') {
                    const isEntryExist = await e.find(
                        {
                            'sales.customer': req?.body?.name
                        }
                    )

                    const customerModel = Models['CUSTOMER']

                    const customer = await customerModel.findById(req?.body?._id)

                    if (isEntryExist.length || customer.debit || customer.credit.length) {

                        customer.status = false

                        customer.save()

                        return utils.sendResponse(
                            {
                                res,
                                data: null,
                                message: utils.message.CUSOMTER_DEACTIVATED
                            }
                        )
                    }
                }

                await model.findByIdAndDelete(req.body._id)

                return utils.sendResponse(
                    {
                        res,
                        data: null,
                        message: utils.message.DELETED
                    }
                )

            case 'PATCH':
                if (req.body.purchases) {
                    await model.updateMany(
                        {
                            'auth': req?.user?._id,
                            '_id': { $in: req.body.ids }
                        },
                        {
                            charges: parseInt(req.body.charges) / req.body.ids.length
                        }
                    )
                } else {
                    const match = await model.find({ 'sales._id': { $in: req?.body?.ids } })
                    const charge = parseInt(req.body.charges) / match.length
                    await model.updateMany(
                        {
                            'auth': req?.user?._id,
                            'sales._id': { $in: req.body.ids }
                        },
                        {
                            'sales.$.charges': charge
                        }
                    )
                }
                return utils.sendResponse(
                    {
                        res,
                        data: null,
                        message: utils.message.UPDATED
                    }
                )
            default:
                res.status(405).end()
                break
        }

    } catch (error) {
        return utils.sendResponse(
            {
                res,
                status: false,
                statusCode: 500,
                error: utils.raiseException(error.message)
            }
        )
    }
}

export default connectDB(withProtect(handler))