const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const csrf = require('csurf');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(csrf({ cookie: true }));
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const gallerySchema = new mongoose.Schema({ html: String });
const Gallery = mongoose.model('Gallery', gallerySchema);
const testimonialsSchema = new mongoose.Schema({ html: String });
const Testimonial = mongoose.model('Testimonial', testimonialsSchema);
const blogSchema = new mongoose.Schema({ html: String });
const Blog = mongoose.model('Blog', blogSchema);
const projectSchema = new mongoose.Schema({ html: String });
const Project = mongoose.model('Project', projectSchema);
const contactSchema = new mongoose.Schema({ name: String, email: String, subject: String, message: String, date: { type: Date, default: Date.now } });
const Contact = mongoose.model('Contact', contactSchema);

app.get('/', (req, res) => res.render('index'));
app.get('/blog', (req, res) => res.render('blog'));
app.get('/projects', (req, res) => res.render('projects'));

app.get('/api/gallery', async (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const items = await Gallery.find().skip(offset).limit(6);
    res.json(items);
});
app.get('/api/testimonials', async (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const items = await Testimonial.find().skip(offset).limit(6);
    res.json(items);
});
app.get('/api/blog', async (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const items = await Blog.find().skip(offset).limit(6);
    res.json(items);
});
app.get('/api/projects', async (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const items = await Project.find().skip(offset).limit(6);
    res.json(items);
});

app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.status(200).send();
});

app.post('/api/like/:id', async (req, res) => {
    const post = await Blog.findById(req.params.id);
    post.likes = (post.likes || 0) + 1;
    await post.save();
    io.emit('updateLikes', { id: req.params.id, likes: post.likes });
    res.json({ likes: post.likes });
});

app.post('/api/comment/:id', async (req, res) => {
    const { text, author } = req.body;
    const post = await Blog.findById(req.params.id);
    post.comments = post.comments || [];
    post.comments.push({ text, author, date: new Date() });
    await post.save();
    io.emit('newComment', { postId: req.params.id, author, text });
    res.status(200).send();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
