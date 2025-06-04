import { NavLink, useNavigate } from "react-router-dom";
import '../assets/govuk-frontend/dist/govuk/govuk-frontend.min.css'


const NavBar = ({
  currentPage = ''
}) => {
  const navigate = useNavigate();

  switch (currentPage) {
    case 'allTasks':
      return allTasksNavbar();
    case 'viewTask':
      return viewTaskNavbar();
    case 'createTask':
      return createTaskNavbar();
    default:
      return null;
  }

  function createTaskNavbar() {
    return (
      <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" onClick={() => navigate('/')}>Home</a>
          </li>
          <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" onClick={() => navigate('/createTask')}>Create Task</a>
          </li>
        </ol>
      </nav>
    );
  }

  function allTasksNavbar() {
    return (
      <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" onClick={() => navigate("/")}>Home</a>
          </li>
          <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" onClick={() => navigate("allTasks")}>All Tasks</a>
          </li>
        </ol>
      </nav>
    );
  };

  function viewTaskNavbar() {
    return (
      <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" onClick={() => navigate('/')}>Home</a>
          </li>
          <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" onClick={() => navigate('/allTasks')}>All Tasks</a>
          </li>
          <li className="govuk-breadcrumbs__list-item">
            <NavLink className="govuk-breadcrumbs__link" to="/viewTask">View or Update Task</NavLink>
          </li>
        </ol>
      </nav>
    );
  };

}

export default NavBar;