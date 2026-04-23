# Blob World — Three.js HW-15

A 3D abstract scene built with Three.js featuring drifting, color-shifting blobs that absorb each other with a satisfying **plop**.

---

## Reflection

### Conceptual Understanding
Working in 3D felt surprisingly familiar — not intimidating the way I expected. The logic of adding a z-axis felt natural, almost like something I'd done before. Maybe in another life. The animation loop, the scene setup, the way objects move through space — it all connected to what we've been doing in 2D canvas and Phaser, just with one more dimension to think about. The biggest shift was learning to think about *depth* — where the camera lives, where the light falls, how objects exist behind and in front of each other in a way that flat canvas never requires.

### Technical Challenges
The hardest part of this project wasn't the code — it was the **file infestation**. Getting Three.js set up locally turned into a small debugging adventure: version mismatches, missing companion files, the wrong build format. Every fix revealed a new little bug hiding behind the last one. The breakthrough came from switching to a CDN-based import map, which cut the local file dependency entirely and let the code breathe. Working through debugging is never glamorous, but there's something satisfying about chasing a problem all the way to its source and watching the screen finally come alive.

### Design & Intent
I wanted something simple and mesmerizing — the kind of thing you watch without meaning to. Lava lamps came to mind immediately. Slow-drifting blobs in deep space, each one its own color, each one alive in a quiet way. The absorption mechanic gave the scene a heartbeat: blobs wander, find each other, and one slowly disappears into the other with a **plop** — both the sound and the word itself bouncing onto the screen like it landed. The camera orbits slowly the whole time, and the lights shift color, so no two moments look exactly the same. It was less about building something impressive and more about building something you'd want to just... watch for a while.

### Growth & Iteration
With more time, I'd push the lava lamp feel further — thicker, rounder bubbles with a more viscous drift, maybe a warm amber glow from below the way a real lava lamp lights from underneath. I'd love to add a gentle heat-shimmer effect and make the absorption feel even more physical, like the blobs actually *merge* rather than one vanishing into the other. Three.js has a whole world of shader materials I haven't touched yet — that's where I'd go next.

### A Note on Gen AI
I used Claude as a collaborator throughout this project, and I'd describe it less like using a tool and more like having a build partner. I like to dream and Claude likes to build — so it's fun to see what we can do together. We negotiated and brainstormed until it worked, talked through the debugging process, and helped each other find the little "bug"ger hiding in the file setup. It wasn't a shortcut — it was a conversation.

---

*Built with Three.js r160 | Tammi | Spring 2026*
