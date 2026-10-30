import React, { useEffect } from "react";

export type DueDateValue = { day: string; month: string; year: string; hour: string; minute: string };

interface DueDateProps {
  initialDate?: DueDateValue;
  onDateChange: (date: DueDateValue) => void;
  isUpdate?: boolean;
  error?: string;
}

const fields: { name: keyof DueDateValue; label: string; width: 2 | 4 }[] = [
  { name: "day", label: "Day", width: 2 },
  { name: "month", label: "Month", width: 2 },
  { name: "year", label: "Year", width: 4 },
  { name: "hour", label: "Hour", width: 2 },
  { name: "minute", label: "Minute", width: 2 },
];

const DueDate: React.FC<DueDateProps> = ({ initialDate, onDateChange, isUpdate, error }) => {
  const [date, setDate] = React.useState<DueDateValue>({
    day: initialDate?.day || "",
    month: initialDate?.month || "",
    year: initialDate?.year || "",
    hour: initialDate?.hour || "",
    minute: initialDate?.minute || "",
  });

  useEffect(() => {
    if (initialDate) {
      setDate({
        day: initialDate.day || "",
        month: initialDate.month || "",
        year: initialDate.year || "",
        hour: initialDate.hour || "",
        minute: initialDate.minute || "",
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
        aria-describedby={error ? "due-date-hint due-date-error" : "due-date-hint"}
      >
        <legend className="govuk-fieldset__legend">Due date and time</legend>
        <div id="due-date-hint" className="govuk-hint">
          For example, 27 3 2026 14 30 (use the 24-hour clock)
        </div>

        {error && (
          <p id="due-date-error" className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {error}
          </p>
        )}

        <div className="govuk-date-input" id="due-date">
          {fields.map(({ name, label, width }) => (
            <div className="govuk-date-input__item" key={name}>
              <label className="govuk-label govuk-date-input__label" htmlFor={`due-date-${name}`}>
                {label}
              </label>
              <input
                className={`govuk-input govuk-date-input__input govuk-input--width-${width}`}
                id={`due-date-${name}`}
                name={name}
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={date[name]}
                onChange={handleChange}
                disabled={isUpdate}
              />
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default DueDate;
