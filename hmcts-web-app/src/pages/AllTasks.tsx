import { useState, useEffect } from "react"
import Task from "../types/Task"
import axios from "axios";
import TaskList from "../components/taskList"
import '../assets/govuk-frontend/dist/govuk/govuk-frontend.min.css'
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { NavLink } from "react-router-dom";

const AllTasks = () => {
  const [data, setData] = useState<Task[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(0);
  const [sortValue, setSortValue] = useState("status");
  const [direction, setDirection] = useState("ASC");

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switch (event.target.value) {
      case "status-asc":
        setSortValue("status");
        setDirection("ASC");
        break;
      case "status-desc":
        setSortValue("status");
        setDirection("DESC");
        break;
      case "dueDate-asc":
        setSortValue("dueDate");
        setDirection("ASC");
        break;
      case "dueDate-desc":
        setSortValue("dueDate");
        setDirection("DESC");
        break;
      default:
        setSortValue("status");
        setDirection("ASC");
    }

    setCurrentPage(1);
  };

  useEffect(() => {
    axios.get(`http://localhost:8080/tasks?page=${currentPage - 1}&size=${itemsPerPage}&sortBy=${sortValue}&direction=${direction}`)
      .then(response => response.data)
      .then(data => {
        setData(data.tasks);
        setTotalPages(data.totalPages);
      })
      .catch(error => {
        console.error("Error:" + error)
      })
  }, [currentPage, itemsPerPage, sortValue, direction]);

  return (
    <>
      <NavBar currentPage="allTasks" />
      <Header />
      <div className="govuk-width-container">
        <a href="/" className="govuk-back-link">Back</a>
        <main className="govuk-main-wrapper">
          <h1 className="govuk-heading-l">Task List</h1>
          <NavLink to='/createTask' className="govuk-button">Create Task</NavLink>
          <label className="govuk-label" htmlFor="sort">Sort by</label>
          <select
            className="govuk-select"
            id="sort"
            name="sort"
            onChange={handleSortChange}
          >
            <option value="status-asc">Status (ASC)</option>
            <option value="status-desc">Status (DESC)</option>
            <option value="dueDate-asc">Due date (earliest first)</option>
            <option value="dueDate-desc">Due date (latest first)</option>
          </select>
          <TaskList data={data}></TaskList>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="govuk-button govuk-button--secondary"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`govuk-button ${currentPage === i + 1 ? 'govuk-button--primary' : 'govuk-button--secondary'}`}
              >
                {i + 1}
              </button>
            ))}


            <button className="govuk-button govuk-button--secondary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages} >
              Next
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default AllTasks;