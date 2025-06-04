import axios from "axios"
import { useState, useEffect } from "react"
import TaskForm from "../components/taskForm"
import Task from "../types/Task"
import { useLocation } from 'react-router-dom'
import NavBar from "../components/NavBar"
import Header from "../components/Header"

const ViewTask = () => {
  const [data, setData] = useState<Task | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation();
  const taskId = location.state?.id;
  useEffect(() => {

    if (!taskId || taskId === 'undefined' || isNaN(Number(taskId))) {
      setError("Invalid task ID, id passed is " + taskId)
      setLoading(false)
      return
    }

    setLoading(true)
    axios.get(`http://localhost:8080/tasks/${taskId}`)
      .then(response => {
        setData(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error:", error)
        setError("Failed to load task")
        setLoading(false)
      })
  }, [taskId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!data) return <div>Task not found</div>

  return (
    <>
      <NavBar currentPage='viewTask' />
      <Header />
      <TaskForm task={data} isUpdate={true} />
    </>

  )
}

export default ViewTask;