import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import { setStartDate, setEndDate } from '../actions/dateRange'
import 'react-datepicker/src/stylesheets/datepicker.scss'
import Moment from 'moment'

const DateRange = ({
   startDate,
   endDate,
   handleChangeStart,
   handleChangeEnd
}) => (
    <div>
        <DatePicker
            selected={startDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            onChange={handleChangeStart}
        />
        <DatePicker
            selected={endDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            onChange={handleChangeEnd}
            minDate={startDate}
        />
    </div>
)

const mapStateToProps = (state) => ({
    startDate: (state.dateRange.startDate instanceof Moment) ? state.dateRange.startDate.toDate() : state.dateRange.startDate,
    endDate: (state.dateRange.endDate instanceof Moment) ? state.dateRange.endDate.toDate() : state.dateRange.endDate,
})

const mapDispatchToProps = (dispatch) => ({
    handleChangeStart: date =>  dispatch(setStartDate(date)),
    handleChangeEnd: date => dispatch(setEndDate(date)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DateRange)
