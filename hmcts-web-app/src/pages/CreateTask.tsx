import TaskForm from "../components/taskForm";
import NavBar from "../components/NavBar";
import '../assets/govuk-frontend/dist/govuk/govuk-frontend.min.css'
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateTask = () => {
    return (
        <>
            <NavBar currentPage = 'createTask'/>
            <Header/>
            <TaskForm isUpdate={false}></TaskForm>
            <Footer/>
        </>
    )
}

export default CreateTask;