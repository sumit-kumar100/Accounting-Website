import connectDB from '../../../backend/database'
import Models from '../../../backend/models'
import utils from '../../../backend/utils'
import Query from '../../../backend/utils/query'
import withProtect from '../../../backend/middlewares/withProtect'
import { startOfDay } from 'date-fns'

const handler = async (req, res) => {
    try {
        let model = Models[req?.query?.model?.toUpperCase()]

        if (!model) {
            return utils.sendResponse(
                {
                    res,
                    status: false,
                    statusCode: 500,
                    error: utils.message.INVALID_MODEL
                }
            )
        }
        const fields = req.body.fields ? req.body.fields : {}

        const conditions = req.body.conditions ? req.body.conditions : {}

        if (req?.body?.aggregate) {

            const fetchQuery = Query[req?.body?.query]

            const query = fetchQuery ? fetchQuery(req?.body?.startDate, req?.body?.endDate, req?.body?.name) : req?.body?.conditions

            const data = await model.aggregate(
                !req?.body?.matchWithId ? [
                    {
                        $match: {
                            auth: req?.user?._id
                        }
                    },
                    ...query
                ] : [
                    {
                        $match: {
                            _id: req?.user?._id
                        }
                    },
                    ...query
                ]
            )

            return utils.sendResponse(
                {
                    res,
                    data,
                    message: null
                }
            )
        }

        const data = req.body.findOne ? (
            await model.findOne(
                {
                    auth: req?.user?._id,
                    ...conditions
                },
                fields
            )
        ) : await model.find(
            {
                auth: req?.user?._id,
                ...conditions
            },
            fields
        )

        return utils.sendResponse(
            {
                res,
                data,
                message: null
            }
        )
    }
    catch (error) {
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