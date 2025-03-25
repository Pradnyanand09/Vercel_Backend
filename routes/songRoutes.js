const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Song = require('../models/Song');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Song with Cover
router.post('/upload', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
    try {
        if (!req.files || !req.files.audio || !req.files.cover) {
            return res.status(400).json({ message: 'Audio and Cover are required' });
        }

        // Upload Audio to Cloudinary
        const audioResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'video' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                }
            ).end(req.files.audio[0].buffer);
        });

        // Upload Cover Image to Cloudinary
        const coverResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                }
            ).end(req.files.cover[0].buffer);
        });

        // Save song
        const newSong = new Song({
            title: req.body.title,
            url: audioResult,
            coverUrl: coverResult,
            artist: req.body.artist,
            note: req.body.note
        });

        await newSong.save();
        res.json(newSong);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get All Songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
