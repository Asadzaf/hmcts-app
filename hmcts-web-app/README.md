# HMCTS Web Application

This is the HMCTS Web Application.

## Getting Started

Follow the steps below to set up and run the application locally.

### Prerequisites

- Node.js installed on your system (version 22.12.0 was used if you are having trouble with others)
- npm (Node Package Manager)

### Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies by running:

  ```bash
  npm install
  ```

### Running the Application

To start the application in development mode, run:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

### Some notes

This was created with vite for simplicity and speed.

I have used the GOVUK Design System for frontend consistency.

There is a component folder to hold separate components, and a pages folder for the main pages that we will navigate through.

New tasks must have a due date and time in the future, as a past due date on a new task is almost always a typing mistake, and the due date can't be edited afterwards. Existing tasks that become overdue can still have their status updated. The API enforces the same rule.

I hope you enjoy !