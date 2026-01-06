import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MyCalendar = ({ showCalendars, onDateChange }) => {
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);

    React.useEffect(() => {
        onDateChange(
            startDate ? formatDateTime(startDate) : null,
            endDate ? formatDateTime(endDate) : null
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

    const formatDateTime = (date) => {
        if (!date) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
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