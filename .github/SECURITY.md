# Security Policy

## Supported Versions

Security fixes are applied to the current release and the two most recent releases.

| Version | Status |
| - | - |
| v1.5.x | ✅ Active support |
| v1.4.0 | ⚠️ deprecated; acknowledged, no longer actively patched |
| < v1.3.x | ❌ Not supported |

As new versions are released, this table will be updated to reflect the current support window. Versions that fall outside the two-major-version window enter deprecated status and are acknowledged but no longer actively patched. Versions older than that are archived to cold storage. Retrieval of archived versions is available as a paid service - contact us at [support@aetherassembly.org](mailto:support@aetherassembly.org) for details.

## Reporting a Vulnerability

Please do not disclose security vulnerabilities in public issues.

Use GitHub private vulnerability reporting if enabled for this repository, or contact us through one of the following:

- **Email:** [support@aetherassembly.org](mailto:support@aetherassembly.org)
- **Contact form:** [https://forms.gle/T4i7GGzaT3HUrffm9](https://forms.gle/T4i7GGzaT3HUrffm9)
- **Aster (GitHub):** [@Aster1630](https://github.com/Aster1630)
- **Ollie (GitHub):** [@OllieMochi](https://github.com/olliemochi)

Please include in your report:

- A clear description of the issue
- Steps to reproduce
- Impact assessment
- Any suggested remediation or workaround

You can expect an initial acknowledgement within 7 days of receipt. After validation, the maintainers will work on a fix and coordinate disclosure timing as appropriate.

## Scope

MindTab is a browser extension with no backend of its own. Relevant security areas include:

- **Content script injection** - any issue where a malicious page could abuse MindTab's content scripts
- **Data leakage** - any case where user text or browsing data is sent somewhere it shouldn't be
- **XSS via DOM manipulation** - the extension inserts UI into pages; any injection via user content or external filter list data
- **Grammar server proxy** - if you're running the optional self-hosted server, report proxy-level issues here too

Issues with the LanguageTool server itself should be reported upstream to the [LanguageTool project](https://github.com/languagetool-org/languagetool).

## Out of scope

- Bugs that require physical access to the device
- Self-XSS (the user deliberately injecting into their own session)
- Issues in browser internals or the browser extension API itself

## Non-Security Issues

General bugs, feature requests, and compatibility issues should be reported through the normal issue tracker.
