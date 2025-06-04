import { render, screen } from "@testing-library/react";
import CreateTask from "./CreateTask";

jest.mock("../components/taskForm", () => () => <div>TaskFormMock</div>);
jest.mock("../components/NavBar", () => ({ currentPage }: { currentPage: string }) => <div>NavBarMock: {currentPage}</div>);
jest.mock("../components/Header", () => () => <div>HeaderMock</div>);
jest.mock("../components/Footer", () => () => <div>FooterMock</div>);

describe("CreateTask page", () => {
    it("renders NavBar with currentPage prop", () => {
        render(<CreateTask />);
        expect(screen.getByText(/NavBarMock: createTask/)).toBeInTheDocument();
    });

    it("renders Header", () => {
        render(<CreateTask />);
        expect(screen.getByText("HeaderMock")).toBeInTheDocument();
    });

    it("renders TaskForm with isUpdate false", () => {
        render(<CreateTask />);
        expect(screen.getByText("TaskFormMock")).toBeInTheDocument();
    });

    it("renders Footer", () => {
        render(<CreateTask />);
        expect(screen.getByText("FooterMock")).toBeInTheDocument();
    });
});