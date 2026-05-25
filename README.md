# LogFlow API

A backend logging service built with Node.js, Express, and MongoDB. Developers can register, create applications, and send logs from their apps using the [LogFlow SDK](https://www.npmjs.com/package/hana-logflow-sdk).

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (httpOnly cookies)
- express-validator

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/HanaF02/logflow-api.git
cd logflow-api
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/logflow
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Run

```bash
# development
npm run dev

# production
npm start
```

---

## API Reference

### Auth — `/api/users`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Register a new developer | No |
| POST | `/api/users/login` | Login and receive JWT cookie | No |
| POST | `/api/users/logout` | Logout and clear cookie | No |

**Register body:**
```json
{
  "username": "yourname",
  "email": "you@example.com",
  "password": "123456"
}
```

**Login body:**
```json
{
  "email": "you@example.com",
  "password": "123456"
}
```

---

### Applications — `/api/applications`

All routes require authentication (JWT cookie).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all your applications |
| GET | `/api/applications/:name` | Get application by name |
| POST | `/api/applications` | Create a new application |
| DELETE | `/api/applications/:name` | Delete application and its logs |

**Create body:**
```json
{
  "name": "my-app-name"
}
```

> Application names must be unique and cannot contain spaces.

---

### Logs — `/api/applications/:name/logs`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/applications/:name/logs` | Get logs (paginated) | JWT cookie |
| POST | `/api/applications/:name/logs` | Send a log | API Key header |

**POST headers:**
```
x-api-key: your-api-key
```

**POST body:**
```json
{
  "message": "User signed up",
  "level": "INFO"
}
```

> Level must be one of: `INFO`, `WARN`, `ERROR`

**GET query params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Results per page |
| `level` | string | — | Filter by level |
| `sort` | string | createdAt | Sort field |
| `order` | string | desc | `asc` or `desc` |
| `search` | string | — | Search in message |

---

## Models

### Developer
| Field | Type | Description |
|-------|------|-------------|
| username | String | Unique, min 3 chars |
| email | String | Unique |
| password | String | Hashed with bcrypt |
| apiKey | String | Auto-generated UUID |

### Application
| Field | Type | Description |
|-------|------|-------------|
| name | String | Unique, no spaces |
| developer | ObjectId | Ref to Developer |
| createdAt | Date | Auto |

### Log
| Field | Type | Description |
|-------|------|-------------|
| message | String | Log message |
| level | String | INFO / WARN / ERROR |
| count | Number | Times this log occurred |
| application | ObjectId | Ref to Application |
| createdAt | Date | First occurrence |
| updatedAt | Date | Last occurrence |

---

## Related

- [LogFlow Dashboard](https://github.com/HanaF02/LogFlow)
- [LogFlow SDK](https://github.com/HanaF02/logflow-sdk) — [npm](https://www.npmjs.com/package/hana-logflow-sdk)
