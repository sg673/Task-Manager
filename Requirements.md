# Task Manager Application Requirements

## Core Requirements

### User Authentication
- Register, Login, Logout functionality
- Session-based authentication
- Password hashing for security
- User profile management

### Task Management (CRUD)
- Create, Read, Update, Delete tasks
- Task properties:
  - Title
  - Description
  - Due date
  - Priority (low, medium, high, critical)
  - Status (ToDo, Complete)

### Project Organization
- Group tasks by user-created projects
- Assign tasks to specific projects
- Rename or delete entire projects/groups
- Task filtering by project

### UI Components
- Task list view (sortable/filterable)
- Task detail modal/editor
- Kanban board with drag and drop functionality
- Header navigation
- User profile page
- Responsive design for mobile and desktop

## Implementation Steps

1. **Project Setup**
   - Initialize React application with TypeScript
   - Set up folder structure (components, pages, services, types)
   - Configure routing with React Router
   - Install necessary dependencies (Tailwind CSS, React Hot Toast)

2. **Backend Development**
   - Create server with Express.js
   - Set up database (MongoDB/SQL)
   - Implement authentication endpoints (register, login, logout)
   - Create API endpoints for tasks and projects

3. **Frontend Authentication**
   - Build registration form
   - Create login page
   - Implement session management with useAuth hook
   - Add logout functionality
   - Create protected routes

4. **Task Management Implementation**
   - Develop task creation interface
   - Build task listing component with sorting options
   - Create task editing modal
   - Implement task deletion with confirmation
   - Add task completion toggle

5. **Project Organization Features**
   - Create project creation interface
   - Develop project management views
   - Implement task-to-project assignment
   - Add project filtering functionality

6. **UI Refinement**
   - Implement responsive design for mobile and desktop
   - Add sorting and filtering to task lists
   - Create Kanban board view
   - Polish user interface and experience

7. **Testing & Deployment**
   - Write unit and integration tests
   - Perform user acceptance testing
   - Deploy application
   - Set up CI/CD pipeline

## Current Todo List

- [ ] Complete task properties implementation
  - [x] Add due date functionality to TaskForm
  - [ ] Implement status toggling (ToDo/Complete) in TaskCard
  - [ ] Add task completion functionality

- [x] Implement authentication system
  - [x] Complete login.tsx page
  - [x] Complete register.tsx page
  - [x] Implement useAuth.ts hook functionality
  - [x] Connect logout button in navbar.tsx
  - [x] Set up protectedRoute.tsx component

- [ ] Develop project organization features
  - [ ] Complete project.tsx page
  - [ ] Create project creation interface
  - [ ] Implement task assignment to projects
  - [ ] Add projectId field to task creation/editing

- [ ] Enhance API service
  - [ ] Replace mock API with real backend calls
  - [ ] Implement error handling for API requests
  - [ ] Add authentication headers to requests

- [ ] Create sidebar component
  - [ ] List projects in sidebar
  - [ ] Add project filtering functionality
  - [ ] Implement collapsible sidebar for mobile

- [ ] Implement Kanban board view
  - [ ] Create drag and drop functionality
  - [ ] Add status columns (Todo, In Progress, Complete)
  - [ ] Enable task status updates via drag and drop

- [ ] Add user profile page
  - [x] Create profile settings interface
  - [ ] Implement password change functionality
  - [ ] Add user preferences

- [ ] Improve task management
  - [ ] Add search functionality
  - [x] Implement task filtering by due date
  - [ ] Add task tags/labels
  - [x] Create task priority visualization

- [x] Setup testing
  - [x] Add unit tests for components
  - [x] Create test data fixtures

- [ ] Beautification
  - [ ] Add spinners to loading screens

## Known Issues
 - task form priorities do not display correctly when on small screens
 - On task form, None highlights gray when another priority is highlighted