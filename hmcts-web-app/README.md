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

Design choices such as 100 years prior have been made with consideration that is a task management system for caseworkers, so to allow for long lengths (but not too long), I opted for 100 years.

I hope you enjoy !