import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TaskList from "./taskList";
import Task from "../types/Task";


const renderTaskList = (tasks: Task[]) => {
    render(
        <MemoryRouter>
            <TaskList data={tasks} />
        </MemoryRouter>
    );
};


describe("TaskList component", () => {
    const mockTasks: Task[] = [
        {
            id: 1001,
            title: "Test Task 1",
            description: "Description 1",
            status: "ACTIVE",
            dueDate: "2024-06-01",
        },
        {
            id: 6049,
            title: "Test Task 2",
            description: "Description 2",
            status: "INACTIVE",
            dueDate: "2024-07-01",
        },
    ];

    it("renders all tasks", () => {
        renderTaskList(mockTasks);

        // checks length = 2 as task title is shown twice, once in card title and once in card content
        expect(screen.getAllByText("Test Task 1").length).toEqual(2);
        expect(screen.getAllByText("Test Task 2").length).toEqual(2);
    });

    it("renders task details correctly", () => {
        renderTaskList(mockTasks);
        expect(screen.getAllByText("ID").length).toBe(2);
        expect(screen.getByText("1001")).toBeInTheDocument();
        expect(screen.getByText("6049")).toBeInTheDocument();
        expect(screen.getByText("Description 1")).toBeInTheDocument();
        expect(screen.getByText("Description 2")).toBeInTheDocument();
        expect(screen.getByText("ACTIVE")).toBeInTheDocument();
        expect(screen.getByText("INACTIVE")).toBeInTheDocument();
        expect(screen.getByText("2024-06-01")).toBeInTheDocument();
        expect(screen.getByText("2024-07-01")).toBeInTheDocument();
    });

    it("renders correct Update/Delete links", () => {
        renderTaskList(mockTasks);
        const updateLinks = screen.getAllByRole("link", { name: "Update" });
        updateLinks.forEach(link => {
            expect(link).toHaveAttribute("href", "/viewTask");
        });
    });

    it("renders nothing if data is empty", () => {
        renderTaskList([]);
        expect(screen.queryByText("ID")).not.toBeInTheDocument();
    });

    test('renders taskList correctly via snapshot', () => {
        const { asFragment } = render(
            <MemoryRouter>
                <TaskList data={mockTasks} />
            </MemoryRouter>
        )

        expect(asFragment()).toMatchSnapshot();
    });
});
