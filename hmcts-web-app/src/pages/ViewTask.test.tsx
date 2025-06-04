import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import ViewTask from "./ViewTask";

// Mock dependencies
jest.mock("axios");
jest.mock("../components/NavBar", () => () => <div>NavBar</div>);
jest.mock("../components/Header", () => () => <div>Header</div>);
jest.mock("../components/taskForm", () => ({ task, isUpdate }: any) => (
    <div>TaskForm: {task?.title}, isUpdate: {isUpdate ? "true" : "false"}</div>
));

// Helper to render with router and custom location state
const renderWithRouter = (state?: any) => {
    return render(
        <MemoryRouter initialEntries={[{ pathname: "/view", state }]}>
            <ViewTask />
        </MemoryRouter>
    );
};

describe("ViewTask", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("shows error for invalid task id (undefined)", async () => {
        renderWithRouter({ id: undefined });
        await waitFor(() => {
            expect(screen.getByText(/invalid task id/i)).toBeInTheDocument();
        });
    });

    it("shows error for invalid task id (not a number)", async () => {
        renderWithRouter({ id: "abc" });
        await waitFor(() => {
            expect(screen.getByText(/invalid task id/i)).toBeInTheDocument();
        });
    });

    it("shows error if axios fails", async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error("fail"));
        renderWithRouter({ id: 2 });
        await waitFor(() => {
            expect(screen.getByText(/failed to load task/i)).toBeInTheDocument();
        });
    });

    it("shows 'Task not found' if no data returned", async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: undefined });
        renderWithRouter({ id: 3 });
        await waitFor(() => {
            expect(screen.getByText(/task not found/i)).toBeInTheDocument();
        });
    });

    it("renders NavBar, Header, and TaskForm on success", async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: { id: 4, title: "Test Task" },
        });
        renderWithRouter({ id: 4 });
        await waitFor(() => {
            expect(screen.getByText("NavBar")).toBeInTheDocument();
            expect(screen.getByText("Header")).toBeInTheDocument();
            expect(screen.getByText(/TaskForm: Test Task, isUpdate: true/)).toBeInTheDocument();
        });
    });
});