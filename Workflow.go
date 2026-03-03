Workflow will be:
git checkout -b "Name of branch"
git add .
git commit -m "Message"

git checkout main
git merge feature/database-setup
git push origin main
git branch -d "Whatever the name will be like: feature/database-setup"

IF I accidently deleted my code, I can recover run:
git checkout main -- .

To undue changes to a file, I can run:
git restore <file_name>

To undo all changes in the folder, I can run:
git restore .

IF I want to pull specifically from my main branch, I can run:
git restore --source=main <file_name>

f1-tifosi-tracker/
├── backend/            # Node.js / Express API
│   ├── src/            # Server logic
│   ├── .env            # Database credentials (DO NOT UPLOAD TO GITHUB)
│   └── package.json
├── frontend/           # React App (Vite)
│   ├── src/            # Components and Pages
│   └── package.json
├── database/           # SQL Scripts and ERD image
│   ├── schema.sql      # Your CREATE TABLE scripts
│   └── seed_data.sql   # The 2025 driver/race data
├── .gitignore          # Tells Git to ignore node_modules and .env
└── README.md           # Your project documentation