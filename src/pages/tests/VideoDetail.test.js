import { Route } from "react-router-dom";
import { withRouter } from "../../tests/utils";
import ChannelInfo from "../../components/ChannelInfo";
import RelatedVideos from "../../components/RelatedVideos";
import { render, screen } from "@testing-library/react";
import { fakeVideo } from "../../tests/videos";
import VideoDetail from "../VideoDetail";

jest.mock("../../components/ChannelInfo");
jest.mock("../../components/RelatedVideos");

describe("VideoDetail", () => {
  afterEach(() => {
    ChannelInfo.mockReset();
    RelatedVideos.mockReset();
  });

  it("renders video item details", () => {
    render(
      withRouter(<Route path="/" element={<VideoDetail />} />, {
        pathname: "/",
        state: { video: fakeVideo },
        key: "fake-key",
      })
    );

    const { title, channelId, channelTitle } = fakeVideo.snippet;
    expect(screen.getByTitle(title)).toBeInTheDocument();

    // prop이 잘 전달됐는지 확인 - 중요
    expect(RelatedVideos.mock.calls[0][0]).toStrictEqual({ id: fakeVideo.id });
    expect(ChannelInfo.mock.calls[0][0]).toStrictEqual({
      id: channelId,
      name: channelTitle,
    });
  });
});
