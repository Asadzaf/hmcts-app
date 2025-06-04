import Task from "../types/Task";
import '../assets/govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { NavLink } from "react-router-dom";

type TaskList = {
    data: Task[];
};

const TaskList = ({ data }: TaskList) => {
    return (
        <>
            {data.map((item) => (
                <div key={item.id} className="govuk-summary-card">
                    <div className="govuk-summary-card__title-wrapper">
                        <h2 className="govuk-summary-card__title">
                            {item.title}
                        </h2>
                        <div className="govuk-summary-card__actions">
                            <li className="govuk-summary-card__action">
                                <NavLink to='/viewTask' state={{ id: item.id }} className="govuk-link">Update</NavLink>
                            </li>
                            <li className="govuk-summary-card__action">
                                <NavLink to='/deleteTask' state={{ id: item.id }} className="govuk-link">Delete</NavLink>
                            </li>
                        </div>
                    </div>
                    <div className="govuk-summary-card__content">
                        <div className="govuk-summary-list">
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">ID</dt>
                                <dd className="govuk-summary-list__value">{item.id}</dd>
                            </div>
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Task Title</dt>
                                <dd className="govuk-summary-list__value">{item.title}</dd>
                            </div>
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Description</dt>
                                <dd className="govuk-summary-list__value">{item.description}</dd>
                            </div>
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Status</dt>
                                <dd className="govuk-summary-list__value">{item.status == 'IN_PROGRESS' ? 'IN PROGRESS' : item.status}</dd>
                            </div>
                            <div className="govuk-summary-list__row">
                                <dt className="govuk-summary-list__key">Due Date</dt>
                                <dd className="govuk-summary-list__value">{item.dueDate}</dd>
                            </div>
                        </div>
                    </div>
                </div>

            ))}
        </>
    )
}

export default TaskList;