import { Route } from "react-router-dom";
import { withRouter } from "../../tests/utils";
import SearchHeader from "../SearchHeader";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SearchHeader", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      withRouter(<Route path="/" element={<SearchHeader />} />)
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders with keyword correctly", async () => {
    render(
      withRouter(
        <Route path="/:keyword" element={<SearchHeader />} />,
        "/faker"
      )
    );
    expect(screen.getByDisplayValue("faker")).toBeInTheDocument();
  });

  it("navigates to results page on search button click", () => {
    const searchKeyword = "fake-keyword";

    render(
      withRouter(
        <>
          <Route path="/home" element={<SearchHeader />} />
          <Route
            path={`/videos/${searchKeyword}`}
            element={<p>{`Search result for ${searchKeyword}`}</p>}
          />
        </>,
        "/home"
      )
    );

    const searchButton = screen.getByRole("button");
    const searchInput = screen.getByRole("textbox");

    userEvent.type(searchInput, searchKeyword);
    userEvent.click(searchButton);

    expect(
      screen.getByText(`Search result for ${searchKeyword}`)
    ).toBeInTheDocument();
  });
});
