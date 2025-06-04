import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { NavLink } from "react-router-dom";
import Footer from "../components/Footer";
import '../assets/govuk-frontend/dist/govuk/govuk-frontend.min.css';

const Home = () => {
    return (
        <>
            <NavBar currentPage="Home" />
            <Header />
            <div className="govuk-width-container">
                <h1 className="govuk-heading-l">Welcome to the Task Management System</h1>
                <p className="govuk-body">This is a simple task management system where you can create, view, and manage tasks.</p>
                <div className="govuk-button-group">
                    <NavLink to="/CreateTask" className="govuk-button govuk-button--start">Create Task</NavLink>
                    <NavLink to="/AllTasks" className="govuk-button govuk-button--start">View All Tasks</NavLink>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;