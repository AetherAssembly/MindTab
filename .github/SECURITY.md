# Security Policy

## Supported Versions

Security fixes are applied to the current release and the two most recent releases.

| Version | Status |
| - | - |
| v1.1.0 | ✅ Active support |
| v1.1.0 | ✅ Active support |
| < v1.0.0 | ❌ Not supported |

As new versions are released, this table will be updated to reflect the current support window. Versions outside the support window are no longer actively patched.

---

## Reporting a Vulnerability

Please do not disclose security vulnerabilities in public issues.

Report vulnerabilities by opening a [GitHub Security Advisory](../../security/advisories/new) in this repository. This keeps the report private until a fix is released.

Include:

- A clear description of the vulnerability
- Steps to reproduce it
- The browser and extension version you tested on
- Any relevant screenshots or code snippets

You can expect an acknowledgement within a few days and a fix or status update within two weeks. If the issue is confirmed, a patched version will be released and the advisory will be published once users have had time to update.

---

## Scope

MindTab is a browser extension with no backend of its own. Relevant security areas include:

- **Content script injection** — any issue where a malicious page could abuse MindTab's content scripts
- **Data leakage** — any case where user text or browsing data is sent somewhere it shouldn't be
- **XSS via DOM manipulation** — the extension inserts UI into pages; any injection via user content or external filter list data
- **Grammar server proxy** — if you're running the optional self-hosted server, report proxy-level issues here too

Issues with the LanguageTool server itself should be reported upstream to the [LanguageTool project](https://github.com/languagetool-org/languagetool).

---

## Out of scope

- Bugs that require physical access to the device
- Self-XSS (the user deliberately injecting into their own session)
- Issues in browser internals or the browser extension API itself
