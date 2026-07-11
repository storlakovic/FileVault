# FileVault
A secure self-hosted file management platform for uploading, organizing, and sharing files.

# FileVault 🔒

FileVault is a secure, self-hosted file management platform designed for uploading, organizing, and safely sharing files. Built with a strong focus on security, containerization, and modern deployment practices.

---

## 🚀 Features

* **Secure Upload & Download:** Safe handling of file streams with restricted permissions.
* **User Management:** Secure authentication with robust password hashing.
* **Share Links:** Generate time-limited or encrypted links to share files securely.
* **Encryption:** Industry-standard encryption for files at rest.
* **Storage Management:** Clean dashboard to monitor used space and manage directory structures.

---

## 🛡️ Security Architecture

This project is built from the ground up with a multi-layered security approach:
1. **Network Security:** Nginx acts as a reverse proxy, enforcing HTTPS/SSL and masking backend architecture.
2. **Container Isolation:** Docker containers run under non-root users with minimal privileges.
3. **Data Security:** Environment variables hide sensitive database keys and encryption secrets away from the codebase.

---

## 🛠️ Tech Stack

* **Infrastructure:** Linux, Docker, Docker Compose, Nginx
* **Frontend:** React
* **Backend:** Python FastAPI
* **Database:** PostgreSQL (Alpine-based)

