export type Nip56ReportType =
  | "nudity"
  | "malware"
  | "profanity"
  | "illegal"
  | "spam"
  | "impersonation"
  | "other";

export type Nip56ProfileReportTag = ["p", string, Nip56ReportType];
export type Nip56ListingEventReportTag = ["e", string, Nip56ReportType];
export type Nip56ListingProfileTag = ["p", string];
export type Nip56ListingReportTags = [
  Nip56ListingEventReportTag,
  Nip56ListingProfileTag,
];

export const buildProfileReportTags = (
  pubkey: string,
  reason: Nip56ReportType
): [Nip56ProfileReportTag] => [["p", pubkey, reason]];

export const buildListingReportTags = (
  eventId: string,
  pubkey: string,
  reason: Nip56ReportType
): Nip56ListingReportTags => [
  ["e", eventId, reason],
  ["p", pubkey],
];
