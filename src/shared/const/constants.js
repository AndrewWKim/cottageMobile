export const COTTAGE_SESSION_STORAGE_KEY = 'COTTAGE_SESSION'
export const BASE_URL = 'blabla'
export const AUTH_BASE_URL = 'blabla'
export const CLIENT_ID = 'cottageMobile'
export const ONESIGNAL_ID = 'blabla'

export const PAYMENT_STATUS = {
    paid: 1,
    inProcess: 2,
    unpaid: 3,
    partiallyPaid: 4
}

export const PASS_REQUEST_TYPE = {
    visitor: 1,
    car: 2,
}

export const VISIT_TIMES = [
    {
        id: 1,
        name: 'Утром',
    },
    {
        id: 2,
        name: 'Днем',
    },
    {
        id: 3,
        name: 'Вечером',
    },
]

export const PAYMENT_TYPE = {
    communalBill: 1,
    cottageBilling: 2,
    all: 3,
    newCard: 4,
}

export const PAYMENT_RESULT_STATUS = {
    success: 1,
    show3DSecure: 2,
    fail: 3,
    failedCardTime: 4,
}

export const IDEA_STATUS = {
    moderating: 1,
    published: 2,
    archived: 3,
}

export const CLIENT_TYPE = {
    owner: 1,
    resident: 2,
    mainResident: 3,
}

export const initialTimer = {
    tenMinutes: 1,
    minutes: 4,
    tenSeconds: 5,
    seconds: 9,
    timerCount: 0,
    timerStarted: false,
}

export const NEWS_TYPE = {
    Idea: 1,
    CottageNews: 2,
}
