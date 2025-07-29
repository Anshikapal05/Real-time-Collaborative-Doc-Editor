#  REAL-TIME COLLABORATIVE DOC EDITOR

###  Company: CODTECH IT SOLUTIONS  
###  Intern Name: ANSHIKA PAL 
###  Intern ID: CT04DH2443
###  Domain: Full Stack Development
###  Duration: 4 Weeks  
###  Mentor: Neela Santosh  

---

## 📄 Task Description

The **Real-Time Collaborative Document Editor** project is a full-stack web application designed to enable multiple users to collaboratively edit documents in real-time. This task involves advanced web development concepts such as real-time data synchronization, frontend state management, and backend communication using WebSockets, combined with a persistent database for document storage and retrieval.

### Objective:
The main objective of this project was to build a real-time collaborative environment that mimics popular tools like Google Docs. The editor allows multiple users to join a shared document room and see each other's changes in real-time. This is achieved by integrating a dynamic frontend framework, a scalable backend server, and a robust database.

### Key Features Implemented:
1. **Real-Time Document Editing**:  
   WebSocket or Socket.IO is used to broadcast text changes instantly to all users connected to the same document. Changes made by one user are reflected live for others without requiring a page refresh.

2. **Collaborative Sessions**:  
   Users can join a shared session by document ID or unique link. All edits are synchronized across participants in real-time.

3. **Rich Text Editor**:  
   A text editor is implemented using `Quill.js` (or a similar library) to provide rich formatting options like bold, italic, headers, and lists.

4. **Frontend Framework**:  
   The user interface is built using **React.js**, which provides a smooth and dynamic editing experience. React’s component structure enables easy state management and responsive design.

5. **Backend Server**:  
   The server is built using **Node.js and Express.js**, responsible for handling:
   - WebSocket connections (via `Socket.IO`)
   - Document loading and saving
   - Session management and routing

6. **Database Integration**:  
   Documents are stored in **MongoDB**, ensuring that collaborative work is persistent and can be retrieved later. The database schema includes:
   - Document content
   - Document ID/room
   - Timestamped updates

7. **Version Control and Auto-Save**:  
   Auto-saving is implemented at regular intervals to ensure no data loss. The system may also support version tracking or rollback as an advanced feature.

8. **User-Friendly UI/UX**:  
   The interface is responsive and intuitive. Features like editable titles, save indicators, and join document prompts make collaboration seamless.

### Technologies Used:

- **Frontend**: React.js, Tailwind CSS, Quill.js
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB (via Mongoose)
- **Other Tools**: Git, GitHub, ESLint, Prettier

---

### Learning Outcomes:
From this task, I gained a deeper understanding of:
- Real-time communication protocols and WebSocket events
- Managing shared state and avoiding race conditions
- Building scalable and modular React components
- Integrating MongoDB to persist real-time data
- Building full-stack applications that sync frontend and backend seamlessly

This project served as a strong foundation in collaborative application design, especially with real-time constraints. It introduced me to critical challenges like connection management, synchronization conflicts, UI responsiveness, and scalability.

### Conclusion:
The Real-Time Collaborative Document Editor was a highly challenging yet rewarding project that helped me explore real-time technologies and collaborative systems architecture. By building both the frontend and backend, I learned how complex web systems communicate under the hood, making this task one of the most insightful experiences of my internship.

## Code Output

