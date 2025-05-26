# video-response-js

A lightweight npm package to simplify returning videos in a chunked format (HTTP 206 Partial Content) in Next.js App Router API routes.

## Features

- Effortless video streaming with HTTP 206 support
- Handles range requests for efficient playback
- Works seamlessly with Next.js App Router API handlers

## Installation

```bash
npm install video-response-js
```

## Usage

### Example: Streaming a Video in Next.js App Router

```ts
// app/api/video/route.ts
import { videoResponseFromPath } from 'video-response-js';
import path from 'path';

export async function GET(request: Request) {
    const videoPath = path.resolve('./public/sample.mp4');
    // Optionally, you can pass a config object as the third argument
    return videoResponseFromPath(videoPath, request, {
        mimeType: 'video/mp4',
        nonPartial: false
    });
}
```
