# **AURA++** **Simplify Events, Amplify Experiences with AURA++**

---

## **Team Members**

| **Maliha Pervin** | 20230104077 | parvinmaliha26@gmail.com | Lead |
| **Ohidur Rahman Rifat** | 20230104090 | rifator44@gmail.com | Backend, Frontend |
| **Hisham Mhamhud** | 20230104096 | hishammd123545@gmail.com | Backend, Frontend |

---

## **Project Overview**
AURA++ is a dynamic event management platform that simplifies the process of organizing, booking, and managing events. The platform is designed to streamline attendee registration, event scheduling, and ticket booking, providing a seamless experience for both event organizers and participants.

---

## **Key Features**
### **Attendee Registration**
- Simple sign-up and registration process.
- Automated email confirmations upon successful registration.

### **Schedule Management**
- Easily create and manage event schedules.
- Real-time ticket updates to keep participants informed about event changes.

### **Admin Panel**
- Efficient tools for organizing, overseeing, and modifying event details.
- Manage attendee data, bookings, and event performance insights.

---

## **Target Audience**
AURA++ is designed for a wide range of users:
- **Event Organizers:** Simplifying event planning, registration handling, and ticket management.
- **Businesses & Organizations:** Perfect for conferences, workshops, corporate events, and more.
- **Attendees:** Providing an easy-to-use platform for exploring and registering for events.
- **Event Planners & Agencies:** Scalable solutions to manage multiple events simultaneously.

---

## **Figma Design**
https://www.figma.com/make/H8CHBf3n7KZBXLgskA3p3W/Ticket-Booking-Website?p=f&t=PwngXGLQgkqlc01w-0


## **Project Milestones**
### **Checkpoint 1**
- Design landing pages and dashboard UI using Figma.
- Implement home page frontend.
- Implement events page frontend.

### **Checkpoint 2**
- Develop user authentication (registration & login) for both frontend and backend.
- Implement the "About Us" page frontend.

### **Checkpoint 3**
- Develop backend booking functionality.
- Finalize UI/UX design with responsive capabilities.
- Integrate frontend with backend.
- Deploy the web application.

---

## **Usage Instructions**

### **Prerequisites**
Before getting started, ensure the following tools are installed:
- **PHP** (for the backend)
- **Composer** (for managing PHP dependencies)
- **Node.js** (for running the React frontend)
- **XAMPP** (for running the MySQL database and backend server)

### **Installation Steps**
1. Clone the repository.
2. Install necessary dependencies:

   - For **React Frontend**:
     \`\`\`bash
     npm install
     npm install axios
     npm install coreui
     npm install dayjs
     npm install moment
     \`\`\`
   - For **Laravel Backend**:
     \`\`\`bash
     composer install
     composer require fruitcake/laravel-cors
     \`\`\`

3. Install **Laravel Installer** globally:
   \`\`\`bash
   composer global require laravel/installer
   \`\`\`

4. Configure your .env file for both frontend and backend.
5. Run the following Laravel commands:
   \`\`\`bash
   php artisan storage:link
   php artisan vendor:publish
   php artisan install:api
   \`\`\`

6. Start the development servers:
   - **React Frontend:**
     \`\`\`bash
     npm run dev
     \`\`\`
   - **Laravel Backend:**
     \`\`\`bash
     php artisan serve
     \`\`\`

7. Ensure your **XAMPP** server is running with the MySQL database configured.

### **Accessing the Platform**
Once both frontend and backend are running, access the platform via the provided local address.

- **Admin Features:**
  - Create and modify event schedules.
  - Oversee attendee data and bookings.
  
- **User Features:**
  - Register for events.
  - Book tickets for events.
EOF

# 4. Stage and commit the file
git add README.md
git commit -m "Initial commit: AURA++ Project Proposal"

# 5. Connect and push to GitHub (Replace <URL> with your actual repo link)
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main

# 6. Optional: Invite instructor (requires GitHub CLI)
gh repo invite aliahnaf327@gmail.com
