# ideaForU

**ideaForU** is a web application designed to help users discover and share creative project ideas. It provides a platform for inspiration, collaboration, and innovation by connecting individuals seeking ideas with those willing to share their own.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [License](#license)

## Features

- **Idea Generation**: Generate creative project ideas using local Large Language Models (LLM).
- **Idea Cards**: Swipeable cards displaying ideas with detailed descriptions.
- **Interactive Swipe**: Accept or dismiss ideas by swiping right or left.
- **Saved Ideas**: Manage accepted ideas and request further elaboration or action plans.
- **Detailed Information**: Each idea includes a title, description, estimated budget, and estimated completion time.
- **Responsive Design**: Access the platform seamlessly on any device.

## Architecture

The application is divided into two main components:

### Frontend

- **Framework**: React
- **Styling**: Tailwind CSS
- **Key Features**:
  - Dynamic rendering of interactive idea cards.
  - Swipe-based interactions for idea acceptance or rejection.
  - API integration for communicating with backend.

### Backend

- **Framework**: Django
- **Database**: SQLite
- **Key Features**:
  - Processes user-generated prompts and queries local LLM.
  - RESTful API endpoints for idea management.
  - Handles data validation, serialization, and error management.


## Installation

To set up the project locally, follow these steps:

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/HayQacz/ideaForU.git
```

2. Navigate to the backend directory:
```bash
cd ideaForU/backend
```

3. Set up a virtual environment:
```bash
python -m venv env
source env/bin/activate  # Windows: `env\Scripts\activate`
```

4. Install backend dependencies:
```bash
pip install -r requirements.txt
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Start the backend server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend application:
```bash
npm run dev
```

The application will run at [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the MIT License.

