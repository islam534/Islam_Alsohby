// Import required modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const compression = require('compression'); // Added for response compression

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression()); // Enable response compression
app.use(express.static(path.join(__dirname, 'public')));

// Configuration
const PORT = process.env.PORT || 3000;
const PROJECTS_FILE = path.join(__dirname, 'data', 'projects.json');
const COMMENTS_FILE = path.join(__dirname, 'data', 'comments.json');

// Load data
let projects = loadData(PROJECTS_FILE, []);
let comments = loadData(COMMENTS_FILE, []);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

app.get('/api/projects', (req, res) => {
    res.json(projects);
});

app.post('/api/projects', (req, res) => {
    const newProject = req.body;
    newProject.id = Date.now().toString();
    newProject.date = new Date().toISOString();
    projects.push(newProject);
    saveData(PROJECTS_FILE, projects);
    io.emit('projectAdded', newProject);
    res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
    const id = req.params.id;
    const updatedProject = req.body;
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
        projects[index] = { ...projects[index], ...updatedProject, date: new Date().toISOString() };
        saveData(PROJECTS_FILE, projects);
        io.emit('projectUpdated', projects[index]);
        res.json(projects[index]);
    } else {
        res.status(404).send('Project not found');
    }
});

app.delete('/api/projects/:id', (req, res) => {
    const id = req.params.id;
    const initialLength = projects.length;
    projects = projects.filter(p => p.id !== id);
    if (projects.length < initialLength) {
        saveData(PROJECTS_FILE, projects);
        io.emit('projectDeleted', id);
        res.status(204).send();
    } else {
        res.status(404).send('Project not found');
    }
});

app.get('/api/comments', (req, res) => {
    res.json(comments);
});

app.post('/api/comments', (req, res) => {
    const newComment = req.body;
    newComment.id = Date.now().toString();
    newComment.date = new Date().toISOString();
    comments.push(newComment);
    saveData(COMMENTS_FILE, comments);
    io.emit('commentAdded', newComment);
    res.status(201).json(newComment);
});

app.get('/api/search', (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    const results = projects.filter(p => 
        p.title.toLowerCase().includes(query) || 
        (p.excerpt?.toLowerCase() || '').includes(query)
    );
    res.json(results);
});

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`Client ${socket.id} left room: ${room}`);
    });

    socket.on('message', (msg) => {
        io.to(msg.room).emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Utility Functions
function loadData(filePath, defaultValue) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath);
            return JSON.parse(data);
        }
        return defaultValue;
    } catch (error) {
        console.error('Error loading data:', error);
        return defaultValue;
    }
}

function saveData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Server Start
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
