import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MyCalendar = ({ showCalendars, onDateChange }) => {
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);

    React.useEffect(() => {
        onDateChange(
            startDate ? formatDateTime(startDate, 'start') : null,
            endDate ? formatDateTime(endDate, 'end') : null
        );
    }, [startDate, endDate, onDateChange]);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const clearStartDate = () => {
        setStartDate(null);
    };

    const clearEndDate = () => {
        setEndDate(null);
    };

    const formatDateTime = (date, type = 'start') => {
        if (!date) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        // Set start date to beginning of day (00:00:00) and end date to end of day (23:59:59)
        let hours, minutes, seconds;
        if (type === 'start') {
            hours = '00';
            minutes = '00';
            seconds = '00';
        } else {
            hours = '23';
            minutes = '59';
            seconds = '59';
        }
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="Calendar">
            {showCalendars && (
                <div className="calendars">
                    <div className="calendar-section">
                        <h3>Start Date</h3>
                        <Calendar 
                            onChange={handleStartDateChange} 
                            value={startDate} 
                        />
                        <button className="subtle card-tag" onClick={clearStartDate}>Clear Start Date</button>
                    </div>
                    <div className="calendar-section">
                        <h3>End Date</h3>
                        <Calendar 
                            onChange={handleEndDateChange} 
                            value={endDate} 
                        />
                        <button className="subtle card-tag" onClick={clearEndDate}>Clear End Date</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCalendar;