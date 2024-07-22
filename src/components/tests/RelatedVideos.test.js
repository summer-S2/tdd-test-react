import { Route } from "react-router-dom";
import { withAllContexts, withRouter } from "../../tests/utils";
import {
  screen,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { fakeVideos } from "../../tests/videos";
import RelatedVideos from "../RelatedVideos";

describe("RelatedVideos", () => {
  const fakeYoutube = {
    relatedVideos: jest.fn(), // api mock처리
  };

  afterEach(() => fakeYoutube.relatedVideos.mockReset());

  // 스냅샷 테스트
  it("renders correctly", async () => {
    fakeYoutube.relatedVideos.mockImplementation(() => fakeVideos);
    const { asFragment } = renderRelatedVideos();

    // 로딩이 없어질때까지 기다림
    await waitForElementToBeRemoved(screen.queryByText("Loading..."));
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders related videos correctly", async () => {
    fakeYoutube.relatedVideos.mockImplementation(() => fakeVideos);
    renderRelatedVideos();

    expect(fakeYoutube.relatedVideos).toHaveBeenCalledWith("id");
    await waitFor(() =>
      expect(screen.getAllByRole("listitem")).toHaveLength(fakeVideos.length)
    );
  });

  it("renders loading", () => {
    fakeYoutube.relatedVideos.mockImplementation(() => fakeVideos);
    renderRelatedVideos();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error", async () => {
    fakeYoutube.relatedVideos.mockImplementation(() => {
      throw new Error("error");
    });
    renderRelatedVideos();

    await waitFor(() => {
      expect(screen.getByText("Something is wrong 😖")).toBeInTheDocument();
    });
  });

  function renderRelatedVideos() {
    return render(
      withAllContexts(
        withRouter(<Route path="/" element={<RelatedVideos id="id" />} />),
        fakeYoutube
      )
    );
  }
});
