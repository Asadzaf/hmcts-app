import { useLocation, useNavigate } from "react-router-dom";


const DeleteTask = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const taskId = location.state?.id;

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Task deleted successfully');
                navigate("/allTasks");
            } else {
                alert('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="govuk-width-container">
            <a href="/allTasks" className="govuk-back-link">Back</a>
            <main className="govuk-main-wrapper">
                <h1 className="govuk-heading-l">Delete Task</h1>
                <p className="govuk-body">Are you sure you want to delete this task?</p>
                <button onClick={handleDelete} className="govuk-button">Delete</button>
            </main>
        </div>
    );
}

export default DeleteTask;