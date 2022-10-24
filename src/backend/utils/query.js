import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'

const query = {
    // ENTRY BOOK
    fetchEntry: (startDate = new Date(), endDate = new Date(), name = null) => {
        return [
            {
                $match: {
                    created_at: {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            }
        ]
    },

    // PURCHASE BOOK
    fetchPurchase: (startDate = new Date(), endDate = new Date(), name = null) => {
        return name ? [
            {
                $match: {
                    'vendor': name,
                    'mode': 'CREDIT',
                    'created_at': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            {
                $project: {
                    '_id': 1,
                    'quantity': 1,
                    'details': 1,
                    'vendor': 1,
                    'price': 1,
                    'total': 1,
                    'charges': 1,
                    'created_at': 1
                }
            },
            {
                $group: {
                    _id: {
                        'date': {
                            $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
                        },
                        'name': '$vendor'
                    },
                    data: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $group: {
                    _id: '$_id.date',
                    names: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ] : [
            {
                $match: {
                    'mode': 'CREDIT',
                    'created_at': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            {
                $project: {
                    '_id': 1,
                    'quantity': 1,
                    'details': 1,
                    'vendor': 1,
                    'price': 1,
                    'total': 1,
                    'charges': 1,
                    'created_at': 1
                }
            },
            {
                $group: {
                    _id: {
                        'date': {
                            $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
                        },
                        'name': '$vendor'
                    },
                    data: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $sort: {
                    'data.vendor': 1
                }
            },
            {
                $group: {
                    _id: '$_id.date',
                    names: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]
    },

    // SALE BOOK
    fetchSale: (startDate = new Date, endDate = new Date, name = null) => {
        return name ? [
            { $unwind: "$sales" },
            {
                $match: {
                    'sales.customer': name,
                    'sales.mode': 'CREDIT',
                    'sales.created_at': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            { $replaceRoot: { newRoot: "$sales" } },
            {
                $group: {
                    _id: {
                        'date': {
                            $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
                        },
                        'name': '$customer'
                    },
                    data: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $group: {
                    _id: '$_id.date',
                    names: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ] : [
            { $unwind: "$sales" },
            {
                $match: {
                    'sales.mode': 'CREDIT',
                    'sales.created_at': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            { $replaceRoot: { newRoot: "$sales" } },
            {
                $group: {
                    _id: {
                        'date': {
                            $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
                        },
                        'name': '$customer'
                    },
                    data: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $sort: {
                    'data.customer': 1
                }
            },
            {
                $group: {
                    _id: '$_id.date',
                    names: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]
    },
    // PURCHASE LEDGER

    /* GRAB FROM ENTRY BOOK */
    fetchPurchaseLedger: (startDate = new Date(), endDate = new Date(), name = null) => {
        return [
            {
                $match: {
                    'vendor': name,
                    'mode': 'CREDIT',
                    'created_at': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            {
                $project: {
                    '_id': 1,
                    'quantity': 1,
                    'details': 1,
                    'vendor': 1,
                    'price': 1,
                    'total': 1,
                    'charges': 1,
                    'created_at': 1
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
                    },
                    data: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]
    },
    /* GRAB FROM VENDOR BOOK */
    fetchPurchaseVendorLedger: (startDate = new Date(), endDate = new Date(), name = null) => {
        return [
            {
                $match: {
                    "name": name
                }
            },
            {
                $project: {
                    _id: 1,
                    credit: 1,
                    name: 1,
                    debit: {
                        $filter: {
                            input: "$debit",
                            as: "debits",
                            cond: {
                                $and: [
                                    { $gte: ["$$debits.date", startOfDay(new Date(startDate))] },
                                    { $lte: ["$$debits.date", endOfDay(new Date(endDate))] }
                                ]
                            }
                        },
                        // $sortArray: { input: "$debit", sortBy: { date: -1 } }
                    }
                }
            }
        ]
    },
    /* PAYMENT INFO FOR PURCHASE LEDGER */
    fetchPurchaseLedgerPayments: (startDate = new Date(), endDate = new Date(), name = null) => {
        return [
            { $match: { name: name } },
            { $project: { 'debit': 1 } },
            { $unwind: "$debit" },
            {
                $match: {
                    'debit.date': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            { $sort: { 'debit.date': -1 } }
        ]
    },

    // SALE LEDGER
    /* GRAB FROM ENTRY BOOK */
    fetchSaleLedger: (startDate = new Date(), endDate = new Date(), name = null) => {
        return [
            { $unwind: "$sales" },
            {
                $match: {
                    'sales.customer': name,
                    'sales.mode': 'CREDIT',
                    'sales.created_at': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            { $replaceRoot: { newRoot: "$sales" } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
                    },
                    data: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]
    },
    /* GRAB FROM CUSTOMER BOOK */
    fetchSaleCustomerLedger: (startDate = new Date(), endDate = new Date(), name = null) => {
        return [
            {
                $match: {
                    "name": name
                }
            },
            {
                $project: {
                    _id: 1,
                    debit: 1,
                    name: 1,
                    type: 1,
                    credit: {
                        $filter: {
                            input: "$credit",
                            as: "credits",
                            cond: {
                                $and: [
                                    {
                                        $gte: ["$$credits.date", startOfDay(new Date(startDate))]
                                    },
                                    {
                                        $lte: ["$$credits.date", endOfDay(new Date(endDate))]
                                    }
                                ]
                            }
                        },
                        // $sortArray: { input: "$debit", sortBy: { date: -1 } }
                    }
                }
            }
        ]
    },
    /* RECEIPT INFO FOR SALE LEDGER */
    fetchSaleLedgerReceipts: (startDate = new Date(), endDate = new Date(), name = null) => {
        return [
            { $match: { name: name } },
            { $project: { 'credit': 1 } },
            { $unwind: "$credit" },
            {
                $match: {
                    'credit.date': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            { $sort: { 'credit.date': -1 } }
        ]
    },

    // CASH BOOK
    fetchCashReceive: (startDate = new Date(), endDate = new Date()) => {
        return [
            { $project: { 'credit': 1, 'name': 1 } },
            { $unwind: "$credit" },
            {
                $match: {
                    'credit.date': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            { $sort: { 'credit.date': -1 } }
        ]
    },
    fetchCashPaid: (startDate = new Date(), endDate = new Date()) => {
        return [
            { $project: { 'debit': 1, 'name': 1 } },
            { $unwind: "$debit" },
            {
                $match: {
                    'debit.date': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            { $sort: { 'debit.date': -1 } }
        ]
    },
    fetchCashSale: (startDate = new Date(), endDate = new Date()) => {
        return [
            { $project: { 'sales': 1 } },
            { $unwind: "$sales" },
            {
                $match: {
                    'sales.mode': { $ne: 'CREDIT' },
                    'sales.created_at': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            { $sort: { 'sales.created_at': -1 } }
        ]
    },
    fetchCashPurchase: (startDate = new Date(), endDate = new Date()) => {
        return [
            {
                $match: {
                    'mode': { $ne: 'CREDIT' },
                    'created_at': {
                        $gte: startOfDay(new Date(startDate)),
                        $lte: endOfDay(new Date(endDate))
                    }
                }
            },
            {
                $project: {
                    '_id': 1,
                    'quantity': 1,
                    'details': 1,
                    'vendor': 1,
                    'price': 1,
                    'total': 1,
                    'mode': 1,
                    'charges': 1,
                    'created_at': 1

                }
            },
            { $sort: { created_at: -1 } }
        ]
    },
    fetchCashByUser: (startDate = new Date(), endDate = new Date()) => {
        return [
            {
                $project: {
                    _id: 1,
                    credits: {
                        $filter: {
                            input: "$credits",
                            as: "creditsData",
                            cond: {
                                $and: [
                                    {
                                        $gte: ["$$creditsData.date", startOfDay(new Date(startDate))]
                                    },
                                    {
                                        $lte: ["$$creditsData.date", endOfDay(new Date(endDate))]
                                    }
                                ]
                            }
                        },
                        // $sortArray: { input: "$credits", sortBy: { date: -1 } }
                    },
                    debits: {
                        $filter: {
                            input: "$debits",
                            as: "debitsData",
                            cond: {
                                $and: [
                                    {
                                        $gte: ["$$debitsData.date", startOfDay(new Date(startDate))]
                                    },
                                    {
                                        $lte: ["$$debitsData.date", endOfDay(new Date(endDate))]
                                    }
                                ]
                            }
                        },
                        // $sortArray: { input: "$debits", sortBy: { date: -1 } }
                    }
                }
            }
        ]
    },
    fetchMonthlyExpenses: (startDate = new Date(), endDate = new Date()) => {
        return [
            {
                $match: {
                    'created_at': {
                        $gte: startOfMonth(new Date(startDate)),
                        $lte: endOfMonth(new Date(endDate))
                    }
                }
            },
            {
                $project: {
                    '_id': 0,
                    'total': 1,
                    'charges': 1,
                    'created_at': 1
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
                    },
                    data: {
                        $push: '$$ROOT'
                    }
                }
            }
        ]
    },
    fetchMonthlyIncome: (startDate = new Date(), endDate = new Date()) => {
        return [
            { $unwind: "$sales" },
            {
                $match: {
                    'sales.customer': {
                        $not: {
                            $regex: "Loss Account"
                        }
                    },
                    'sales.created_at': {
                        $gte: startOfMonth(new Date(startDate)),
                        $lte: endOfMonth(new Date(endDate))
                    }
                }
            },
            { $replaceRoot: { newRoot: "$sales" } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
                    },
                    data: {
                        $push: '$$ROOT'
                    }
                }
            }
        ]
    },
    fetchYearlyExpenses: (startDate = new Date(), endDate = new Date()) => {
        return [
            {
                $match: {
                    'created_at': {
                        $gte: startOfYear(new Date(startDate)),
                        $lte: endOfYear(new Date(endDate))
                    }
                }
            },
            {
                $project: {
                    '_id': 0,
                    'total': 1,
                    'charges': 1,
                    'created_at': 1
                }
            }
        ]
    },
    fetchYearlyIncome: (startDate = new Date(), endDate = new Date()) => {
        return [
            { $unwind: "$sales" },
            {
                $match: {
                    'sales.customer': {
                        $not: {
                            $regex: "Loss Account"
                        }
                    },
                    'sales.created_at': {
                        $gte: startOfYear(new Date(startDate)),
                        $lte: endOfYear(new Date(endDate))
                    }
                }
            },
            { $replaceRoot: { newRoot: "$sales" } },
            {
                $project: {
                    '_id': 0,
                    'total': 1,
                    'charges': 1,
                    'created_at': 1
                }
            }
        ]
    }
}

export default query