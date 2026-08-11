// ===========================================
// Premium Custom Cursor
// devwithbhavya — cursor.js
// ===========================================
// Drop-in replacement for the old cursor.js.
// No HTML changes required — the inner dot and
// text label are injected automatically.
// Pair with cursor.css (provided separately).
// ===========================================

(() => {

    // -------------------------------------------
    // Bail out early on touch devices / reduced motion
    // -------------------------------------------

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch) {
        document.documentElement.classList.add("no-custom-cursor");
        return; // don't run any of this on phones/tablets
    }

    document.documentElement.classList.add("has-custom-cursor");


    // -------------------------------------------
    // DOM setup — inject the pieces we need
    // -------------------------------------------

    const cursor = document.querySelector(".custom-cursor");
    const trailContainer = document.querySelector(".cursor-trail");

    if (!cursor) return;

    // Inner dot (tight, fast-following point)
    let dot = cursor.querySelector(".cursor-dot-core");
    if (!dot) {
        dot = document.createElement("div");
        dot.className = "cursor-dot-core";
        cursor.appendChild(dot);
    }

    // Text label (for "View", "Create", "Drag", etc.)
    let label = cursor.querySelector(".cursor-label");
    if (!label) {
        label = document.createElement("span");
        label.className = "cursor-label";
        cursor.appendChild(label);
    }


    // -------------------------------------------
    // State
    // -------------------------------------------

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;

    let dotX = mouseX;
    let dotY = mouseY;

    let isVisible = false;
    let idleTimer = null;

    const RING_EASE = 0.15;
    const DOT_EASE = 0.35; // dot moves faster/tighter than the ring


    // -------------------------------------------
    // Pointer tracking
    // -------------------------------------------

    window.addEventListener("mousemove", (e) => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            cursor.style.opacity = "1";
        }

        resetIdleTimer();
        spawnTrailDot(e.clientX, e.clientY);

    });

    window.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
        isVisible = false;
    });

    window.addEventListener("mouseenter", () => {
        cursor.style.opacity = "1";
        isVisible = true;
    });


    // -------------------------------------------
    // Idle fade — quietly dim the cursor if the
    // pointer hasn't moved in a while. Small touch,
    // reads as intentional rather than "stuck".
    // -------------------------------------------

    function resetIdleTimer() {

        cursor.classList.remove("idle");
        clearTimeout(idleTimer);

        idleTimer = setTimeout(() => {
            cursor.classList.add("idle");
        }, 2200);

    }


    // -------------------------------------------
    // Main animation loop (ring + dot easing)
    // -------------------------------------------

    function animateCursor() {

        ringX += (mouseX - ringX) * RING_EASE;
        ringY += (mouseY - ringY) * RING_EASE;

        dotX += (mouseX - dotX) * DOT_EASE;
        dotY += (mouseY - dotY) * DOT_EASE;

        cursor.style.transform = `translate(${ringX}px, ${ringY}px)`;
        dot.style.transform = `translate(${dotX - ringX}px, ${dotY - ringY}px)`;

        requestAnimationFrame(animateCursor);

    }

    animateCursor();


    // -------------------------------------------
    // Interactive states
    // Auto-detects common interactive elements
    // plus anything explicitly opted in via
    // data-cursor="text" / data-cursor-text="Label"
    // -------------------------------------------

    function setState(state, text = "") {
        cursor.dataset.state = state;
        cursor.dataset.text = text;
        label.textContent = text;
    }

    function clearState() {
        cursor.dataset.state = "";
        cursor.dataset.text = "";
        label.textContent = "";
    }

    // Cards → "View"
    const viewTargets = document.querySelectorAll(
        ".activity-card, .quick-card, [data-cursor='view']"
    );

    viewTargets.forEach((el) => {

        el.addEventListener("mouseenter", () => setState("view", el.dataset.cursorText || "View"));
        el.addEventListener("mouseleave", clearState);

        el.addEventListener("mousemove", (e) => magneticMove(el, e));
        el.addEventListener("mouseleave", () => resetMagnetic(el));

    });

    // Primary CTA → "Create"
    const heroBtn = document.querySelector(".hero-btn");

    if (heroBtn) {
        heroBtn.addEventListener("mouseenter", () => setState("create", heroBtn.dataset.cursorText || "Create"));
        heroBtn.addEventListener("mouseleave", clearState);

        heroBtn.addEventListener("mousemove", (e) => magneticMove(heroBtn, e, 0.35, 12));
        heroBtn.addEventListener("mouseleave", () => resetMagnetic(heroBtn));
    }

    // Any link / button / input / nav item / anything opted in via
    // data-cursor-text → subtle "pointer" / "text" state with its label
    document.querySelectorAll(
        "a, button, input, textarea, .nav-item, [data-cursor], [data-cursor-text]"
    ).forEach((el) => {

        // Don't override elements already handled above
        if (el.matches(".activity-card, .quick-card, .hero-btn")) return;

        el.addEventListener("mouseenter", () => {

            if (el.matches("input, textarea")) {
                setState("text");
            } else {
                setState("pointer", el.dataset.cursorText || "");
            }

        });

        el.addEventListener("mouseleave", clearState);

    });


    // -------------------------------------------
    // Magnetic pull — element leans toward the
    // pointer, then eases back on exit
    // -------------------------------------------

    function magneticMove(el, e, strength = 0.05, tiltStrength = 0.12) {

        const rect = el.getBoundingClientRect();

        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = x * strength;
        const moveY = y * strength;

        el.style.transform = `
            translate(${moveX}px, ${moveY}px)
            rotateY(${moveX * tiltStrength}deg)
            rotateX(${-moveY * tiltStrength}deg)
            scale(1.03)
        `;

    }

    function resetMagnetic(el) {
        el.style.transform = "";
    }


    // -------------------------------------------
    // Click feedback — quick scale + expanding ripple
    // -------------------------------------------

    window.addEventListener("mousedown", (e) => {

        cursor.classList.add("click");
        spawnRipple(e.clientX, e.clientY);

    });

    window.addEventListener("mouseup", () => {
        cursor.classList.remove("click");
    });

    function spawnRipple(x, y) {

        if (prefersReducedMotion) return;

        const ripple = document.createElement("div");
        ripple.className = "cursor-ripple";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";

        trailContainer.appendChild(ripple);

        ripple.addEventListener("animationend", () => ripple.remove());

    }


    // -------------------------------------------
    // Trail — pooled dots instead of unlimited
    // create/remove, so it stays smooth even on
    // fast, sustained mouse movement.
    // -------------------------------------------

    const TRAIL_POOL_SIZE = 12;
    const trailPool = [];
    let trailIndex = 0;
    let lastTrailSpawn = 0;
    const TRAIL_SPAWN_INTERVAL = 24; // ms between dots

    if (trailContainer && !prefersReducedMotion) {

        for (let i = 0; i < TRAIL_POOL_SIZE; i++) {

            const dotEl = document.createElement("div");
            dotEl.className = "cursor-trail-dot";
            trailContainer.appendChild(dotEl);
            trailPool.push(dotEl);

        }

    }

    function spawnTrailDot(x, y) {

        if(document.body.classList.contains("modal-open")) return;
        if (prefersReducedMotion || trailPool.length === 0) return;

        const now = performance.now();
        if (now - lastTrailSpawn < TRAIL_SPAWN_INTERVAL) return;
        lastTrailSpawn = now;

        const dotEl = trailPool[trailIndex];
        trailIndex = (trailIndex + 1) % trailPool.length;

        const size = Math.random() * 4 + 5;

        dotEl.style.width = size + "px";
        dotEl.style.height = size + "px";
        dotEl.style.left = x + "px";
        dotEl.style.top = y + "px";

        // Restart the fade animation
        dotEl.classList.remove("fade");
        // eslint-disable-next-line no-unused-expressions
        dotEl.offsetHeight; // force reflow so the animation restarts
        dotEl.classList.add("fade");

    }

})();