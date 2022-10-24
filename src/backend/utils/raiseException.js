const raiseException = (message) => {
    if (message.toString().includes("E11000 duplicate key error collection")) {
        return "Field Already Exist"
    }
    return message
}

export default raiseException