app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set JSON content type for API routes
app.use('/api', (req, res, next) => {
    res.type('json');
    next();
});

// Register API routes
app.use('/api/admin', require('./routes/admin/users'));

// Serve static files after API routes
app.use(express.static('public')); 