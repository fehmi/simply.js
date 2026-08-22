# REPL API

> Placeholder — the new REPL backend endpoints are planned but not yet implemented. All URLs, parameters, and response shapes below are **TBD** and will be filled in as development lands.

The REPL API gives AI agents programmatic access to examples saved via the [REPL](/#/playground) playground. Every response is designed to be agent-friendly: JSON bodies, `curl`-callable, and including a browser-ready URL that agentic browser tools can open directly.

## Base URL

```
https://simply.js.org/api/repl   <!-- TBD -->
```

## Common Response Format (Planned)

All successful responses return JSON with a consistent envelope:

```json
{
  "success": true,
  "data": { },
  "meta": { }
}
```

Errors return a consistent shape with an HTTP status code:

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "human readable message"
  }
}
```

> TODO: Finalize and document status codes (200/201/400/404/500), CORS policy, and any rate limiting.

---

## 1. List Examples (with pagination)

List saved REPL examples, newest first.

**Endpoint** (TBD):

```
GET /api/repl/examples
```

**Query parameters (planned):**

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | number | `1` | Page number (1-based). |
| `limit` | number | `20` | Number of items per page (max `TBD`). |
| `sort` | string | `newest` | `newest` or `oldest`. |

**Response (planned):**

```json
{
  "success": true,
  "data": {
    "examples": [
      {
        "id": "string",
        "title": "string",
        "files": [ "index.html" ],
        "createdAt": "ISO-8601",
        "replUrl": "https://simply.js.org/#/playground?<id>",
        "browserUrl": "https://simply.js.org/#/playground?<id>"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 123,
    "totalPages": 7
  }
}
```

**Example request (planned):**

```bash
curl "https://simply.js.org/api/repl/examples?page=1&limit=20"
```

> TODO: Define the exact fields returned per example (id, title, file names, timestamps, URLs).

---

## 2. Search Examples by Keyword

Search saved examples whose title or file contents match a keyword.

**Endpoint** (TBD):

```
GET /api/repl/examples/search
```

**Query parameters (planned):**

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `q` | string | yes | Keyword to search for. |
| `page` | number | no | Page number (default `1`). |
| `limit` | number | no | Items per page (default `20`). |

**Response (planned):** same shape as [List Examples](#1-list-examples-with-pagination), with `examples` filtered to matches.

**Example request (planned):**

```bash
curl "https://simply.js.org/api/repl/examples/search?q=router"
```

> TODO: Decide whether search is case-insensitive, whether it covers file contents or only titles, and which fields are highlighted.

---

## 3. Save a New Example

Create a new REPL example and get back its URLs.

**Endpoint** (TBD):

```
POST /api/repl/examples
```

**Request — `application/json` body (planned):**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | yes | Example title. |
| `files` | array | yes | Array of files, each with `filename` and `content`. |
| `files[].filename` | string | yes | e.g. `index.html`. |
| `files[].content` | string | yes | Raw file content. |
| `selected` | boolean | no | Which file is selected on load (default `false`). |

**Response (planned):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "replUrl": "https://simply.js.org/#/playground?<id>",
    "browserUrl": "https://simply.js.org/#/playground?<id>"
  }
}
```

The response includes **two URLs for agentic use:**

| Field | Purpose |
| --- | --- |
| `replUrl` | The REPL page URL where the example is loaded in the editor. |
| `browserUrl` | A browser-ready URL for **agentic browser tools** — open this to render the example and inspect it. |

**Example request (planned):**

```bash
curl -X POST "https://simply.js.org/api/repl/examples" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hello World",
    "files": [
      { "filename": "index.html", "content": "<h1>Hello</h1>", "selected": true }
    ]
  }'
```

> TODO: Decide whether `replUrl` and `browserUrl` differ, and confirm the response `Content-Type` and HTTP status (`201 Created`).

---

## 4. Read an Example by ID

Fetch a single saved example by its id.

**Endpoint** (TBD):

```
GET /api/repl/examples/{id}
```

**Path parameters (planned):**

| Param | Type | Description |
| --- | --- | --- |
| `id` | string | The example id returned by the save endpoint or list. |

**Response (planned):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "files": [
      {
        "filename": "index.html",
        "content": "<h1>Hello</h1>",
        "selected": true
      }
    ],
    "createdAt": "ISO-8601",
    "replUrl": "https://simply.js.org/#/playground?<id>",
    "browserUrl": "https://simply.js.org/#/playground?<id>"
  }
}
```

**Errors (planned):** `404` with `error.code: "not_found"` if the id does not exist.

**Example request (planned):**

```bash
curl "https://simply.js.org/api/repl/examples/<id>"
```

---

## Suggested Additions (nice-to-have)

These are extra capabilities that would make the API even more useful for AI agents — not yet confirmed:

- **Delete endpoint** — `DELETE /api/repl/examples/{id}` to clean up test examples.
- **Update endpoint** — `PATCH /api/repl/examples/{id}` to edit an existing example.
- **Batch fetch** — `GET /api/repl/examples?ids=a,b,c` to fetch several examples in one request.
- **Rendered HTML preview** — a URL that returns the compiled HTML so agents can verify output without a browser.
- **Content-Type negotiation** — allow `Accept: application/json` for JSON and optional raw text responses.
- **Auth / rate limiting** — if the public API needs protection, document the mechanism (API key, IP limit) here.
- **CORS policy** — document allowed origins so browser-based agents can call the API client-side.

---

> TODO: Replace all `TBD` values above with the finalized endpoint URLs, parameter names, and response shapes once the REPL backend is implemented.
