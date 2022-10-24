export function sentenceCase(str) {
    if ((str === null) || (str === ''))
        return false
    else
        str = str.toString()

    return str.replace(/\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() +
                txt.substr(1).toLowerCase()
        })
}

export function calculateExpression(str) {
    try {
        return eval(str).toFixed(0)
    } catch (e) {
        return str
    }
}

export function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property]
        if (!acc[key]) {
            acc[key] = 0
        }
        acc[key] = acc[key] + obj['sum']
        return acc
    }, {})
}

export const isLeap = year => new Date(year, 1, 29).getDate() === 29;

export function YearlyProfitData(incomeData, expensesData) {
    const profitData = {
        'January': (incomeData['0'] ? incomeData['0'] : 0) - (expensesData['0'] ? expensesData['0'] : 0),
        'February': (incomeData['1'] ? incomeData['1'] : 0) - (expensesData['1'] ? expensesData['1'] : 0),
        'March': (incomeData['2'] ? incomeData['2'] : 0) - (expensesData['2'] ? expensesData['2'] : 0),
        'Apirl': (incomeData['3'] ? incomeData['3'] : 0) - (expensesData['3'] ? expensesData['3'] : 0),
        'May': (incomeData['4'] ? incomeData['4'] : 0) - (expensesData['4'] ? expensesData['4'] : 0),
        'June': (incomeData['5'] ? incomeData['5'] : 0) - (expensesData['5'] ? expensesData['5'] : 0),
        'July': (incomeData['6'] ? incomeData['6'] : 0) - (expensesData['6'] ? expensesData['6'] : 0),
        'August': (incomeData['7'] ? incomeData['7'] : 0) - (expensesData['7'] ? expensesData['7'] : 0),
        'September': (incomeData['8'] ? incomeData['8'] : 0) - (expensesData['8'] ? expensesData['8'] : 0),
        'October': (incomeData['9'] ? incomeData['9'] : 0) - (expensesData['9'] ? expensesData['9'] : 0),
        'November': (incomeData['10'] ? incomeData['10'] : 0) - (expensesData['10'] ? expensesData['10'] : 0),
        'December': (incomeData['11'] ? incomeData['11'] : 0) - (expensesData['11'] ? expensesData['11'] : 0),
    }
    return profitData
}
export function MonthlyProfitData(incomeData, expensesData, date) {
    const profitData = {
        '1': (incomeData['1'] ? incomeData['1'] : 0) - (expensesData['1'] ? expensesData['1'] : 0),
        '2': (incomeData['2'] ? incomeData['2'] : 0) - (expensesData['2'] ? expensesData['2'] : 0),
        '3': (incomeData['3'] ? incomeData['3'] : 0) - (expensesData['3'] ? expensesData['3'] : 0),
        '4': (incomeData['4'] ? incomeData['4'] : 0) - (expensesData['4'] ? expensesData['4'] : 0),
        '5': (incomeData['5'] ? incomeData['5'] : 0) - (expensesData['5'] ? expensesData['5'] : 0),
        '6': (incomeData['6'] ? incomeData['6'] : 0) - (expensesData['6'] ? expensesData['6'] : 0),
        '7': (incomeData['7'] ? incomeData['7'] : 0) - (expensesData['7'] ? expensesData['7'] : 0),
        '8': (incomeData['8'] ? incomeData['8'] : 0) - (expensesData['8'] ? expensesData['8'] : 0),
        '9': (incomeData['9'] ? incomeData['9'] : 0) - (expensesData['9'] ? expensesData['9'] : 0),
        '10': (incomeData['10'] ? incomeData['10'] : 0) - (expensesData['10'] ? expensesData['10'] : 0),
        '11': (incomeData['11'] ? incomeData['11'] : 0) - (expensesData['11'] ? expensesData['11'] : 0),
        '12': (incomeData['12'] ? incomeData['12'] : 0) - (expensesData['12'] ? expensesData['12'] : 0),
        '13': (incomeData['13'] ? incomeData['13'] : 0) - (expensesData['13'] ? expensesData['13'] : 0),
        '14': (incomeData['14'] ? incomeData['14'] : 0) - (expensesData['14'] ? expensesData['14'] : 0),
        '15': (incomeData['15'] ? incomeData['15'] : 0) - (expensesData['15'] ? expensesData['15'] : 0),
        '16': (incomeData['16'] ? incomeData['16'] : 0) - (expensesData['16'] ? expensesData['16'] : 0),
        '17': (incomeData['17'] ? incomeData['17'] : 0) - (expensesData['17'] ? expensesData['17'] : 0),
        '18': (incomeData['18'] ? incomeData['18'] : 0) - (expensesData['18'] ? expensesData['18'] : 0),
        '19': (incomeData['19'] ? incomeData['19'] : 0) - (expensesData['19'] ? expensesData['19'] : 0),
        '20': (incomeData['20'] ? incomeData['20'] : 0) - (expensesData['20'] ? expensesData['20'] : 0),
        '21': (incomeData['21'] ? incomeData['21'] : 0) - (expensesData['21'] ? expensesData['21'] : 0),
        '22': (incomeData['22'] ? incomeData['22'] : 0) - (expensesData['22'] ? expensesData['22'] : 0),
        '23': (incomeData['23'] ? incomeData['23'] : 0) - (expensesData['23'] ? expensesData['23'] : 0),
        '24': (incomeData['24'] ? incomeData['24'] : 0) - (expensesData['24'] ? expensesData['24'] : 0),
        '25': (incomeData['25'] ? incomeData['25'] : 0) - (expensesData['25'] ? expensesData['25'] : 0),
        '26': (incomeData['26'] ? incomeData['26'] : 0) - (expensesData['26'] ? expensesData['26'] : 0),
        '27': (incomeData['27'] ? incomeData['27'] : 0) - (expensesData['27'] ? expensesData['27'] : 0),
        '28': (incomeData['28'] ? incomeData['28'] : 0) - (expensesData['28'] ? expensesData['28'] : 0)
    }
    if (isLeap(date.getFullYear()) && date.getMonth() === 1) {
        profitData['29'] = (incomeData['29'] ? incomeData['29'] : 0) - (expensesData['29'] ? expensesData['29'] : 0)
    }
    console.log(date.getMonth())
    if (date.getMonth() !== 1) {
        profitData['29'] = (incomeData['29'] ? incomeData['29'] : 0) - (expensesData['29'] ? expensesData['29'] : 0)
        profitData['30'] = (incomeData['30'] ? incomeData['30'] : 0) - (expensesData['30'] ? expensesData['30'] : 0)
        if ([0, 2, 4, 6, 7, 9, 11].includes(date.getMonth())) {
            profitData['31'] = (incomeData['31'] ? incomeData['31'] : 0) - (expensesData['31'] ? expensesData['31'] : 0)
        }
    }
    return profitData
}
