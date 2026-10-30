import React, { useState, useEffect } from "react";
import '../assets/govuk-frontend/dist/govuk/govuk-frontend.min.css';
import { useNavigate } from "react-router-dom";
import DueDate, { DueDateValue } from "./dueDate";

type TaskForForm = {
    id: number | null;
    title: string;
    description: string | null;
    status: string;
    dueDate: DueDateValue | string;
}

interface TaskFormProps {
    task?: TaskForForm;
    isUpdate?: boolean;
}

const mapDueDate = (dueDate: string | DueDateValue): DueDateValue => {
    if (typeof dueDate === 'string') {
        const [datePart, timePart = ''] = dueDate.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour = '', minute = ''] = timePart.split(':');
        return { day, month, year, hour, minute };
    }
    return dueDate;
}

export const TaskForm: React.FC<TaskFormProps> = (
    { task, isUpdate = false }
) => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState<{
        title?: string;
        status?: string;
        dueDate?: string;
    }>({});
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        status: string;
        dueDate: DueDateValue;
    }>({
        title: "",
        description: "",
        status: "Select a status",
        dueDate: { day: "", month: "", year: "", hour: "", minute: "" }
    });

    useEffect(() => {
        if (isUpdate && task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'INACTIVE',
                dueDate: typeof task.dueDate === 'string' ? mapDueDate(task.dueDate) : task.dueDate
            });
        }
    }, [isUpdate, task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date: DueDateValue) => {
        setFormData({ ...formData, dueDate: { ...formData.dueDate, ...date } });
    };

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (task?.id) {
            try {
                const response = await fetch(`http://localhost:8080/tasks/${task.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 200) {
                    console.log("Task deleted successfully");
                    navigate("/allTasks");
                } else {
                    console.error("Failed to delete task:", response.statusText);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors: {
            title?: string;
            status?: string;
            dueDate?: string;
        } = {};

        if (!formData.title.trim()) {
            errors.title = "Task title is required";
        }

        if (!formData.status) {
            errors.status = "Status is required";
        }

        const { day, month, year, hour, minute } = formData.dueDate;
        const formattedDueDate : Date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));

        if (!day || !month || !year || !hour || !minute) {
            errors.dueDate = "Complete due date and time is required";
        } else if (Number(hour) > 23 || Number(minute) > 59) {
            errors.dueDate = "Due time must be a real time, using the 24-hour clock";
        } else if (formattedDueDate.getDate() !== Number(day) || formattedDueDate.getMonth() !== Number(month) - 1) {
            // Date rolls invalid days over (31/02 becomes 03/03), so a mismatch means the date doesn't exist
            errors.dueDate = "Due date must be a real date";
        } else if (!isUpdate && formattedDueDate <= new Date()) {
            // Existing tasks can go overdue and still need their status updating
            errors.dueDate = "Due date must be in the future";
        }
        if( formData.status === "Select a status") {
            errors.status = "Please select a valid status";
        }

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

        // Format the date in yyyy-MM-ddTHH:mm format for the backend
        const paddedDay = formData.dueDate.day.padStart(2, '0');
        const paddedMonth = formData.dueDate.month.padStart(2, '0');
        const paddedHour = formData.dueDate.hour.padStart(2, '0');
        const paddedMinute = formData.dueDate.minute.padStart(2, '0');
        const formattedDate = `${formData.dueDate.year}-${paddedMonth}-${paddedDay}T${paddedHour}:${paddedMinute}`;


        try {
            if (isUpdate && task?.id) {
                const payload = {
                    status: formData.status,
                }
                const response = await fetch(`http://localhost:8080/tasks/${task.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                if (response.status === 200) {
                    console.log("Task status updated successfully");
                    navigate("/allTasks");
                } else {
                    console.error("Failed to update task:", response.statusText);
                }
            } else {
                const payload = {
                    ...formData,
                    dueDate: formattedDate
                };
                const response = await fetch("http://localhost:8080/tasks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (response.status === 201) {
                    console.log("Task created successfully");
                    navigate("/allTasks");
                } else {
                    console.error("Failed to create task:", response.statusText);
                }
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    return (
        <form data-testid="task-form" onSubmit={handleSubmit} className="govuk-width-container">
            <a href="/allTasks" className="govuk-back-link">Back</a>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <main className="govuk-main-wrapper">
                        <h1 className="govuk-heading-l">{isUpdate ? 'View, Update or Delete Task' : 'Create Task'}</h1>

                        <div className={`govuk-form-group ${formErrors.title ? 'govuk-form-group--error' : ''}`}>
                            <label className="govuk-label" htmlFor="task-title">Task Title</label>
                            {formErrors.title && (
                                <p id="task-title-error" className="govuk-error-message">
                                    <span className="govuk-visually-hidden">Error:</span> {formErrors.title}
                                </p>
                            )}
                            <input
                                className="govuk-input"
                                id="task-title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                disabled={isUpdate}
                                aria-describedby={formErrors.title ? "task-title-error" : undefined}
                            />
                        </div>

                        <div className="govuk-form-group">
                        <label className="govuk-label" htmlFor="task-description">Task Description</label>
                        <input
                            className="govuk-input"
                            id="task-description"
                            name="description"
                            type="text"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isUpdate}
                        />
                        </div>
                        <div className={`govuk-form-group ${formErrors.status ? 'govuk-form-group--error' : ''}`}>
                            <label className="govuk-label" htmlFor="status">Status</label>
                            {formErrors.status && (
                                <p id="status-error" className="govuk-error-message">
                                    <span className="govuk-visually-hidden">Error:</span> {formErrors.status}
                                </p>
                            )}
                            <select
                                className="govuk-select"
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                aria-describedby={formErrors.status ? "status-error" : undefined}
                            >
                                <option value="">-- Select a status --</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETE">Complete</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>

                        {isUpdate ? <DueDate onDateChange={handleDateChange} initialDate={formData.dueDate} error={formErrors.dueDate}
                            isUpdate={true} />
                            : <DueDate onDateChange={handleDateChange} initialDate={formData.dueDate} error={formErrors.dueDate}
                                isUpdate={false} />}
                        <div className="govuk-button-group">
                            <button type="submit" className="govuk-button govuk-!-margin-top-4">
                                {isUpdate ? 'Update Task' : 'Create Task'}
                            </button>
                            {isUpdate && <button type="button" className="govuk-button govuk-button--warning govuk-!-margin-top-4" onClick={async (e) => { handleDelete(e) }}>
                                Delete Task
                            </button>}
                        </div>

                    </main>
                </div>
            </div>
        </form>
    );
};

export default TaskForm;