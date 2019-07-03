export const SET_START_DATE = 'SET_START_DATE'
export const setStartDate = (startDate) => ({
    type: SET_START_DATE,
    data: startDate,
})

export const SET_END_DATE = 'SET_END_DATE'
export const setEndDate = (endDate) => ({
    type: SET_END_DATE,
    data: endDate,
})
