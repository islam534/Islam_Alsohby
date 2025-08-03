const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const csrf = require('csurf');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(csrf({ cookie: true }));
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));

const blogSchema = new mongoose.Schema({ html: String, likes: { type: Number, default: 0 } });
const Blog = mongoose.model('Blog', blogSchema);
const projectSchema = new mongoose.Schema({ html: String });
const Project = mongoose.model('Project', projectSchema);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/blog', (req, res) => res.sendFile(path.join(__dirname, 'public', 'blog.html')));
app.get('/projects', (req, res) => res.sendFile(path.join(__dirname, 'public', 'projects.html')));

app.get('/api/blog', async (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const blogs = await Blog.find().skip(offset).limit(3);
    res.json(blogs.map(b => ({ html: `<div>${b.html}<p>Likes: ${b.likes}</p></div>` })));
});

app.get('/api/projects', async (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const projects = await Project.find().skip(offset).limit(3);
    res.json(projects.map(p => ({ html: `<div>${p.html}</div>` })));
});

app.post('/api/like/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    blog.likes += 1;
    await blog.save();
    io.emit('updateLikes', { id: blog._id, likes: blog.likes });
    res.json({ likes: blog.likes });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server on ${PORT}`));
