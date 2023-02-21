import React from 'react'
import moment from 'moment'
import 'moment/locale/ru'

export default dateToRuString = (date, format) => {
    moment.locale('ru')
    const localDateString = moment(date).format(format)
    return localDateString
}
