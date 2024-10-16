# Inspection Management System API Documentation

## Base URL
All API requests are made to: `http://localhost:5000/api`

## Authentication
Most endpoints require a valid JWT token in the request header:
```
Authorization: Bearer <token>
```

To obtain a token, use the login endpoint.

## Error Handling
All endpoints may return these error responses:
- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error

Error response body:
```json
{
  "message": "Error description"
}
```

## Endpoints

### User Management

#### Register User
- URL: `/users`
- Method: `POST`
- Auth Required: Yes (Admin only)
- Request Body:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "string" // "admin" or "inspector"
  }
  ```
- Success Response: 201 Created
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
  ```

#### Login
- URL: `/users/auth`
- Method: `POST`
- Auth Required: No
- Request Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
  ```
- Note: Sets HTTP-only cookie with JWT token

#### Logout
- URL: `/users/logout`
- Method: `POST`
- Auth Required: Yes
- Success Response: 200 OK
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- Note: Clears HTTP-only cookie with JWT token

#### Get User Profile
- URL: `/users/profile`
- Method: `GET`
- Auth Required: Yes
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
  ```

#### Update User Profile
- URL: `/users/profile`
- Method: `PUT`
- Auth Required: Yes
- Request Body:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string" // optional
  }
  ```
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
  ```

#### Get All Users
- URL: `/users`
- Method: `GET`
- Auth Required: Yes (Admin only)
- Success Response: 200 OK
  ```json
  [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  ]
  ```

#### Get User by ID
- URL: `/users/:id`
- Method: `GET`
- Auth Required: Yes (Admin only)
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
  ```

#### Update User
- URL: `/users/:id`
- Method: `PUT`
- Auth Required: Yes (Admin only)
- Request Body:
  ```json
  {
    "name": "string",
    "email": "string",
    "role": "string"
  }
  ```
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
  ```

#### Delete User
- URL: `/users/:id`
- Method: `DELETE`
- Auth Required: Yes (Admin only)
- Success Response: 200 OK
  ```json
  {
    "message": "User removed"
  }
  ```

### Collaborator Management

#### Create Collaborator
- URL: `/collaborators`
- Method: `POST`
- Auth Required: Yes (Admin only)
- Request Body:
  ```json
  {
    "fullName": "string",
    "employeeId": "string",
    "department": "string",
    "position": "string"
  }
  ```
- Success Response: 201 Created
  ```json
  {
    "_id": "string",
    "fullName": "string",
    "employeeId": "string",
    "department": "string",
    "position": "string",
    "assignedInspector": "string" // User ID
  }
  ```

#### Get All Collaborators
- URL: `/collaborators`
- Method: `GET`
- Auth Required: Yes
- Success Response: 200 OK
  ```json
  [
    {
      "_id": "string",
      "fullName": "string",
      "employeeId": "string",
      "department": "string",
      "position": "string",
      "assignedInspector": {
        "_id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ]
  ```

#### Get Collaborator by ID
- URL: `/collaborators/:id`
- Method: `GET`
- Auth Required: Yes
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "fullName": "string",
    "employeeId": "string",
    "department": "string",
    "position": "string",
    "assignedInspector": {
      "_id": "string",
      "name": "string",
      "email": "string"
    }
  }
  ```

#### Update Collaborator
- URL: `/collaborators/:id`
- Method: `PUT`
- Auth Required: Yes (Admin only)
- Request Body:
  ```json
  {
    "fullName": "string",
    "employeeId": "string",
    "department": "string",
    "position": "string",
    "assignedInspector": "string" // User ID
  }
  ```
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "fullName": "string",
    "employeeId": "string",
    "department": "string",
    "position": "string",
    "assignedInspector": "string" // User ID
  }
  ```

#### Delete Collaborator
- URL: `/collaborators/:id`
- Method: `DELETE`
- Auth Required: Yes (Admin only)
- Success Response: 200 OK
  ```json
  {
    "message": "Collaborator removed"
  }
  ```

### Line Management

#### Create Line
- URL: `/lines`
- Method: `POST`
- Auth Required: Yes (Admin only)
- Request Body:
  ```json
  {
    "trainNumber": "string",
    "dateTime": "string", // ISO 8601 format
    "firstStop": "string",
    "lastStop": "string",
    "collaborators": ["string"] // Array of Collaborator IDs
  }
  ```
- Success Response: 201 Created
  ```json
  {
    "_id": "string",
    "trainNumber": "string",
    "dateTime": "string",
    "firstStop": "string",
    "lastStop": "string",
    "collaborators": ["string"]
  }
  ```

