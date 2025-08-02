const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect('mongodb://localhost/islam_alsohby', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const blogSchema = new mongoose.Schema({
    title: String,
    thesis: String,
    summary: String,
    image: String,
    link: String,
    date: String,
    readTime: String,
    views: Number,
    likes: { type: Number, default: 0 },
    comments: [{ text: String, author: String, date: { type: Date, default: Date.now } }]
});
const Blog = mongoose.model('Blog', blogSchema);

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    pdf: String,
    tech: String,
    date: String,
    team: String
});
const Project = mongoose.model('Project', projectSchema);

const gallerySchema = new mongoose.Schema({
    image: String,
    caption: String
});
const Gallery = mongoose.model('Gallery', gallerySchema);

const testimonialSchema = new mongoose.Schema({
    text: String,
    author: String
});
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

const resourceSchema = new mongoose.Schema({
    category: String,
    items: [{ title: String, link: String }]
});
const Resource = mongoose.model('Resource', resourceSchema);

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/blog', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const blogs = await Blog.find().skip((page - 1) * limit).limit(limit);
    res.json(blogs);
});

app.get('/projects', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const projects = await Project.find().skip((page - 1) * limit).limit(limit);
    res.json(projects);
});

app.get('/gallery', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const galleries = await Gallery.find().skip((page - 1) * limit).limit(limit);
    res.json(galleries);
});

app.get('/testimonials', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const testimonials = await Testimonial.find().skip((page - 1) * limit).limit(limit);
    res.json(testimonials);
});

app.get('/resources', async (req, res) => {
    const resources = await Resource.find();
    res.json(resources);
});

app.get('/search', async (req, res) => {
    const query = req.query.q.toLowerCase();
    const blogs = await Blog.find({ $text: { $search: query } });
    res.json(blogs);
});

app.post('/like/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    blog.likes += 1;
    await blog.save();
    io.emit('newLike', { postId: req.params.id, likes: blog.likes });
    res.json({ likes: blog.likes });
});

app.post('/comment/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    blog.comments.push({ text: req.body.comment, author: 'Anonymous' });
    await blog.save();
    io.emit('newComment', { postId: req.params.id });
    res.json({ message: 'Comment added' });
});

app.get('/comments/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.json(blog.comments);
});

app.post('/contact', (req, res) => {
    console.log('Contact Form:', req.body);
    res.json({ message: 'Message received, thank you!' });
});

app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

// Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

// Sample Data
async function seedData() {
    if (await Blog.countDocuments() === 0) {
        const blogs = [
            { title: 'Assisted Death – Mercy or Morality?', thesis: 'Assisted death poses a profound ethical dilemma...', summary: 'This article examines...', image: 'https://via.placeholder.com/400x250', link: '#', date: 'Aug 01, 2025', readTime: '7 min', views: 1200 },
            { title: 'Free Will – Are We Free?', thesis: 'Free will challenges us...', summary: 'Dive into a detailed analysis...', image: 'https://via.placeholder.com/400x250', link: '#', date: 'Jul 28, 2025', readTime: '6 min', views: 950 },
            { title: 'Business – Mastering
