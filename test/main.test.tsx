import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock React and React DOM before importing main
const mockRender = vi.fn();
const mockCreateRoot = vi.fn().mockReturnValue({
  render: mockRender,
});

vi.mock("react-dom/client", () => ({
  createRoot: mockCreateRoot,
}));

vi.mock("react", () => ({
  StrictMode: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the App component
vi.mock("~/App.tsx", () => ({
  default: () => "App Component",
}));

// Mock CSS imports
vi.mock("~/styles/tailwind.css", () => ({}));

describe("main.tsx bootstrap", () => {
  let mockRootElement: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRootElement = document.createElement("div");
    mockRootElement.id = "root";
    document.body.innerHTML = "";
    document.body.appendChild(mockRootElement);

    // Mock getElementById to return our element
    vi.spyOn(document, "getElementById").mockReturnValue(mockRootElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("should bootstrap the application correctly", async () => {
    // Import main.tsx to execute it
    await import("~/main.tsx");

    // Verify the bootstrap process works
    expect(document.getElementById).toHaveBeenCalledWith("root");
    expect(mockCreateRoot).toHaveBeenCalledWith(mockRootElement);
    expect(mockRender).toHaveBeenCalled();

    // Verify it was called exactly once
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);

    // The render call should have an argument (the JSX)
    const renderArgs = mockRender.mock.calls[0];
    expect(renderArgs).toBeDefined();
    expect(renderArgs[0]).toBeDefined();
  });

  it("should verify module imports and dependencies", () => {
    // Test that our mocks are properly set up
    expect(mockCreateRoot).toBeDefined();
    expect(mockRender).toBeDefined();

    // Test DOM element creation
    expect(mockRootElement.id).toBe("root");
    expect(document.getElementById("root")).toBe(mockRootElement);
  });
});
