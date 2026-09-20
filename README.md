# 🌾 Digital Subsidy Management System

A Spring Boot web application for managing government digital subsidies — allowing citizens to apply for schemes, and officers/admins to verify and process applications.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 4.1, Java 21+ |
| Security | Spring Security |
| Database | MySQL (JPA/Hibernate) |
| Frontend | HTML5, CSS3, JavaScript |
| Mail | Spring Mail (Gmail SMTP) |
| Build | Gradle |

## ✨ Features

- **Citizen Portal** – Register, apply for schemes, track applications
- **Officer Dashboard** – Field officers and district officers review applications
- **Admin Panel** – Manage users, schemes, payments, regional allocations
- **File Uploads** – Document submission support (up to 100MB)
- **Email Notifications** – Automated status update emails
- **Analytics** – Application and payment analytics dashboard

## 🏃 Running Locally

### Prerequisites
- Java 21+
- MySQL 8+
- Gradle (or use the included `./gradlew`)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Digital-Subsidy.git
   cd Digital-Subsidy
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MySQL credentials and Gmail app password
   ```

3. **Create the MySQL database**
   ```sql
   CREATE DATABASE subsidy;
   ```

4. **Run the application**
   ```bash
   ./gradlew bootRun
   ```

5. **Open in browser**: [http://localhost:8080](http://localhost:8080)

## 🐳 Running with Docker

```bash
docker build -t digital-subsidy .
docker run -p 8080:8080 \
  -e DB_URL="jdbc:mysql://host.docker.internal:3306/subsidy?..." \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=yourpassword \
  -e MAIL_USERNAME=your@gmail.com \
  -e MAIL_PASSWORD=yourapppassword \
  digital-subsidy
```

## ☁️ Deploy to Railway / Render

1. Push this repo to GitHub
2. On [Railway](https://railway.app) or [Render](https://render.com), create a new project from this GitHub repo
3. Add a **MySQL** plugin/service
4. Set the environment variables in the platform's dashboard:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`
5. Deploy! The `Dockerfile` will be auto-detected.

## 📁 Project Structure

```
DigitalSubsidy/
├── src/
│   ├── main/
│   │   ├── java/com/example/DigitalSubsidy/
│   │   │   ├── Config/        # Security & app configuration
│   │   │   ├── controller/    # REST controllers
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── entity/        # JPA entities
│   │   │   ├── repository/    # Spring Data repositories
│   │   │   └── service/       # Business logic
│   │   └── resources/
│   │       ├── static/        # HTML, CSS, JS frontend
│   │       └── application.properties
│   └── test/
├── Dockerfile
├── .env.example
└── build.gradle
```

## 🔒 Security Notes

- Never commit `.env` files — use `.env.example` as a template
- Use Gmail **App Passwords** (not your account password) for SMTP
- Change the default DB password in production

## 📄 License

This project is for educational purposes.
