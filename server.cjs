const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const textDir = path.join(uploadsDir, 'text');
const imagesDir = path.join(uploadsDir, 'images');
fs.mkdirSync(textDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// CREATE: Add a new card
app.post('/cards', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const cardData = JSON.parse(req.body.cardData);
  const uniqueId = path.basename(req.file.filename, path.extname(req.file.filename));
  
  const textFileName = `${uniqueId}.json`;
  const textFilePath = path.join(textDir, textFileName);

  const imageUrl = `http://localhost:${port}/uploads/images/${req.file.filename}`;

  const finalCardData = {
    ...cardData,
    id: uniqueId,
    imageUrl: imageUrl,
  };

  fs.writeFile(textFilePath, JSON.stringify(finalCardData, null, 2), (err) => {
    if (err) {
      console.error('Error saving text file:', err);
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting orphaned image:', unlinkErr);
      });
      return res.status(500).send('Error saving card data.');
    }

    res.status(201).json(finalCardData);
  });
});

// READ: Get all cards
app.get('/cards', (req, res) => {
  fs.readdir(textDir, (err, files) => {
    if (err) {
      console.error('Error reading text directory:', err);
      return res.status(500).send('Error fetching cards.');
    }

    const jsonFiles = files.filter(file => path.extname(file) === '.json');
    
    if (jsonFiles.length === 0) {
      return res.json([]);
    }

    const cardPromises = jsonFiles.map(file => {
      return new Promise((resolve) => {
        fs.readFile(path.join(textDir, file), 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file ${file}:`, err);
            return resolve(null);
          }
          try {
            resolve(JSON.parse(data));
          } catch (parseError) {
            console.error(`Error parsing JSON from file ${file}:`, parseError);
            resolve(null);
          }
        });
      });
    });

    Promise.all(cardPromises)
      .then(results => {
        const cards = results.filter(card => card !== null);
        cards.sort((a, b) => {
          const idA = String(a.id || '');
          const idB = String(b.id || '');
          const timeA = parseInt(idA.split('-')[0], 10) || 0;
          const timeB = parseInt(idB.split('-')[0], 10) || 0;
          return timeB - timeA;
        });
        res.json(cards);
      })
      .catch(error => {
        console.error('An unexpected error occurred processing card files:', error);
        res.status(500).send('Error processing card data.');
      });
  });
});

// DELETE: Remove a card
app.delete('/cards/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send('Card ID is required.');
  }

  const textFilePath = path.join(textDir, `${id}.json`);

  fs.readFile(textFilePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).send('Card not found.');
      }
      console.error('Error reading card file for deletion:', err);
      return res.status(500).send('Error reading card data.');
    }
    
    try {
      const cardData = JSON.parse(data);
      const imageName = path.basename(cardData.imageUrl);
      const imagePath = path.join(imagesDir, imageName);

      fs.unlink(textFilePath, (err) => {
        if (err) {
          console.error('Error deleting text file:', err);
          return res.status(500).send('Error deleting card text.');
        }

        fs.unlink(imagePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting image file:', err);
          }
          res.status(200).json({ message: 'Card deleted successfully.' });
        });
      });
    } catch (parseError) {
      console.error('Error parsing card data for deletion:', parseError);
      res.status(500).send('Error processing card data.');
    }
  });
});

// DELETE: Remove all cards
app.delete('/cards', (req, res) => {
  fs.readdir(textDir, (err, textFiles) => {
    if (err) {
      console.error('Error reading text directory for deletion:', err);
      return res.status(500).send('Error reading card data.');
    }

    fs.readdir(imagesDir, (err, imageFiles) => {
      if (err) {
        console.error('Error reading images directory for deletion:', err);
        return res.status(500).send('Error reading card images.');
      }

      const allFiles = [
        ...textFiles.map(f => path.join(textDir, f)),
        ...imageFiles.map(f => path.join(imagesDir, f))
      ];

      if (allFiles.length === 0) {
        return res.status(200).json({ message: 'No cards to delete.' });
      }

      let deletedCount = 0;
      allFiles.forEach(file => {
        fs.unlink(file, (err) => {
          if (err) {
            console.error(`Error deleting file ${file}:`, err);
          }
          deletedCount++;
          if (deletedCount === allFiles.length) {
            res.status(200).json({ message: 'All cards deleted successfully.' });
          }
        });
      });
    });
  });
});

app.post('/api/save-gemini-key', (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).send('API key is required.');
  }

  const envPath = path.join(__dirname, '.env.local');
  const envLine = `\nGEMINI_API_KEY=${apiKey}`;

  fs.access(envPath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, create it
      fs.writeFile(envPath, `GEMINI_API_KEY=${apiKey}`, (err) => {
        if (err) {
          console.error('Error creating .env.local and saving API key:', err);
          return res.status(500).send('Error saving API key.');
        }
        res.status(200).send('API key saved successfully.');
      });
    } else {
      // File exists, append to it
      fs.appendFile(envPath, envLine, (err) => {
        if (err) {
          console.error('Error saving API key:', err);
          return res.status(500).send('Error saving API key.');
        }
        res.status(200).send('API key saved successfully.');
      });
    }
  });
});

app.get('/api/get-gemini-key', (req, res) => {
  const envPath = path.join(__dirname, '.env.local');

  fs.readFile(envPath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json({ apiKey: '' });
      }
      console.error('Error reading .env.local file:', err);
      return res.status(500).send('Error reading API key.');
    }

    const match = data.match(/GEMINI_API_KEY=(.*)/);
    const apiKey = match ? match[1] : '';
    res.json({ apiKey });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
