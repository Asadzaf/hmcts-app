import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TaskForm } from "./taskForm";

const BASE_URL = "http://localhost:8080/tasks";

const renderTaskForm = (TaskProps = {}) =>
    render(
        <MemoryRouter>
            <TaskForm {...TaskProps} />
        </MemoryRouter>
    );

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// Create a mockable dueDate component
const mockDueDateComponent = jest.fn();
jest.mock("./dueDate", () => ({
    __esModule: true,
    default: (props: any) => mockDueDateComponent(props),
}));

describe("TaskForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset to default mock implementation
        mockDueDateComponent.mockImplementation(({ onDateChange }: any) => (
            <div data-testid="due-date-mock">
                <button onClick={() => onDateChange({ day: "01", month: "01", year: "2025" })}>
                    Set Due Date
                </button>
            </div>
        ));
    });

    it("renders create task form", () => {
        renderTaskForm();
        expect(screen.getByRole("heading", { name: /Create Task/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Create Task/i })).toBeInTheDocument();
        expect(screen.getByLabelText("Task Title")).toBeEnabled();
        expect(screen.getByLabelText("Task Description")).toBeEnabled();
        expect(screen.getByLabelText("Status")).toBeInTheDocument();
    });

    it("renders update/delete task form with initial values", () => {
        renderTaskForm({
            isUpdate: true,
            task: {
                id: 1,
                title: "Test Task",
                description: "Desc",
                status: "IN_PROGRESS",
                dueDate: "2024-12-31",
            },
        });
        expect(screen.getByDisplayValue("Test Task")).toBeDisabled();
        expect(screen.getByDisplayValue("Desc")).toBeDisabled();
        expect(screen.getByLabelText("Status")).toHaveValue("IN_PROGRESS");
        expect(screen.getByRole("button", { name: /Update Task/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Delete Task/i })).toBeInTheDocument();
    });

    it("submits create task form and navigates on success", async () => {
        global.fetch = jest.fn().mockResolvedValue({ status: 201 }) as any;
        renderTaskForm();
        fireEvent.change(screen.getByLabelText("Task Title"), { target: { value: "New Task" } });
        fireEvent.change(screen.getByLabelText("Task Description"), { target: { value: "Some desc" } });
        fireEvent.change(screen.getByLabelText("Status"), { target: { value: "IN_PROGRESS" } });
        fireEvent.click(screen.getByText("Set Due Date"));
        fireEvent.click(screen.getByRole("button", { name: /Create Task/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                BASE_URL,
                expect.objectContaining({
                    method: "POST",
                    headers: expect.any(Object),
                    body: expect.stringContaining("New Task"),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/allTasks");
        });
    });

    it("submits update task form and navigates on success", async () => {
        global.fetch = jest.fn().mockResolvedValue({ status: 200 }) as any;
        renderTaskForm({
            isUpdate: true,
            task: {
                id: 2,
                title: "Update Task",
                description: "Desc",
                status: "INACTIVE",
                dueDate: "2024-12-31",
            },
        });
        fireEvent.change(screen.getByLabelText("Status"), { target: { value: "COMPLETE" } });
        fireEvent.click(screen.getByRole("button", { name: /Update Task/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `${BASE_URL}/2`,
                expect.objectContaining({
                    method: "PUT",
                    headers: expect.any(Object),
                    body: expect.stringContaining("COMPLETE"),
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/allTasks");
        });
    });

    it("calls delete API and navigates on delete", async () => {
        global.fetch = jest.fn().mockResolvedValue({ status: 200 }) as any;
        renderTaskForm({
            isUpdate: true,
            task: {
                id: 3,
                title: "Delete Task",
                description: "Desc",
                status: "INACTIVE",
                dueDate: "2024-12-31",
            },
        });
        fireEvent.click(screen.getByRole("button", { name: /Delete Task/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `${BASE_URL}/3`,
                expect.objectContaining({
                    method: "DELETE",
                })
            );
            expect(mockNavigate).toHaveBeenCalledWith("/allTasks");
        });
    });

    it("prevents default form submission", () => {
        renderTaskForm();
        const form = screen.getByTestId("task-form");
        const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
        jest.spyOn(submitEvent, "preventDefault");
        form.dispatchEvent(submitEvent);
        expect(submitEvent.preventDefault).toHaveBeenCalled();
    });

    it("shows validation error if title is missing", async () => {
        renderTaskForm();
        fireEvent.change(screen.getByLabelText("Status"), { target: { value: "IN_PROGRESS" } });
        fireEvent.click(screen.getByText("Set Due Date"));
        fireEvent.click(screen.getByRole("button", { name: /Create Task/i }));
        
        await waitFor(() => {
            expect(screen.getByText(/Task title is required/i)).toBeInTheDocument();
        });
    });

    it("shows validation error if status is missing", async () => {
        renderTaskForm();
        fireEvent.change(screen.getByLabelText("Task Title"), { target: { value: "Task Without Status" } });
        fireEvent.click(screen.getByText("Set Due Date"));
        fireEvent.click(screen.getByRole("button", { name: /Create Task/i }));
        
        await waitFor(() => {
            expect(screen.getByText(/Please select a valid status/i)).toBeInTheDocument();
        });
    });
});