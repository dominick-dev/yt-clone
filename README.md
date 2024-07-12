# yt-clone

This project is a simplified YouTube clone implemented as part of a Full Stack Development course. The goal is to build a rough skeleton of YouTube, focusing on core functionalities like user authentication, video upload, video processing, and viewing videos.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Future Work](#future-work)
- [References](#references)

## Introduction

The YouTube Skeleton Clone project aims to implement core functionalities of YouTube, such as user authentication, video upload, transcoding to multiple formats, and video playback. The project is designed to be simple and scalable, leveraging various Google Cloud services.

## Features

- User authentication with Google account
- Video upload for authenticated users
- Video transcoding to multiple formats (e.g., 360p, 720p)
- Viewing a list of uploaded videos
- Watching individual videos

## Architecture

![High Level Design](path/to/your/architecture-diagram.png)

### Components

1. **User Authentication (Firebase Auth)**

   - Handles user sign in/out using Google accounts.

2. **Video Storage (Google Cloud Storage)**

   - Stores raw and processed video files.

3. **Video Upload Events (Cloud Pub/Sub)**

   - Decouples video upload from processing using asynchronous messaging.

4. **Video Processing Workers (Cloud Run)**

   - Processes videos using ffmpeg and scales based on workload.

5. **Video Metadata (Firestore)**

   - Stores video metadata such as title, description, and processing status.

6. **Video API (Firebase Functions)**

   - Provides an API for uploading videos and retrieving metadata.

7. **Web Client (Next.js / Cloud Run)**
   - Provides a web interface for users to interact with the application.

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Google Cloud account
- Firebase project setup

### Steps

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/yt-clone.git
   cd yt-clone
   ```
