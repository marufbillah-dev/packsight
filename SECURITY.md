# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in PackSight, please **do not** open a public GitHub issue.

Instead, report it privately by emailing the maintainer or using GitHub's private vulnerability reporting:

1. Go to the [Security tab](https://github.com/imarufbillah/packsight/security) of the repository
2. Click **"Report a vulnerability"**
3. Fill in the details

### What to include

- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

### What to expect

- Acknowledgement within **48 hours**
- A fix or mitigation plan within **7 days** for critical issues
- Credit in the changelog if you wish

## Scope

PackSight is a VS Code extension that runs npm CLI commands locally. It does not collect, transmit, or store any user data externally. The primary security concerns are:

- **Command injection** via package names passed to npm CLI
- **Malicious package names** in search results triggering unintended installs
- **Dependency vulnerabilities** in the extension itself (run found 0 vulnerabilities in the repo)

## Out of Scope

- Vulnerabilities in npm, Node.js, or VS Code itself
- Issues requiring physical access to the user machine
- Social engineering attacks
