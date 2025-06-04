import React, { useEffect } from "react";

interface DueDateProps {
  initialDate?: { day: string; month: string; year: string };
  onDateChange: (date: { day: string; month: string; year: string }) => void;
  isUpdate?: boolean;
  error?: string;
}

const DueDate: React.FC<DueDateProps> = ({ initialDate, onDateChange, isUpdate, error }) => {
  const [date, setDate] = React.useState({
    day: initialDate?.day || "",
    month: initialDate?.month || "",
    year: initialDate?.year || "",
  });

  useEffect(() => {
    if (initialDate) {
      setDate({
        day: initialDate.day || "",
        month: initialDate.month || "",
        year: initialDate.year || "",
      });
    }
  }, [initialDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDate = { ...date, [name]: value };
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}>
      <fieldset
        className="govuk-fieldset"
        role="group"
        aria-describedby={error ? "due-date-error" : undefined}
      >
        <legend className="govuk-fieldset__legend">Due Date</legend>

        {error && (
          <p id="due-date-error" className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {error}
          </p>
        )}

        <div className="govuk-date-input" id="due-date">
          <div className="govuk-date-input__item">
              <label className="govuk-label govuk-date-input__label" htmlFor="due-date-day">
                Day
              </label>
              <input
                className="govuk-input govuk-date-input__input govuk-input--width-2"
                id="due-date-day"
                name="day"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={date.day}
                onChange={handleChange}
                disabled={isUpdate}
              />
          </div>

          <div className="govuk-date-input__item">
              <label className="govuk-label govuk-date-input__label" htmlFor="due-date-month">
                Month
              </label>
              <input
                className="govuk-input govuk-date-input__input govuk-input--width-2"
                id="due-date-month"
                name="month"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={date.month}
                onChange={handleChange}
                disabled={isUpdate}
              />
          </div>

          <div className="govuk-date-input__item">
              <label className="govuk-label govuk-date-input__label" htmlFor="due-date-year">
                Year
              </label>
              <input
                className="govuk-input govuk-date-input__input govuk-input--width-4"
                id="due-date-year"
                name="year"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={date.year}
                onChange={handleChange}
                disabled={isUpdate}
              />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default DueDate;
