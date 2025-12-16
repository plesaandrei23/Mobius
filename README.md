Objective

    Developing a web application which provides bug management for an application.

Description
    The application must ensure bug-fixing related communication between team members of an application.

    The application is built on a Single Page Application architecture and is accessible from the browser on the desktop, mobile devices or tablets (depending on user preference).


(Minimal) functionality

    As a student i can connect to the application with an account based on an email address.

    As a student member of a project team (PM) i can register a software project in the bug tracking application, specifying a description, the repository where the project is hosted and the project team.

    As a student that is not a member of the project team i can register as a tester (TST) for the project

    As a TST i can register a bug in the bug tracking application. The bug is registered with a severity, a description and a link to the commit that has been tested.

    As a PM i can see the registered bugs for the projects i participate in.

    As a PM i can allocate fixing a bug to myself. Only one PM can have a bug allocated at a particular time.

    As a PM, after solving a bug, i can add a status to the solution with a link to the commit through which the bug was fixed.

    The application has  a permission system. A PM can add and modify a project, can change the status of a bug. A TST can add a bug.



## Roles & Permissions

The application distinguishes between two main roles within a project:

1.  **MP (Membru Proiect / Project Member/Manager)**:
    -   **Who they are**: The creator of a project or users added as members.
    -   **Capabilities**:
        -   Manage project details.
        -   Add other members (MP) or testers (TST).
        -   View all bugs.
        -   **Manage Bugs**: Can change bug status, priority, severity, and allocate bugs to themselves.
        -   Provide solutions (commit links) when resolving bugs.

2.  **TST (Tester)**:
    -   **Who they are**: Users who join a project explicitly to test it.
    -   **Capabilities**:
        -   View project details.
        -   **Report Bugs**: Create new bug reports with descriptions and severity.
        -   Cannot modify bug status or project details.

## Version History

### V0
-   We chose to dockerize our solution as to be able to replicate it on any device.
-   We base our solution on a simple REST architecture, presented in the 8th seminar.
-   We created models for all the tables we need in the database.
-   We created the database and all the links and the connections needed in the index in models.
-   Basic frontend.

### V1.1
-   We created controllers for authentication.
-   We created the routes for the authentication process made thru post request thru either register or login (tested it using postman).

#### API Endpoints Definition (V1.1 Scope)
```javascript
//TODO GET /api/projects (who: authenticated users, what: return all projects where the user is MP or TST) //done
//TODO POST /api/projects (who: authenticated users (that will become MP on the project), what: created a new project and adds current user as MP) //done

//TODO GET    /api/projects/:projectId            (who: MP or TST on that project, what: return project details) //done
//TODO PATCH  /api/projects/:projectId            (who: MP on that project, what: update project info) //done

//TODO POST   /api/projects/:projectId/members    (who: existing MP/admin, what: add a user as MP on the project) //done
//TODO DELETE /api/projects/:projectId/members/:userId (who: existing MP/admin, what: remove a user from project members) //done

//TODO POST   /api/projects/:projectId/testers/self   (who: authenticated user not MP there, what: add current user as TST on the project) //done
//TODO POST   /api/projects/:projectId/testers        (optional – who: MP/admin, what: add another user as TST on the project) //done
//TODO DELETE /api/projects/:projectId/testers/:userId (optional – who: MP/admin, what: remove a user from project testers) //done

//TODO GET    /api/projects/:projectId/bugs       (who: MP or TST on that project, what: list all bugs for the project) //done
//TODO POST   /api/projects/:projectId/bugs       (who: TST on that project, what: create a new bug for the project) //done
```

### V1.2 (Current)
-   **Core Functionality**:
    -   Implemented Project Discovery: Users can view all projects and join as Testers.
    -   Implemented Role-Based Access Control: Validated Member (MP) vs Tester (TST) permissions.
    -   Implemented Bug Management: 'Assign to Me' flow for MPs, status updates, and commit linking.
-   **UI/UX Improvements**:
    -   **Card Layout Fix**: Resolved card overlapping issues in `ProjectList` using CSS Grid and `box-sizing: border-box`.
    -   Responsiveness: Improved layout adaptability for different screen sizes.
-   **Compliance**:
    -   Verified all minimal functionality requirements: Registration, Project Creation (MP), Tester Joining (TST), Bug Reporting, and Bug Resolution flows.
-   **Admin Features**:
    -   **Admin Dashboard**: Implemented a dashboard for Admins (`admin@admin.com`) to view and delete users and projects.
    -   **Project Deletion**: Enabled deletion for Project Owners and Admins directly from the UI.
    -   **User Management**: Admins can now oversee and manage the user base.

### V1.3 (Planned Proposals)
-   **Enhanced Collaboration**:
    -   Add comment system for bugs to facilitate discussion between MPs and TSTs.
-   **Dashboard & Analytics**:
    -   Visual statistics: Bugs per project, Resolution rate, Average time to fix.
-   **Notifications**:
    -   Email or in-app notifications when a bug is assigned or verified.
-   **Search & Filter**:
    -   Search projects by name/tech stack.
    -   Filter bugs by severity/status.
-   **User Profile**:
    -   Avatar upload and bio section.

