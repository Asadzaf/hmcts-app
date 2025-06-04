import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import AllTasks from "./AllTasks";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../components/taskList", () => (props: any) => (
    <div data-testid="task-list">{JSON.stringify(props.data)}</div>
));
jest.mock("../components/NavBar", () => (props: any) => (
    <nav data-testid="navbar">{props.currentPage}</nav>
));
jest.mock("../components/Footer", () => () => <footer data-testid="footer" />);
jest.mock("../components/Header", () => () => <header data-testid="header" />);

describe("AllTasks page", () => {
    const mockTasks = [
        { id: 1, title: "Task 1", description: "Desc 1" },
        { id: 2, title: "Task 2", description: "Desc 2" },
        { id: 3, title: "Task 3", description: "Desc 3" },
    ];
    const mockResponse = {
        data: {
            tasks: mockTasks,
            totalPages: 2,
        },
    };

    beforeEach(() => {
        mockedAxios.get.mockResolvedValueOnce(mockResponse);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders NavBar, Header, Footer, and TaskList", async () => {
        render(<MemoryRouter><AllTasks/></MemoryRouter>);
        expect(screen.getByTestId("navbar")).toBeInTheDocument();
        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByTestId("task-list")).toBeInTheDocument();
        });
    });

    it("fetches and displays tasks", async () => {
        render(<MemoryRouter><AllTasks /></MemoryRouter>);
        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.stringContaining("http://localhost:8080/tasks?page=0&size=3")
            );
            expect(screen.getByTestId("task-list")).toHaveTextContent("Task 1");
            expect(screen.getByTestId("task-list")).toHaveTextContent("Task 2");
            expect(screen.getByTestId("task-list")).toHaveTextContent("Task 3");
        });
    });

    it("renders pagination buttons and handles page change", async () => {
        render(<MemoryRouter><AllTasks/></MemoryRouter>);
        await waitFor(() => {
            expect(screen.getByText("1")).toBeInTheDocument();
            expect(screen.getByText("2")).toBeInTheDocument();
        });

        // "Previous" should be disabled on first page
        expect(screen.getByText("Previous")).toBeDisabled();

        // Click page 2
        mockedAxios.get.mockResolvedValueOnce({
            data: { tasks: mockTasks, totalPages: 2 },
        });
        await userEvent.click(screen.getByText("2"));
        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.stringContaining("page=1")
            );
        });

        // "Previous" should now be enabled
        expect(screen.getByText("Previous")).not.toBeDisabled();

        // "Next" should be disabled on last page
        expect(screen.getByText("Next")).toBeDisabled();
    });

    it("shows 'Create Task' button and back link", async () => {
        render(<MemoryRouter><AllTasks /></MemoryRouter>);
        expect(screen.getByText("Create Task")).toBeInTheDocument();
        expect(screen.getByText("Back")).toHaveAttribute("href", "/");
    });
});