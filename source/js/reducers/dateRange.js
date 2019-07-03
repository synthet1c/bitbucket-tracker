import moment from 'moment'
import {
    SET_START_DATE,
    SET_END_DATE,
} from '../actions/dateRange'

const defaultState = {
    startDate: moment().subtract(1, 'w').toDate(),
    endDate: moment().toDate(),
}

export const dateRangeReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_START_DATE: {
            return {
                ...state,
                startDate: moment(action.data).toDate()
            }
        }
        case SET_END_DATE: {
            return {
                ...state,
                endDate: moment(action.data).toDate()
            }
        }
        default:
            return state
    }
}

export default dateRangeReducer