import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteTask from "./DeleteTask";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

describe("DeleteTask", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        jest.clearAllMocks();
    });

    it("renders DeleteTask page with correct text", () => {
        (useLocation as jest.Mock).mockReturnValue({ state: { id: 1 } });

        render(
            <MemoryRouter>
                <DeleteTask />
            </MemoryRouter>
        );

        expect(screen.getByText("Delete Task")).toBeInTheDocument();
        expect(
            screen.getByText("Are you sure you want to delete this task?")
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });

    it("calls fetch and navigates on successful delete", async () => {
        (useLocation as jest.Mock).mockReturnValue({ state: { id: 123 } });
        global.fetch = jest.fn().mockResolvedValue({ ok: true }) as any;
        window.alert = jest.fn();

        render(
            <MemoryRouter>
                <DeleteTask />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: "Delete" }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/tasks/123",
                { method: "DELETE" }
            );
            expect(window.alert).toHaveBeenCalledWith("Task deleted successfully");
            expect(mockNavigate).toHaveBeenCalledWith("/allTasks");
        });
    });

    it("shows alert on failed delete", async () => {
        (useLocation as jest.Mock).mockReturnValue({ state: { id: 456 } });
        global.fetch = jest.fn().mockResolvedValue({ ok: false }) as any;
        window.alert = jest.fn();

        render(
            <MemoryRouter>
                <DeleteTask />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: "Delete" }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Failed to delete task");
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it("handles missing task id successfully", async () => {
        (useLocation as jest.Mock).mockReturnValue({ state: undefined });
        global.fetch = jest.fn();
        window.alert = jest.fn();

        render(
            <MemoryRouter>
                <DeleteTask />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: "Delete" }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/tasks/undefined",
                { method: "DELETE" }
            );
        });
    });
});