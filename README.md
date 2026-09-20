# 🌾 Digital Subsidy Management System

[![Live Demo](https://img.shields.io/badge/Live_Demo-Railway-00C7B7?style=for-the-badge&logo=railway&logoColor=white)](https://digital-subsidy-production.up.railway.app)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An enterprise-grade, cloud-deployed Spring Boot web application designed for transparent, end-to-end administration of government subsidy schemes. It empowers citizens to discover and apply for eligible subsidies while enabling multi-tier verification workflows by Field Officers, District Officers, and System Administrators.

---

## 🌐 Live Production Deployment

| Service | Link |
| :--- | :--- |
| 🚀 **Live Application** | [https://digital-subsidy-production.up.railway.app](https://digital-subsidy-production.up.railway.app) |
| 🔐 **User / Citizen Login** | [https://digital-subsidy-production.up.railway.app/login.html](https://digital-subsidy-production.up.railway.app/login.html) |
| 📝 **Citizen Registration** | [https://digital-subsidy-production.up.railway.app/register.html](https://digital-subsidy-production.up.railway.app/register.html) |
| 🏢 **Staff & Officer Login** | [https://digital-subsidy-production.up.railway.app/staff-login.html](https://digital-subsidy-production.up.railway.app/staff-login.html) |
| 📋 **Eligible Schemes Directory** | [https://digital-subsidy-production.up.railway.app/schemes.html](https://digital-subsidy-production.up.railway.app/schemes.html) |

---

## 🛠️ Technology Stack

| Layer | Technology & Tools |
| :--- | :--- |
| **Backend Framework** | Spring Boot 3.4.3 (REST APIs, MVC, HikariCP) |
| **Language & Runtime** | Java 21 LTS |
| **Security & Auth** | Spring Security 6, BCrypt Password Hashing, Session Management |
| **ORM & Database** | Hibernate 6, Spring Data JPA, MySQL 8.0 |
| **Frontend** | HTML5, Modern CSS3, Vanilla JavaScript (ES6+), Responsive UI |
| **Notifications** | Spring Mail with Gmail SMTP (Automated Status Alerts) |
| **Build & Tooling** | Gradle 9.5.1 Wrapper |
| **Containerization** | Docker (Multi-stage Eclipse-Temurin JDK/JRE) |
| **Cloud Hosting** | Railway Cloud Platform (Automated CI/CD) |

---

## ✨ Key Modules & Features

### 👤 Citizen Portal
- **User Authentication**: Secure registration and login with encrypted password storage.
- **Scheme Discovery**: Browse government schemes categorized by sector, criteria, and eligibility slabs.
- **Online Application**: Submit subsidy requests with bank details and document verification uploads (up to 100MB).
- **Application Tracking**: Real-time status tracker (Submitted $\rightarrow$ Field Verification $\rightarrow$ District Approval $\rightarrow$ Disbursed).

### 👮 Multi-Level Verification Workflow
- **Field Officer Dashboard**: Perform on-ground eligibility inspections and document validations.
- **District Officer Dashboard**: Review field reports, assess compliance milestones, and approve/reject grants.
- **Audit Trails**: Immutable history tracking for every stage of verification.

### ⚙️ Administrator & Analytics Console
- **Scheme Management**: Create, update, and activate subsidy policies and installment plans.
- **Regional Allocations**: Manage fund distribution by state, district, and regional caps.
- **Disbursement Engine**: Track payment processing, milestone achievements, and banking clearances.
- **Analytics Dashboard**: Real-time visual metrics on applied subsidies, budgets, and beneficiary demographics.

---

## 📁 Architecture & Project Structure

```
DigitalSubsidy/
├── .github/                      # CI/CD Workflows
├── gradle/wrapper/               # Gradle Wrapper (v9.5.1)
├── src/
│   ├── main/
│   │   ├── java/com/example/DigitalSubsidy/
│   │   │   ├── Config/           # SecurityConfig, CORS, PasswordEncoder
│   │   │   ├── controller/       # REST Controllers (Auth, Applications, Schemes, etc.)
│   │   │   ├── dto/              # Request & Response Data Transfer Objects
│   │   │   ├── entity/           # JPA Entities (AuthUser, Application, Scheme, etc.)
│   │   │   ├── repository/       # Spring Data Repositories
│   │   │   └── service/          # Business Logic & Transactional Services
│   │   └── resources/
│   │       ├── static/           # HTML5 UI, CSS Stylesheets, JavaScript Clients
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   ├── index.html
│   │       │   ├── login.html
│   │       │   └── register.html
│   │       └── application.properties # Spring Boot environment mapping
├── Dockerfile                    # Multi-stage optimized Docker build
├── build.gradle                  # Build dependencies & plugins
├── LICENSE                       # MIT License
└── README.md                     # Documentation & Live Demo
```

---

## 🏃 Running Locally

### Prerequisites
- **JDK 21** or later installed
- **MySQL 8.0+** running locally
- Git

### Quick Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gopikrishna-04/Digital-Subsidy.git
   cd Digital-Subsidy
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory (or use default properties):
   ```properties
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=subsidy
   DB_USERNAME=root
   DB_PASSWORD=your_password
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   PORT=8080
   ```

3. **Initialize MySQL Database:**
   ```sql
   CREATE DATABASE subsidy;
   ```

4. **Build and Run:**
   ```bash
   # On Windows:
   gradlew.bat bootRun

   # On Linux/macOS:
   ./gradlew bootRun
   ```

5. **Access Application:**
   Open your browser and navigate to: `http://localhost:8080`

---

## 🐳 Docker Deployment

You can build and run the entire application container with Docker:

```bash
# Build Docker image
docker build -t digital-subsidy .

# Run Docker container
docker run -d -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_NAME=subsidy \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=your_password \
  --name digital-subsidy-app digital-subsidy
```

---

## 🔒 Security Best Practices

- **Zero Hardcoded Secrets**: Sensitive credentials (passwords, SMTP keys) are externalized via environment variables.
- **CORS Configured**: Cross-Origin Resource Sharing enables secure communication across deployment domains.
- **Password Protection**: BCrypt hashing applied to all stored user passwords.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
