import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, useLocation } from "react-router-dom";
import { formatAgo } from "../../util/date";
import VideoCard from "../VideoCard";
import { fakeVideo as video } from "../../tests/videos";
import { withRouter } from "../../tests/utils";

describe("VideoCard", () => {
  const { title, channelTitle, publishedAt, thumbnails } = video.snippet;

  // 스냅샷 테스트 (정적 테스트)
  it("renders grid type correctly", () => {
    const { asFragment } = render(
      withRouter(<Route path="/" element={<VideoCard video={video} />} />)
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders list type correctly", () => {
    const { asFragment } = render(
      withRouter(
        <Route path="/" element={<VideoCard video={video} type="list" />} />
      )
    );
    expect(asFragment()).toMatchSnapshot();
  });

  // UI 검사 - 스냅샷 테스트를 하는 경우 이 테스트는 옵션임
  it("renders video item", () => {
    render(
      withRouter(<Route path="/" element={<VideoCard video={video} />} />)
    );

    const image = screen.getByRole("img");
    expect(image.src).toBe(thumbnails.medium.url);
    expect(image.alt).toBe(title);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(channelTitle)).toBeInTheDocument();
    expect(screen.getByText(formatAgo(publishedAt))).toBeInTheDocument();
  });

  // 행동 검사
  it("navigates to detailed video page with video state when clicked", () => {
    // 테스트용 함수 컴포넌트 (/videos/watch 경로에 왔을떄 보여줄 임의의 컴포넌트)
    function LocationStateDisplay() {
      return <pre>{JSON.stringify(useLocation().state)}</pre>;
    }
    render(
      withRouter(
        <>
          <Route path="/" element={<VideoCard video={video} />} />
          <Route
            path={`/videos/watch/${video.id}`}
            element={<LocationStateDisplay />}
          />
        </>
      )
    );

    const card = screen.getByRole("listitem");
    userEvent.click(card);

    expect(screen.getByText(JSON.stringify({ video }))).toBeInTheDocument();
  });
});
