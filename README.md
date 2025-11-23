1. Project Overview

The application allows users to draw a free-form circle (or any selection shape) over any part of the screen. Once the user confirms the selection, the app:

Captures the selected region as an image.

Sends the image to a Python-based AI engine.

Performs multiple types of analysis:

Image classification (TensorFlow)

Text recognition (Tesseract OCR)

Code pattern detection

Semantic summarization

Context extraction

Returns the results via the Node.js API.

Displays them inside the Electron-based desktop UI.

This creates a seamless workflow where the user can visually analyze content from anywhere on their device without opening additional tools.

2. Architecture and Components

The system is built with a modular architecture:

A. Desktop Frontend (Electron)

Renders the transparent overlay for drawing the circle.

Captures screenshots of the selected region.

Communicates with the backend using IPC and HTTP requests.

Displays analysis results in a UI window.

Runs entirely on the user’s system.

B. Backend Layer (Node.js + Express.js)

Receives image data from the Electron app.

Manages API routing and concurrency.

Sends data to the Python AI service.

Stores past query results in SQLite.

Handles session logging, caching, and error management.

C. Python AI Engine

A separate Python process performs all heavy AI tasks to keep the Node.js layer fast and responsive. It includes:

TensorFlow models for object detection or general classification.

Tesseract OCR for text extraction from the screenshot.

Custom logic to detect code snippets (indentation, syntax patterns, keywords).

AI reasoning to summarize or explain the extracted result.

This separation mirrors real production pipelines where ML inference is isolated for performance and maintainability.

3. Key Features
1. Circle-to-Analyze Overlay

A fullscreen transparent overlay allows the user to “circle” any portion of the screen. This automatically:

Identifies the boundaries of the circle

Crops the selected region

Sends that region for analysis

This interaction model makes the tool intuitive and fast.

2. Real-Time OCR and Text Interpretation

Extracted text is processed to:

Summarize content

Provide relevant explanations

Detect URLs and references

Highlight important keywords

This makes it useful for studying, research, reading documents, etc.

3. Code Detection and Explanation

If the selected region contains code, the system:

Identifies the language

Explains the logic

Highlights errors

Shows time/space complexity (for algorithms)

Suggests improvements

This is especially useful for debugging or learning.

4. Image Recognition

Using TensorFlow, the system identifies:

Objects

Scenes

Diagrams

Charts

UI elements

This turns screenshots into context-aware information.

5. Smart AI Interactions

Depending on the content detected, the system tailors its response:

If text → summarize

If code → explain

If image → classify

If diagram → describe

If error message → troubleshoot

6. Local Database (SQLite)

All user queries and responses are stored locally, allowing:

History tracking

Offline access

Faster repeat analyses

4. Why This Project Matters

This project demonstrates practical, full-stack AI engineering skills that companies look for:

1. Multi-language integration

Electron + Node.js + Python in one pipeline.

2. Asynchronous communication

Inter-process communication with streams, buffers, and non-blocking APIs.

3. AI/ML integration

Working with TensorFlow, OCR, and custom analysis logic.

4. System design

Modular architecture similar to real enterprise-level AI tools.

5. Production-level challenges

Handling:

Concurrency

Image processing

Error boundaries


What i learned from this project: 
Building a desktop app from scratch

Designing multi-component systems

Implementing OCR and ML pipelines

Managing inter-process communication

Working with Electron, Node, Express, Python, SQLite

Creating a real-world inspired AI product
Efficient memory use

Data persistence
