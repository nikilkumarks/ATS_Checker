🤖 AI-Powered ATS Resume Analyzer & Builder

A full-stack web application that helps users create ATS-friendly resumes, analyze resume performance against job descriptions, and improve content using AI-powered suggestions.

This platform acts as a SaaS product with user and admin dashboards.

🚀 Features

🔐 Authentication & Security

-User Signup & Login

-JWT-based authentication

-Protected dashboard routes

-Role-based access (User & Admin)

📄 ATS Resume Checker

-Upload resume in PDF format

-Extracts resume text automatically

-Compares resume with job description

Generates:

✅ ATS Match Score

❌ Missing Keywords

💡 Resume Improvement Suggestions

🧠 AI Resume Enhancement

-With “Enhance with AI” feature:

-Improves professional summary

-Optimizes experience descriptions

-Enhances project details

-Makes resume more ATS-friendly

🏗 Resume Builder

-Form-based resume creation

Sections included:

-Personal Details

-Education

-Skills

-Experience

-Projects

-Achievement/Certification

-Multiple resume templates

-Download resume as PDF

📊 Resume Scan History

Users can:

-View past resume scans

-Track previous ATS scores

-Re-check resume after improvements

👨‍💼 Admin Dashboard

Admin can:

-View all users

-Monitor resume scans

-Access scan history

-Track system usage

🛠 Tech Stack
🎨 Frontend

-React.js

-Tailwind CSS

-React Router

-Axios

⚙ Backend

-Node.js

-Express.js

-RESTful APIs

-JWT Authentication

-Multer (File Uploads)

🗄 Database

-MongoDB

🤖 AI Integration

-Cohere AI API

-Resume enhancement

-Keyword optimization

-Job description comparison

🔗 API Architecture
Method    	     Endpoint	        Description

-POST	/auth/register	Register new user

-POST	/auth/login	User login

-POST	/resume/analyze	Upload resume & get ATS score

-POST	/resume/enhance	AI resume enhancement

-GET	/resume/history	User scan history

-GET	/admin/users	Admin: view users

-GET	/admin/scans	Admin: view all scans

☁ Deployment

Backend deployed on Render

🎯 Project Highlights

✔ Full-stack architecture

✔ AI-powered resume optimization

✔ PDF parsing & keyword matching

✔ Real-world ATS scoring system

✔ User + Admin dashboards

📌 Future Improvements

More resume templates

Resume grammar checker

Multi-language support
