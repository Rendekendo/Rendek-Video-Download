# Media Utility

A desktop media tool built with **Python utilities, Electron, and a React-style UI workflow** that allows users to queue multiple YouTube videos, preview them, and download them in batch.  

The application focuses on **queue-based processing, responsiveness, and error handling**, allowing multiple downloads to run sequentially while keeping the user interface responsive.

---

## Overview

Media Utility provides a simple graphical interface where users can paste multiple YouTube links, preview them, and download all videos using a queue system powered by `yt-dlp`.

The application integrates:

- **Electron** for the desktop application
- **JavaScript UI** for the frontend
- **Python / command-line utilities** for media processing
- **IPC communication** between the UI and backend process

---

## Features

### Queue-Based Download System
- Paste multiple YouTube links
- Automatic extraction of video IDs
- Sequential downloads through a managed queue
- Prevents multiple processes from running simultaneously

### Video Preview
- Integrated **YouTube embedded player**
- Allows previewing videos before downloading
- Seekbar support for navigating through the video

### Batch Download
- Download all videos with a single button
- Automatically converts output to **MP4**
- Uses `yt-dlp` for reliable media downloading

### Metadata Fetching
- Automatically retrieves video titles using the **YouTube oEmbed API**
- Titles are displayed as selectable tabs in the interface

### Responsive UI
- Dynamic UI updates as links are entered
- Progress feedback through console output
- Interactive video selection and playback

### Error Handling
- Command execution wrapped in promises
- Graceful handling of failed downloads
- Logging of errors and command output

---

## How It Works

### 1. Link Processing
Users paste multiple YouTube URLs into the text area.

The program:
- Parses the text input
- Extracts valid YouTube video IDs using regex
- Fetches video metadata
- Generates clickable tabs for each video

### 2. Video Preview
Selecting a video loads it into the embedded **YouTube player**, allowing users to:

- Play the video
- Seek through the timeline
- Preview before downloading

### 3. Download Queue
When **Download All** is clicked:

1. The renderer process sends the video IDs via **Electron IPC**
2. The main process executes `yt-dlp`
3. Videos download sequentially
4. Output files are saved to the user's **Desktop**

---

## Requirements

- Node.js
- Electron
- `yt-dlp` installed and available in PATH

Install dependencies:

```bash
npm install
```

Install yt-dlp:

```bash
pip install yt-dlp
```

---

## Running the Application

Start the Electron app:

```bash
npm start
```
---

## Learning Goals

This project demonstrates:

- Electron desktop application development
- IPC communication between processes
- Queue-based task execution
- Integration with external command-line tools
- Dynamic UI updates with JavaScript