#### Get All Lines
- URL: `/lines`
- Method: `GET`
- Auth Required: Yes
- Success Response: 200 OK
  ```json
  [
    {
      "_id": "string",
      "trainNumber": "string",
      "dateTime": "string",
      "firstStop": "string",
      "lastStop": "string",
      "collaborators": [
        {
          "_id": "string",
          "fullName": "string",
          "employeeId": "string"
        }
      ]
    }
  ]
  ```

#### Get Line by ID
- URL: `/lines/:id`
- Method: `GET`
- Auth Required: Yes
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "trainNumber": "string",
    "dateTime": "string",
    "firstStop": "string",
    "lastStop": "string",
    "collaborators": [
      {
        "_id": "string",
        "fullName": "string",
        "employeeId": "string"
      }
    ]
  }
  ```

#### Update Line
- URL: `/lines/:id`
- Method: `PUT`
- Auth Required: Yes (Admin only)
- Request Body:
  ```json
  {
    "trainNumber": "string",
    "dateTime": "string",
    "firstStop": "string",
    "lastStop": "string",
    "collaborators": ["string"]
  }
  ```
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "trainNumber": "string",
    "dateTime": "string",
    "firstStop": "string",
    "lastStop": "string",
    "collaborators": ["string"]
  }
  ```

#### Delete Line
- URL: `/lines/:id`
- Method: `DELETE`
- Auth Required: Yes (Admin only)
- Success Response: 200 OK
  ```json
  {
    "message": "Line removed"
  }
  ```

### Inspection Management

#### Create Inspection
- URL: `/inspections`
- Method: `POST`
- Auth Required: Yes (Inspector or Admin)
- Request Body:
  ```json
  {
    "collaborator": "string", // Collaborator ID
    "line": "string", // Line ID
    "plannedDateTime": "string" // ISO 8601 format
  }
  ```
- Success Response: 201 Created
  ```json
  {
    "_id": "string",
    "inspector": "string", // User ID
    "collaborator": "string",
    "line": "string",
    "status": "string",
    "plannedDateTime": "string",
    "rating": null
  }
  ```

#### Get All Inspections
- URL: `/inspections`
- Method: `GET`
- Auth Required: Yes
- Success Response: 200 OK
  ```json
  [
    {
      "_id": "string",
      "inspector": {
        "_id": "string",
        "name": "string",
        "email": "string"
      },
      "collaborator": {
        "_id": "string",
        "fullName": "string",
        "employeeId": "string"
      },
      "line": {
        "_id": "string",
        "trainNumber": "string"
      },
      "status": "string",
      "plannedDateTime": "string",
      "rating": null
    }
  ]
  ```

#### Get Inspection by ID
- URL: `/inspections/:id`
- Method: `GET`
- Auth Required: Yes
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "inspector": {
      "_id": "string",
      "name": "string",
      "email": "string"
    },
    "collaborator": {
      "_id": "string",
      "fullName": "string",
      "employeeId": "string"
    },
    "line": {
      "_id": "string",
      "trainNumber": "string"
    },
    "status": "string",
    "plannedDateTime": "string",
    "rating": null
  }
  ```

#### Update Inspection
- URL: `/inspections/:id`
- Method: `PUT`
- Auth Required: Yes (Inspector or Admin)
- Request Body:
  ```json
  {
    "status": "string",
    "plannedDateTime": "string",
    "rating": number
  }
  ```
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "inspector": "string",
    "collaborator": "string",
    "line": "string",
    "status": "string",
    "plannedDateTime": "string",
    "rating": number
  }
  ```

#### Delete Inspection
- URL: `/inspections/:id`
- Method: `DELETE`
- Auth Required: Yes (Admin only)
- Success Response: 200 OK
  ```json
  {
    "message": "Inspection removed"
  }
  ```

### Report Management

#### Create Report
- URL: `/reports`
- Method: `POST`
- Auth Required: Yes (Inspector only)
- Request Body:
  ```json
  {
    "inspection": "string", // Inspection ID
    "field1": "string",
    "field2": "string",
    "field3": "string"
  }
  ```
- Success Response: 201 Created
  ```json
  {
    "_id": "string",
    "inspection": "string",
    "field1": "string",
    "field2": "string",
    "field3": "string"
  }
  ```

#### Get All Reports
- URL: `/reports`
- Method: `GET`
- Auth Required: Yes
- Success Response: 200 OK
  ```json
  [
    {
      "_id": "string",
      "inspection": {
        "_id": "string",
        "inspector": {
          "_id": "string",
          "name": "string",
          "email": "string"
        },
        "collaborator": {
          "_id": "string",
          "fullName": "string",
          "employeeId": "string"
        },
        "line": {
          "_id": "string",
          "trainNumber": "string"
        }
      },
      "field1": "string",
      "field2": "string",
      "field3": "string"
    }
  ]
  ```

