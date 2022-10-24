const sendResponse = ({ status = true, res = null, message = null, data = null, statusCode = 201, error = null }) => {
    return res.status(statusCode).json(
        {
            status,
            message,
            data,
            error
        }
    )
}

export default sendResponse