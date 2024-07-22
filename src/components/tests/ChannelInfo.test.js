import { render, screen, waitFor } from "@testing-library/react";
import { withAllContexts, withRouter } from "../../tests/utils";
import { Route } from "react-router-dom";
import ChannelInfo from "../ChannelInfo";

// 테스트 코드에서 어느정도 중복 코드는 허용됨
// 너무 깔끔하게 리팩토링하면 오히려 테스트 코드를 한눈에 알아보기 어려울 수 있음

describe("ChannelInfo", () => {
  const fakeYoutube = {
    channelImageURL: jest.fn(),
  };

  // 각각의 it이 실행된 후 mock을 리셋
  afterEach(() => fakeYoutube.channelImageURL.mockReset());

  it("render correctly", async () => {
    fakeYoutube.channelImageURL.mockImplementation(() => "url");

    // ragment를 먼저 render하고
    const { asFragment } = renderChannelInfo();

    // 이미지를 받아올때까지 기다림
    await waitFor(() => screen.getByRole("img"));

    // 스냅샷을 만듬
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders without URL", () => {
    fakeYoutube.channelImageURL.mockImplementation(() => {
      throw new Error("error");
    });
    // url이 없으면 이미지가 없음
    renderChannelInfo();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("renders with URL", async () => {
    fakeYoutube.channelImageURL.mockImplementation(() => "url");

    // url이 있으면 이미지가 있음
    renderChannelInfo();

    await screen.findByRole("img");
  });

  function renderChannelInfo() {
    return render(
      withAllContexts(
        withRouter(
          <Route path="/" element={<ChannelInfo id="id" name="channel" />} />
        ),
        fakeYoutube
      )
    );
  }
});
