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


SOLUTION DEVELOPMENT

V0
-we choose to dockerize our solution as to be able to replicate it on any device
-we base our solution on a simple REST arhitecture, presented in the 8th seminar
-we created models for all the tables we need in the database
-we created the database and all the links and the connections needed in the index in models
-basic frontend

V1.1
-we created controllers for authentification
-we created the routes for the authentification process made thru post request thru either register or login (tested it using postman)

//TODO GET /api/projects (who: authenticated users, what: return all projects where the user is MP or TST)
//TODO POST /api/projects (who: authenticated users (that will become MP on the project), what: created a new project and adds current user as MP)

//TODO GET    /api/projects/:projectId            (who: MP or TST on that project, what: return project details)
//TODO PATCH  /api/projects/:projectId            (who: MP on that project, what: update project info)

//TODO POST   /api/projects/:projectId/members    (who: existing MP/admin, what: add a user as MP on the project)
//TODO DELETE /api/projects/:projectId/members/:userId (who: existing MP/admin, what: remove a user from project members)

//TODO POST   /api/projects/:projectId/testers/self   (who: authenticated user not MP there, what: add current user as TST on the project)
//TODO POST   /api/projects/:projectId/testers        (optional – who: MP/admin, what: add another user as TST on the project)
//TODO DELETE /api/projects/:projectId/testers/:userId (optional – who: MP/admin, what: remove a user from project testers)

//TODO GET    /api/projects/:projectId/bugs       (who: MP or TST on that project, what: list all bugs for the project)
//TODO POST   /api/projects/:projectId/bugs       (who: TST on that project, what: create a new bug for the project)

