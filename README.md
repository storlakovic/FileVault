# FileVault

FileVault is a small self-hosted file management application that allows users to create an account and manage their own files through a web interface.

Users can upload files, view their stored files, download them, and delete them again. Authentication ensures that every user can only access their own files.

This project was created as a small side project to refresh my knowledge of full-stack development, Docker, authentication, databases, and API design. While I was already familiar with TypeScript, React, Docker, and JWT authentication, Python and FastAPI were new to me.

AI tools were used throughout the project for guidance, debugging, explanations, and code reviews. The main purpose of FileVault was learning, experimenting, and gaining practical experience rather than building a production-ready storage platform.

---

## Features

* User registration and login
* JWT-based authentication
* Uploading and listing files
* Downloading and deleting files
* Separate file storage for each user
* Persistent storage through Docker volumes
* Automated backend tests

---

## Tech Stack

* **Infrastructure:** Docker, Docker Compose, Nginx
* **Frontend:** React, TypeScript
* **Backend:** Python, FastAPI
* **Database:** PostgreSQL
* **Testing:** Pytest, GitHub Actions
