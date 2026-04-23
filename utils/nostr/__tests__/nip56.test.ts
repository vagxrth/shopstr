import {
  buildListingReportTags,
  buildProfileReportTags,
  Nip56ReportType,
} from "../nip56";

describe("nip56 report tag helpers", () => {
  const pubkey =
    "1111111111111111111111111111111111111111111111111111111111111111";
  const eventId =
    "2222222222222222222222222222222222222222222222222222222222222222";

  const reportTypes: Nip56ReportType[] = [
    "nudity",
    "malware",
    "profanity",
    "illegal",
    "spam",
    "impersonation",
    "other",
  ];

  it("builds the exact profile report tag shape", () => {
    expect(buildProfileReportTags(pubkey, "spam")).toEqual([
      ["p", pubkey, "spam"],
    ]);
  });

  it("builds the exact listing report tag shape", () => {
    expect(buildListingReportTags(eventId, pubkey, "illegal")).toEqual([
      ["e", eventId, "illegal"],
      ["p", pubkey],
    ]);
  });

  it("attaches the listing report reason to the e tag, not the p tag", () => {
    const tags = buildListingReportTags(eventId, pubkey, "profanity");

    expect(tags[0]).toEqual(["e", eventId, "profanity"]);
    expect(tags[1]).toEqual(["p", pubkey]);
    expect(tags[1]).toHaveLength(2);
  });

  it("accepts every NIP-56 report type for profile reports", () => {
    for (const reportType of reportTypes) {
      expect(buildProfileReportTags(pubkey, reportType)).toEqual([
        ["p", pubkey, reportType],
      ]);
    }
  });

  it("accepts every NIP-56 report type for listing reports", () => {
    for (const reportType of reportTypes) {
      expect(buildListingReportTags(eventId, pubkey, reportType)).toEqual([
        ["e", eventId, reportType],
        ["p", pubkey],
      ]);
    }
  });
});
