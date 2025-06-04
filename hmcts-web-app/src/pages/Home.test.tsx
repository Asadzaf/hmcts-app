import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

jest.mock("../components/NavBar", () => () => <nav data-testid="navbar" />);
jest.mock("../components/Header", () => () => <header data-testid="header" />);
jest.mock("../components/Footer", () => () => <footer data-testid="footer" />);

describe("Home Page", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
    });

    it("renders NavBar, Header, and Footer", () => {
        expect(screen.getByTestId("navbar")).toBeInTheDocument();
        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("renders the main heading", () => {
        expect(
            screen.getByRole("heading", { name: 'Welcome to the Task Management System' })
        ).toBeInTheDocument();
    });

    it("renders the description paragraph", () => {
        expect(
            screen.getByText('This is a simple task management system where you can create, view, and manage tasks.')
        ).toBeInTheDocument();
    });

    it("renders 'Create Task' and 'View All Tasks' buttons with correct links", () => {
        const createTaskLink = screen.getByRole("link", { name: 'Create Task' });
        const viewAllTasksLink = screen.getByRole("link", { name: 'View All Tasks' });

        expect(createTaskLink).toBeInTheDocument();
        expect(createTaskLink).toHaveAttribute("href", "/CreateTask");

        expect(viewAllTasksLink).toBeInTheDocument();
        expect(viewAllTasksLink).toHaveAttribute("href", "/AllTasks");
    });
});