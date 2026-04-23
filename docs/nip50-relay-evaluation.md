# NIP-50 Relay Evaluation

This note evaluates the default Shopstr relay list as candidates for future
NIP-50 listing search work.

## Method

- Date run: 2026-04-23T08:22:11Z
- Relay list source: `getDefaultRelays()` in `utils/nostr/nostr-helper-functions.ts`
- NIP-11 check: HTTP request to each relay with `Accept: application/nostr+json`
- Search probe: `kinds: [30402]`, `search: <query>`, `limit: 20`
- Probe queries: `bitcoin`, `shirt`, `coffee`
- Result checks: raw events returned, parsable listing count, deduped listing count, and whether parsed listings matched the local search predicate by title, summary, or category

NIP-50 is optional. Per the NIP-50 spec, clients should use NIP-11
`supported_nips` to discover relays that advertise search support and should be
prepared to filter or ignore low-precision results.

## Results

| Relay                    | Advertises NIP-50                                                    | Search probe behavior                                                                                | Candidate for NIP-50 listing tests                                |
| ------------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `wss://relay.damus.io`   | No. NIP-11 returned `[1, 2, 4, 9, 11, 22, 28, 40, 70, 77]`.          | Returned `0` events for all three queries. Relay emitted `ERROR: bad req: unrecognised filter item`. | No. Good baseline for unsupported-search behavior.                |
| `wss://nos.lol`          | No. NIP-11 returned `[1, 2, 4, 9, 11, 28, 40, 45, 70]`.              | Returned `0` events for all three queries. No usable listing search results were observed.           | No. Useful as a default relay, but not as a NIP-50 search target. |
| `wss://purplepag.es`     | No. NIP-11 returned `[1, 11, 42, 70, 86, 51, 9]`.                    | Returned `0` events for all three queries. No usable listing search results were observed.           | No. It is profile-oriented and does not advertise search.         |
| `wss://relay.primal.net` | No. NIP-11 returned `[1, 2, 4, 9, 11, 22, 28, 40, 70, 77]`.          | Returned `0` events for all three queries. Relay emitted `ERROR: bad req: unrecognised filter item`. | No. Good baseline for unsupported-search behavior.                |
| `wss://relay.nostr.band` | Unknown from this run. The NIP-11 request timed out after 7 seconds. | Returned `0` events for all three queries. No usable listing search results were observed.           | Weak candidate until NIP-11/search responses are reliable.        |

## Recommendation

None of Shopstr's currently configured default relays were strong NIP-50
listing-search candidates in this run. The future NIP-50 implementation should
therefore treat default relays as fallback/baseline relays and should support a
small allowlisted set of explicit search relays that advertise NIP-50 through
NIP-11.

For the project implementation, the safest search flow is:

- detect NIP-50 support from relay information documents when available
- send `kinds: [30402]` with `search` only to search-capable relays by default
- dedupe results by `pubkey + d` tag, keeping the newest event
- parse results with the canonical listing parser
- apply the local listing predicate as a relevance/safety check before merging results into the marketplace UI

This keeps current client-side filtering useful as a correctness baseline while
allowing NIP-50 search to improve discovery when capable relays are available.
