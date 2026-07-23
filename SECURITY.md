# Security Policy

LMTokenCook handles source files and documents that may contain credentials, personal data, or confidential client information.

## Reporting a vulnerability

Please use GitHub's private **Report a vulnerability** option for this repository. Do not post credentials, private source material, generated chunks, or proof-of-concept data in a public issue.

Include the affected commit, impact, safe reproduction steps, and any suggested mitigation. We will acknowledge a well-formed report as capacity allows; this open-source project does not promise a specific response or remediation deadline.

## Privacy boundary

The primary React workflow processes selected files in the browser. Generated chunks remain sensitive if their source was sensitive. Browser-local processing does not make it appropriate to upload private output to an unauthorized AI service.

## Supported versions

Security fixes target the latest commit on the default branch. Older snapshots and third-party deployments are not supported.
