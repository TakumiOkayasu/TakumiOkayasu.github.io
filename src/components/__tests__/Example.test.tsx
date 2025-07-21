import { describe, test, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import React from "react";

// サンプルコンポーネント
const Example: React.FC<{ text: string }> = ({ text }) => {
  return <div data-testid="example">{text}</div>;
};

describe("Example Component", () => {
  test("renders text correctly", () => {
    render(<Example text="Hello Bun!" />);
    expect(screen.getByTestId("example")).toHaveTextContent("Hello Bun!");
  });
});