#### Get Report by ID
- URL: `/reports/:id`
- Method: `GET`
- Auth Required: Yes
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "inspection": {
      "_id": "string",
      "inspector": {
        "_id": "string",
        "name": "string",
        "email": "string"
      },
      "collaborator": {
        "_id": "string",
        "fullName": "string",
        "employeeId": "string"
      },
      "line": {
        "_id": "string",
        "trainNumber": "string"
      }
    },
    "field1": "string",
    "field2": "string",
    "field3": "string"
  }
  ```

#### Update Report
- URL: `/reports/:id`
- Method: `PUT`
- Auth Required: Yes (Inspector only)
- Request Body:
  ```json
  {
    "field1": "string",
    "field2": "string",
    "field3": "string"
  }
  ```
- Success Response: 200 OK
  ```json
  {
    "_id": "string",
    "inspection": "string",
    "field1": "string",
    "field2": "string",
    "field3": "string"
  }
  ```

#### Delete Report
- URL: `/reports/:id`
- Method: `DELETE`
- Auth Required: Yes (Admin only)
- Success Response: 200 OK
  ```json
  {
    "message": "Report removed"
  }
  ```

#### Get Reports by Inspector
- URL: `/reports/inspector`
- Method: `GET`
- Auth Required: Yes (Inspector only)
- Description: Retrieves all reports associated with the authenticated inspector.
- Success Response: 200 OK
  ```json
  [
    {
      "_id": "string",
      "inspection": {
        "_id": "string",
        "collaborator": {
          "_id": "string",
          "fullName": "string",
          "employeeId": "string"
        },
        "line": {
          "_id": "string",
          "trainNumber": "string"
        }
      },
      "field1": "string",
      "field2": "string",
      "field3": "string"
    }
  ]
  ```

## Additional Information

### Authentication Flow
1. Register a user account (admin only can create new users)
2. Login to receive a JWT token (stored in an HTTP-only cookie)
3. Include the JWT token in subsequent requests

### Rate Limiting
To prevent abuse, the API implements rate limiting. Excessive requests from a single IP address may be temporarily blocked.

### Pagination
For endpoints that return lists (e.g., Get All Users, Get All Reports), the API supports pagination:
- Use `?page=<number>&limit=<number>` query parameters
- Default: page=1, limit=10
- Example: `/api/reports?page=2&limit=20`

### Filtering and Sorting
Some list endpoints support filtering and sorting:
- Filtering: Use query parameters matching field names
  - Example: `/api/inspections?status=planned`
- Sorting: Use `sort` query parameter
  - Example: `/api/reports?sort=-createdAt` (descending order by creation date)

### Data Validation
- All input data is validated before processing
- Invalid data will result in a 400 Bad Request response with details about the validation errors

### Soft Delete
For some resources, a soft delete approach is used. This means that deleted items are marked as inactive rather than being permanently removed from the database.

### Webhook Support
The API supports webhooks for certain events (e.g., new inspection created, report submitted). To set up webhooks, contact the API administrator.

### API Versioning
The current version of the API is v1. The version is included in the base URL:
`http://localhost:5000/api/v1`

Future versions will be accessible at `/api/v2`, `/api/v3`, etc.

### Cross-Origin Resource Sharing (CORS)
CORS is enabled for this API. If you're accessing the API from a web browser, make sure your domain is whitelisted.

### API Keys
For increased security, some endpoints may require an API key in addition to authentication. Contact the API administrator to obtain an API key if required.

### Error Codes
In addition to standard HTTP status codes, the API may return specific error codes in the response body for more detailed error handling:
```json
{
  "message": "Error description",
  "code": "SPECIFIC_ERROR_CODE"
}
```

### Rate Limits
- Anonymous requests: 100 requests per hour
- Authenticated requests: 1000 requests per hour
- These limits may be adjusted based on your specific needs

### Caching
Responses from some endpoints may be cached to improve performance. Check the `Cache-Control` header in the response for caching information.

### Changelog
For updates and changes to the API, refer to the changelog available at:
`http://localhost:5000/api/v1/changelog`

### Support
For additional support or questions about the API, contact:
- Email: api-support@example.com
- Developer Portal: https://developer.example.com

Remember to replace placeholder URLs, email addresses, and other generic information with your actual support channels and resources.

