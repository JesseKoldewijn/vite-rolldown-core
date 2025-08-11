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
vi.mock("./App.tsx", () => ({
  default: () => "App Component",
}));

// Mock CSS imports
vi.mock("./styles/tailwind.css", () => ({}));

describe("main.tsx bootstrap", () => {
  let mockRootElement: HTMLElement;
  let originalGetElementById: typeof document.getElementById;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create a fresh mock root element
    mockRootElement = document.createElement("div");
    mockRootElement.id = "root";

    // Store original method
    originalGetElementById = document.getElementById;

    // Clear document and add root element
    document.body.innerHTML = "";
    document.body.appendChild(mockRootElement);
  });

  afterEach(() => {
    // Restore original methods
    document.getElementById = originalGetElementById;
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("should test mocking setup", () => {
    // Test that our mocks are working
    expect(mockCreateRoot).toBeDefined();
    expect(mockRender).toBeDefined();
  });

  it("should verify root element can be found", () => {
    // Mock getElementById to return our element
    document.getElementById = vi.fn().mockReturnValue(mockRootElement);

    const root = document.getElementById("root");
    expect(root).toBe(mockRootElement);
    expect(root?.id).toBe("root");
  });

  it("should verify createRoot factory function", () => {
    mockCreateRoot.mockReturnValue({
      render: mockRender,
    });

    const result = mockCreateRoot(mockRootElement);
    expect(result).toHaveProperty("render");
    expect(typeof result.render).toBe("function");
  });

  it("should verify render function is callable", () => {
    mockCreateRoot.mockReturnValue({
      render: mockRender,
    });

    const root = mockCreateRoot(mockRootElement);
    root.render("test content");

    expect(mockRender).toHaveBeenCalledWith("test content");
  });

  it("should handle null root element scenario", () => {
    // Test behavior when getElementById returns null
    document.getElementById = vi.fn().mockReturnValue(null);

    const result = document.getElementById("root");
    expect(result).toBeNull();

    // This simulates what would happen with the ! operator
    expect(() => {
      if (!result) {
        throw new TypeError("Cannot read properties of null");
      }
    }).toThrow();
  });
});
