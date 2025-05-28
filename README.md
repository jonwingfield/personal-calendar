# Personal Calendar

A Next.js calendar application with drag-and-drop task management. Perfect for personal use without requiring authentication.

## Features

- **Month View Calendar**: Navigate through months with a clean, intuitive interface
- **Task Management**: Add, edit, and delete tasks with ease
- **Drag & Drop**: Reschedule tasks by dragging them to different days
- **Categories**: Organize tasks with color-coded categories (Work, Personal, Health, Shopping, Social, Other)
- **SQLite Database**: Local data storage with no external dependencies
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd personal-calendar
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Deployment

#### Option 1: Using Docker Compose (Recommended)

1. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. Access the application at [http://localhost:3000](http://localhost:3000)

3. To stop the application:
   ```bash
   docker-compose down
   ```

#### Option 2: Using Docker directly

1. Build the Docker image:
   ```bash
   docker build -t personal-calendar .
   ```

2. Run the container with data persistence:
   ```bash
   docker run -d \
     --name personal-calendar \
     -p 3000:3000 \
     -v calendar-data:/app/data \
     personal-calendar
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

#### Option 3: Using the build script

1. Run the build script:
   ```bash
   ./build-docker.sh
   ```

2. Follow the instructions provided by the script

### Docker Notes

- **Data Persistence**: The SQLite database is stored in a Docker volume (`calendar-data`) to persist data between container restarts
- **Port**: The application runs on port 3000 inside the container and is mapped to port 3000 on your host
- **Environment**: The Docker container runs in production mode for optimal performance

## Usage

### Adding Tasks
- Click the "+" button on any day to add a new task
- Fill in the title, description (optional), and select a category
- Click "Add" to save the task

### Editing Tasks
- Hover over a task and click the edit icon
- Modify the title, description, or category
- Click "Save" to update the task

### Deleting Tasks
- Hover over a task and click the trash icon
- The task will be permanently deleted

### Rescheduling Tasks
- Click and drag any task to a different day
- The task will be automatically moved to the new date

### Navigation
- Use the arrow buttons to navigate between months
- Click "Today" to jump to the current month
- The current day is highlighted in blue

## Categories

Tasks are color-coded by category:
- **Work**: Blue
- **Personal**: Green  
- **Health**: Red
- **Shopping**: Purple
- **Social**: Yellow
- **Other**: Gray

## Database

The application uses SQLite for local data storage. The database file is automatically created in the `data/` directory when you first run the application.

### Data Backup (Docker)

To backup your data when using Docker:

```bash
# Create a backup
docker run --rm -v calendar-data:/data -v $(pwd):/backup alpine tar czf /backup/calendar-backup.tar.gz -C /data .

# Restore from backup
docker run --rm -v calendar-data:/data -v $(pwd):/backup alpine tar xzf /backup/calendar-backup.tar.gz -C /data
```

## Building for Production

### Local Build
```bash
npm run build
npm start
```

### Docker Build
```bash
docker build -t personal-calendar .
```

## Technology Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **@dnd-kit**: Modern drag and drop library
- **better-sqlite3**: Fast SQLite database
- **Lucide React**: Beautiful icons
- **Docker**: Containerization for easy deployment

## License

This project is for personal use.
