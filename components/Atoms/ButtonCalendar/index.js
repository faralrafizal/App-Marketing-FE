import { formatDateNew } from "../../../utils/formateDate";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarComponent() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setShowCalendar(false); // Menutup kalender setelah memilih tanggal
  };

  return (
    <div className="relative">
      <button onClick={toggleCalendar}>
        {formatDateNew(date, "DD MM YYYY")}
      </button>

      {showCalendar && (
        <div className="calendar-container">
          <Calendar value={date} onChange={handleDateChange} />
        </div>
      )}
    </div>
  );
}

export default CalendarComponent;
