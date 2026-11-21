import { expect, test } from "@playwright/test";
import { channelSummary, durationSeconds, pickVideos, thumbnailUrls, type ApiVideo } from "../src/lib/youtube";

test.skip(({ isMobile }) => isMobile, "Pure logic: one browser project is enough.");

/** A minimal API video; defaults to a public 10-minute upload. */
function video(id: string, views: number, publishedAt: string, extra: Partial<ApiVideo> = {}): ApiVideo {
  return {
    id,
    snippet: { title: id, publishedAt, liveBroadcastContent: "none", ...extra.snippet },
    statistics: { viewCount: String(views) },
    contentDetails: { duration: "PT10M" },
    status: { privacyStatus: "public", uploadStatus: "processed" },
    ...extra,
  };
}

test("durations are read from ISO 8601", () => {
  expect(durationSeconds("PT12M3S")).toBe(723);
  expect(durationSeconds("PT1H2M3S")).toBe(3723);
  expect(durationSeconds("PT45S")).toBe(45);
  expect(durationSeconds("P0D")).toBe(0);
  expect(durationSeconds("nonsense")).toBe(0);
});

test("picks the most viewed and newest regular videos, skipping Shorts, lives and private uploads", async () => {
  const videos = [
    video("shortHit000", 900_000, "2026-11-01T00:00:00Z", { contentDetails: { duration: "PT40S" } }),
    video("popular0000", 50_000, "2024-01-01T00:00:00Z"),
    video("private0000", 70_000, "2026-11-15T00:00:00Z", { status: { privacyStatus: "private" } }),
    video("upcoming000", 0, "2026-11-20T00:00:00Z", {
      snippet: { title: "live", publishedAt: "2026-11-20T00:00:00Z", liveBroadcastContent: "upcoming" },
    }),
    video("newest00000", 300, "2026-11-12T00:00:00Z"),
    video("shortNew000", 400, "2026-11-14T00:00:00Z", { contentDetails: { duration: "PT2M30S" } }),
    video("second00000", 800, "2026-10-01T00:00:00Z"),
    video("older000000", 600, "2026-01-01T00:00:00Z"),
  ];
  const asked: string[] = [];
  const isShort = async (v: ApiVideo) => {
    asked.push(v.id);
    return v.id.startsWith("short");
  };

  const { popular, latest } = await pickVideos(videos, isShort);
  expect(popular?.id).toBe("popular0000");
  expect(latest.map((v) => v.id)).toEqual(["newest00000", "second00000"]);
  // Each video is checked at most once.
  expect(new Set(asked).size).toBe(asked.length);
});

test("the most viewed video is never repeated among the latest", async () => {
  const videos = [video("onlyOne0000", 10, "2026-11-01T00:00:00Z"), video("other000000", 5, "2026-10-01T00:00:00Z")];
  const { popular, latest } = await pickVideos(videos, async () => false);
  expect(popular?.id).toBe("onlyOne0000");
  expect(latest.map((v) => v.id)).toEqual(["other000000"]);
});

test("thumbnails avoid YouTube's letterboxed 4:3 sizes", () => {
  const v = video("thumbs00000", 1, "2026-01-01T00:00:00Z", {
    snippet: {
      title: "t",
      publishedAt: "2026-01-01T00:00:00Z",
      thumbnails: {
        medium: { url: "https://i.ytimg.com/vi/x/mqdefault.jpg" },
        high: { url: "https://i.ytimg.com/vi/x/hqdefault.jpg" },
        standard: { url: "https://i.ytimg.com/vi/x/sddefault.jpg" },
      },
    },
  });
  expect(thumbnailUrls(v)).toEqual({
    sm: "https://i.ytimg.com/vi/x/mqdefault.jpg",
    lg: "https://i.ytimg.com/vi/x/mqdefault.jpg",
  });
});

test("a hidden subscriber count stays hidden", () => {
  const channel = {
    id: "UC1",
    snippet: { title: "Tech Gameplay Indonesia" },
    statistics: { hiddenSubscriberCount: true, subscriberCount: "0", videoCount: "245", viewCount: "1234567" },
    contentDetails: { relatedPlaylists: { uploads: "UU1" } },
  };
  expect(channelSummary(channel, "@techgameplayindonesia")).toMatchObject({
    subscribers: null,
    videoCount: 245,
    url: "https://www.youtube.com/@techgameplayindonesia",
  });
});
