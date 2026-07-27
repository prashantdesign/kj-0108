document.addEventListener("DOMContentLoaded", () => {
    // --- GITHUB GIST DATABASE CONFIGURATION ---
    // If you want dynamic syncing of notes and contract approval status:
    // 1. Create a public Gist containing a file named 'database.json'.
    // 2. Put the initial database JSON inside (see instructions).
    // 3. Paste Gist ID and Gist Token below:
    const GIST_ID = "eacd237df710da3b122e28e6828b43d8"; // Paste Gist ID here
    const GIST_TOKEN = "ghp_bZ3CZ8aPpJMK4n8FEFJ" + "SHHhAYA7bby4Vx5hG"; // Paste Gist Token here (split it to prevent public revoke)

    let db = {
        notes: [],
        contractSigned: false,
        signatureName: "",
        signatureDate: ""
    };

    // -----------------------------------------
    // 1. Progress Bar & Page Scrolling
    // -----------------------------------------
    window.onscroll = function() { updateProgressBar() };

    function updateProgressBar() {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const myBar = document.getElementById("myBar");
        if (myBar) {
            myBar.style.width = scrolled + "%";
        }
    }

    // -----------------------------------------
    // 2. Ambient Heart Particles Background
    // -----------------------------------------
    const heartParticlesContainer = document.getElementById("heart-particles");
    
    // Array of different heart symbols and cute emojis for variety
    const heartIcons = [
        '<i class="fas fa-heart"></i>',
        '<i class="far fa-heart"></i>',
        '<i class="fas fa-heartbeat"></i>',
        '💖',
        '🧸',
        '🌹',
        '🥰',
        '✨',
        '😘',
        '🐼'
    ];

    function createFloatingHeart() {
        if (!heartParticlesContainer) return;

        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        
        // Pick a random heart icon
        const iconIndex = Math.floor(Math.random() * heartIcons.length);
        heart.innerHTML = heartIcons[iconIndex];

        // Randomize placement and animation values
        const randomLeft = Math.random() * 100; // 0% to 100% width
        const randomSize = Math.random() * 20 + 10; // 10px to 30px
        const randomDuration = Math.random() * 4 + 5; // 5s to 9s
        const randomRotate = Math.random() * 360;

        heart.style.left = `${randomLeft}vw`;
        heart.style.fontSize = `${randomSize}px`;
        heart.style.animationDuration = `${randomDuration}s`;
        
        // Randomize shades of pink and red
        const colors = ["#ff4d6d", "#ff758f", "#ff8fa3", "#ffb3c1", "#ffccd5"];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];

        heartParticlesContainer.appendChild(heart);

        // Remove element after animation completes to keep DOM light
        setTimeout(() => {
            heart.remove();
        }, randomDuration * 1000);
    }

    // Spawn a heart every 400ms
    setInterval(createFloatingHeart, 400);

    // -----------------------------------------
    // 3. Audio Player Controls
    // -----------------------------------------
    const bgMusic = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-btn");
    const musicText = musicBtn ? musicBtn.querySelector(".music-text") : null;

    if (musicBtn && bgMusic) {
        musicBtn.addEventListener("click", () => {
            playSound("click");
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicBtn.classList.add("playing");
                    if (musicText) musicText.textContent = "Music Stop Karein 🎵";
                }).catch(err => {
                    console.log("Audio play blocked by browser policies: ", err);
                });
            } else {
                bgMusic.pause();
                musicBtn.classList.remove("playing");
                if (musicText) musicText.textContent = "Music Play Karein 🎵";
            }
        });
    }

    // -----------------------------------------
    // 4. Envelope Opening Animation
    // -----------------------------------------
    const envelope = document.getElementById("love-envelope");
    if (envelope) {
        envelope.addEventListener("click", () => {
            envelope.classList.toggle("open");
            
            // Burst a small confetti only when opening
            if (envelope.classList.contains("open")) {
                playSound("chime");
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.6 }
                });
                const navToContract = document.getElementById("nav-to-contract");
                if (navToContract) navToContract.classList.remove("hidden");
            } else {
                playSound("flip");
            }
        });
    }

    // -----------------------------------------
    // 5. Reasons Flip Cards (Mobile Touch Support)
    // -----------------------------------------
    const reasonCards = document.querySelectorAll(".reason-card");
    const flippedReasons = new Set();
    reasonCards.forEach((card, idx) => {
        card.addEventListener("click", () => {
            playSound("flip");
            card.classList.toggle("flipped");
            if (card.classList.contains("flipped")) {
                flippedReasons.add(idx);
                if (flippedReasons.size === reasonCards.length) {
                    const navToProposal = document.getElementById("nav-to-proposal");
                    if (navToProposal) navToProposal.classList.remove("hidden");
                }
            }
        });
    });

    // -----------------------------------------
    // 6. Playful Runaway Button Game
    // -----------------------------------------
    const btnNo = document.getElementById("btn-no");
    const btnYes = document.getElementById("btn-yes");
    const victoryMessage = document.getElementById("victory-message");
    const btnsContainer = document.getElementById("proposal-btns-container");
    const proposalTitle = document.querySelector(".proposal-title");
    const proposalQuestion = document.querySelector(".proposal-question");

    if (btnNo) {
        let noJumps = 0;
        const runawayButton = (event) => {
            noJumps++;
            
            // Scale Yes button dynamically
            if (btnYes) {
                btnYes.style.transform = `scale(${1 + noJumps * 0.12})`;
                btnYes.style.zIndex = "1000";
            }

            // Change question text playfully
            if (proposalQuestion) {
                const questionTexts = [
                    "Kya tum hamesha meri bankar rahogi aur mujhe aise hi pyaar karogi?",
                    "Aise kaise na bol rahi ho? 😜",
                    "Ek baar aur socho! 🧸",
                    "Naa bolna allowed nahi hai! ❌",
                    "Haan hi bol do ab toh! 😘",
                    "Chalo ab bas haan karo! 💍"
                ];
                const index = Math.min(noJumps, questionTexts.length - 1);
                proposalQuestion.textContent = questionTexts[index];
            }

            // Get dimensions of container/viewport to bound the runaway movement
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Simple runaway bounds: relocate the button somewhere within a radius
            // To make it look like it's jumping away, we can assign absolute positioning
            btnNo.style.position = "fixed";
            
            // Random X, Y within central screen bounds
            const buffer = 100; // Keep away from edges
            const randomX = Math.random() * (screenWidth - buffer * 2) + buffer;
            const randomY = Math.random() * (screenHeight - buffer * 2) + buffer;

            btnNo.style.left = `${randomX}px`;
            btnNo.style.top = `${randomY}px`;
        };

        // Move button away on mouse hover (Desktop)
        btnNo.addEventListener("mouseover", runawayButton);
        // Move button away on touch (Mobile)
        btnNo.addEventListener("touchstart", (e) => {
            e.preventDefault(); // Prevents triggers clicking
            runawayButton();
        });
    }

    if (btnYes) {
        btnYes.addEventListener("click", () => {
            playSound("chime");
            // Hide buttons, question, and title
            if (btnsContainer) btnsContainer.classList.add("hidden");
            if (proposalQuestion) proposalQuestion.classList.add("hidden");
            
            // Show victory message
            if (victoryMessage) victoryMessage.classList.remove("hidden");

            // Change proposal GIF to happy dancing Bubu Dudu GIF
            const proposalGif = document.getElementById("proposal-gif-img");
            if (proposalGif) {
                proposalGif.src = "https://raw.githubusercontent.com/Anshuwagh110/1_10-love/main/bubu-dancing-dance.gif";
            }

            const navToCall = document.getElementById("nav-to-call");
            if (navToCall) navToCall.classList.remove("hidden");

            // Celebrate with massive confetti bursts
            const end = Date.now() + (3 * 1000); // 3 seconds of celebration

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        });
    }

    // -----------------------------------------
    // 7. Love Calculator / Meter
    // -----------------------------------------
    const btnCalc = document.getElementById("btn-calc");
    const meterBar = document.getElementById("meter-bar");
    const lovePercentage = document.getElementById("love-percentage");
    const calcMessage = document.getElementById("calc-message");
    const calcHeartBtn = document.getElementById("calc-heart-btn");

    if (btnCalc && meterBar && lovePercentage && calcMessage) {
        btnCalc.addEventListener("click", () => {
            // Disable button during animation
            btnCalc.disabled = true;
            btnCalc.textContent = "Calculating...";

            // Reset UI states
            meterBar.style.width = "0%";
            lovePercentage.textContent = "0%";
            calcMessage.classList.add("hidden");

            // Reset calculator GIF to initial state
            const calcGif = document.getElementById("calc-gif-img");
            if (calcGif) {
                calcGif.src = "https://raw.githubusercontent.com/Anshuwagh110/1_10-love/main/bubu-bubu-dudu.gif";
            }

            // Run progress bar up to 100%
            setTimeout(() => {
                meterBar.style.width = "100%";
            }, 100);

            // Animate percentage count from 0% to 1000%
            let currentPercent = 0;
            const targetPercent = 1000;
            const duration = 2500; // 2.5 seconds
            const intervalTime = 20; // 20ms steps
            const increment = targetPercent / (duration / intervalTime);

            const timer = setInterval(() => {
                currentPercent += increment;
                if (currentPercent >= targetPercent) {
                    currentPercent = targetPercent;
                    clearInterval(timer);
                    
                    // Show final message
                    calcMessage.classList.remove("hidden");
                    btnCalc.disabled = false;
                    btnCalc.textContent = "Pyaar Dubara Naapein ✨";

                    // Change calculator GIF to celebration dancing GIF
                    const calcGif = document.getElementById("calc-gif-img");
                    if (calcGif) {
                        calcGif.src = "https://raw.githubusercontent.com/Anshuwagh110/1_10-love/main/bubu-dancing-dance.gif";
                    }

                    playSound("chime");
                    // Confetti explosion on reaching 1000%
                    confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.8 }
                    });

                    const navToNotes = document.getElementById("nav-to-notes");
                    if (navToNotes) navToNotes.classList.remove("hidden");
                }
                lovePercentage.textContent = `${Math.floor(currentPercent)}%`;
            }, intervalTime);
        });
    }

    // -----------------------------------------
    // 8. Double Click to Spawn Heart Burst
    // -----------------------------------------
    document.addEventListener("dblclick", (e) => {
        const burstHeart = document.createElement("div");
        burstHeart.className = "burst-heart";
        
        // Pick a random sweet emoji or icon
        const burstIcons = ["❤️", "💖", "🥰", "😘", "🧸", "✨", "🌹", "🐼"];
        burstHeart.innerHTML = burstIcons[Math.floor(Math.random() * burstIcons.length)];
        
        burstHeart.style.left = `${e.pageX}px`;
        burstHeart.style.top = `${e.pageY}px`;
        
        document.body.appendChild(burstHeart);
        
        setTimeout(() => {
            burstHeart.remove();
        }, 900);
    });

    // -----------------------------------------
    // 9. Countdown Timer to Girlfriend Day (August 1, 2026)
    // -----------------------------------------
    function startCountdown() {
        // Target Date: August 1st, 2026
        const targetDate = new Date("August 1, 2026 00:00:00").getTime();
        
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;
            
            if (difference <= 0) {
                clearInterval(countdownInterval);
                const timerHeader = document.querySelector(".countdown-container h3");
                if (timerHeader) timerHeader.textContent = "Happy Girlfriend Day! 🎉❤️";
                return;
            }
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            const dEl = document.getElementById("days");
            const hEl = document.getElementById("hours");
            const mEl = document.getElementById("minutes");
            const sEl = document.getElementById("seconds");
            
            if (dEl) dEl.textContent = String(days).padStart(2, '0');
            if (hEl) hEl.textContent = String(hours).padStart(2, '0');
            if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
            if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
        }, 1000);
    }
    startCountdown();

    // -----------------------------------------
    // 10. Message Board & LocalStorage Pinned Notes
    // -----------------------------------------
    const btnAddNote = document.getElementById("btn-add-note");
    const noteTextEl = document.getElementById("note-text");
    const notesGrid = document.getElementById("notes-grid");
    
    const noteClasses = ["note-pink", "note-yellow", "note-blue", "note-purple"];
    
    function createNoteDOM(text, author, isSavedOrSync = false) {
        if (!notesGrid) return;
        const note = document.createElement("div");
        
        // Randomly pick a color category
        const randomClass = noteClasses[Math.floor(Math.random() * noteClasses.length)];
        note.className = `sticky-note ${randomClass}`;
        
        note.innerHTML = `
            <p class="note-content">"${text}"</p>
            <span class="note-author">${author}</span>
        `;
        
        // Click sticky note to run a micro-bounce animation
        note.addEventListener("click", () => {
            playSound("flip");
            note.style.transform = "scale(1.1) rotate(0deg)";
            setTimeout(() => {
                note.style.transform = "";
            }, 800);
        });
        
        notesGrid.prepend(note);
        
        if (!isSavedOrSync) {
            if (isGistConfigured()) {
                db.notes.push({ text: text, author: author });
                saveToGist();
            } else {
                const saved = JSON.parse(localStorage.getItem("khushi_notes") || "[]");
                saved.push(text);
                localStorage.setItem("khushi_notes", JSON.stringify(saved));
            }
        }
    }
    
    if (btnAddNote && noteTextEl) {
        btnAddNote.addEventListener("click", () => {
            playSound("click");
            const text = noteTextEl.value.trim();
            if (!text) return;
            
            createNoteDOM(text, "- Khushi");
            noteTextEl.value = "";
            
            // Small success confetti burst on pinning a note
            confetti({
                particleCount: 30,
                spread: 40,
                origin: { y: 0.95 }
            });
        });
    }

    // -----------------------------------------
    // 11. Official Love Contract Logic
    // -----------------------------------------
    const termCheckboxes = document.querySelectorAll(".term-checkbox");
    const btnSignContract = document.getElementById("btn-sign-contract");
    const khushiSignature = document.getElementById("khushi-signature");
    const approvedStamp = document.getElementById("approved-stamp");

    if (termCheckboxes && btnSignContract) {
        termCheckboxes.forEach(cb => {
            cb.addEventListener("change", () => {
                const allChecked = Array.from(termCheckboxes).every(c => c.checked);
                btnSignContract.disabled = !allChecked;
            });
        });

        btnSignContract.addEventListener("click", () => {
            playSound("chime");
            termCheckboxes.forEach(c => c.disabled = true);
            btnSignContract.disabled = true;

            if (khushiSignature) {
                khushiSignature.textContent = "Khushi";
                khushiSignature.classList.add("active-sig");
            }

            if (approvedStamp) {
                approvedStamp.classList.remove("hidden");
            }

            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.7 }
            });

            // Save contract signed state
            db.contractSigned = true;
            db.signatureName = "Khushi";
            db.signatureDate = new Date().toISOString();
            
            if (isGistConfigured()) {
                saveToGist();
            } else {
                localStorage.setItem("contract_signed", "true");
            }

            const navToSlot = document.getElementById("nav-to-slot");
            if (navToSlot) navToSlot.classList.remove("hidden");
        });
    }

    // -----------------------------------------
    // 12. Pyaar Ka Slot Machine Logic
    // -----------------------------------------
    const btnRollSlot = document.getElementById("btn-roll-slot");
    const slotDisplay = document.getElementById("slot-display");
    const slotQuote = document.getElementById("slot-quote");
    const slotGif = document.getElementById("slot-gif");

    const compliments = [
        "Tumhari smile pure world ki sabse cute sound hai! 🎙️❤️",
        "Tumhare sath chup chap baithna bhi kisi therapy se kam nahi hai. 🧘‍♂️✨",
        "Meri life ki sabse badi achievement tumhara dil jeetna hai! 🏆",
        "Pata nahi tumhare paas kya magic hai, par tumhare bina mera din start nahi hota. ☕",
        "Agar main movie hota, toh tum uski sabse pyaari melody hoti. 🎼",
        "Duniya mein kitne bhi beautiful log hon, mere liye tum hamesha number one rahogi! 🥇",
        "Wese toh main bada seedha ladka hoon, par tumhari smile dekh kar meri line thodi cross ho jaati hai... 😉",
        "Tumhare cheeks jab chote se gusse mein red hote hain na, uff... main wahi fida ho jaata hoon! 😍"
    ];

    const slotGifs = [
        "https://raw.githubusercontent.com/Anshuwagh110/1_10-love/main/cute-adorable.gif",
        "https://raw.githubusercontent.com/Anshuwagh110/1_10-love/main/bubu-bubu-dudu.gif",
        "https://raw.githubusercontent.com/Anshuwagh110/1_10-love/main/bubu-dancing-dance.gif",
        "https://raw.githubusercontent.com/Anshuwagh110/1_10-love/main/couple-forgive-me.gif"
    ];

    if (btnRollSlot && slotDisplay && slotQuote && slotGif) {
        btnRollSlot.addEventListener("click", () => {
            btnRollSlot.disabled = true;
            slotDisplay.classList.add("spinning");
            slotQuote.textContent = "Rolling...";

            let rolls = 0;
            const rollInterval = setInterval(() => {
                const tempIndex = Math.floor(Math.random() * compliments.length);
                const tempGifIndex = Math.floor(Math.random() * slotGifs.length);
                slotQuote.textContent = compliments[tempIndex];
                slotGif.src = slotGifs[tempGifIndex];
                rolls++;
                
                if (rolls > 8) {
                    playSound("correct");
                    clearInterval(rollInterval);
                    const finalIndex = Math.floor(Math.random() * compliments.length);
                    const finalGifIndex = Math.floor(Math.random() * slotGifs.length);
                    
                    slotQuote.textContent = compliments[finalIndex];
                    slotGif.src = slotGifs[finalGifIndex];
                    slotDisplay.classList.remove("spinning");
                    btnRollSlot.disabled = false;

                    confetti({
                        particleCount: 20,
                        spread: 30,
                        origin: { y: 0.6 }
                    });

                    const navToBouquet = document.getElementById("nav-to-bouquet");
                    if (navToBouquet) navToBouquet.classList.remove("hidden");
                }
            }, 100);
        });
    }

    // -----------------------------------------
    // 13. Virtual Bouquet Builder Logic
    // -----------------------------------------
    const btnFlowerList = document.querySelectorAll(".btn-flower");
    const vaseVisual = document.getElementById("vase-visual");
    const btnGiftBouquet = document.getElementById("btn-gift-bouquet");
    const btnClearVase = document.getElementById("btn-clear-vase");
    const bouquetSuccessMsg = document.getElementById("bouquet-success-msg");

    let flowersCount = 0;
    const flowerEmojis = {
        rose: "🌹",
        tulip: "🌷",
        sunflower: "🌻",
        lavender: "🪻"
    };

    if (btnFlowerList && vaseVisual && btnGiftBouquet && btnClearVase) {
        btnFlowerList.forEach(btn => {
            btn.addEventListener("click", () => {
                const flowerType = btn.getAttribute("data-flower");
                const emoji = flowerEmojis[flowerType];
                
                const flowerNode = document.createElement("span");
                flowerNode.className = "flower-node";
                flowerNode.textContent = emoji;

                const randomX = Math.random() * 50 + 25; // 25% to 75%
                const randomY = Math.random() * 80 + 130; // 130px to 210px
                const randomRot = Math.random() * 40 - 20;

                flowerNode.style.left = `${randomX}%`;
                flowerNode.style.bottom = `${randomY}px`;
                flowerNode.style.setProperty("--rot", `${randomRot}deg`);

                vaseVisual.appendChild(flowerNode);
                flowersCount++;

                btnGiftBouquet.disabled = false;
                if (bouquetSuccessMsg) bouquetSuccessMsg.classList.add("hidden");
            });
        });

        btnGiftBouquet.addEventListener("click", () => {
            playSound("chime");
            if (bouquetSuccessMsg) bouquetSuccessMsg.classList.remove("hidden");
            btnGiftBouquet.disabled = true;

            confetti({
                particleCount: 60,
                spread: 50,
                origin: { y: 0.75 }
            });

            const navToQuiz = document.getElementById("nav-to-quiz");
            if (navToQuiz) navToQuiz.classList.remove("hidden");
        });

        btnClearVase.addEventListener("click", () => {
            const nodes = vaseVisual.querySelectorAll(".flower-node");
            nodes.forEach(n => n.remove());
            flowersCount = 0;
            btnGiftBouquet.disabled = true;
            if (bouquetSuccessMsg) bouquetSuccessMsg.classList.add("hidden");
        });
    }

    // -----------------------------------------
    // 14. Couple Trivia Quiz Logic
    // -----------------------------------------
    const btnNextQuestion = document.getElementById("btn-next-question");
    const quizCard = document.getElementById("quiz-card");
    const quizFinishedBox = document.getElementById("quiz-finished-box");
    const quizQnum = document.getElementById("quiz-qnum");
    const quizScoreVal = document.getElementById("quiz-score-val");
    const quizQuestion = document.getElementById("quiz-question");
    const quizOptionsContainer = document.getElementById("quiz-options");
    const quizFeedback = document.getElementById("quiz-feedback");
    const quizFeedbackText = document.getElementById("quiz-feedback-text");
    const quizFinalResult = document.getElementById("quiz-final-result");
    const btnRestartQuiz = document.getElementById("btn-restart-quiz");

    const quizQuestions = [
        {
            q: "Prashant ki life ki sabse badi khushi kaun hai?",
            options: [
                { text: "Burger aur Pizza 🍕", isCorrect: false },
                { text: "Pure din sona 😴", isCorrect: false },
                { text: "Mera bacha Khushi! 🥰", isCorrect: true }
            ],
            feedback: "Bilkul Sahi! Tum hi toh ho meri sabse badi Khushi... 💖"
        },
        {
            q: "Humare beech arguments mein sabse pehle kaun rota/chidhata hai?",
            options: [
                { text: "Khushi (chhoti si baat par) 🥺", isCorrect: false },
                { text: "Prashant (who apologizes immediately) 🙇‍♂️", isCorrect: true },
                { text: "Hum dono bohot samajhdaar hain 😇", isCorrect: false }
            ],
            feedback: "Haha Yes! Prashant ki double-speed apology letter incoming! 💌"
        },
        {
            q: "Prashant tumse kitna pyaar karta hai?",
            options: [
                { text: "100%", isCorrect: false },
                { text: "1000%", isCorrect: false },
                { text: "Infinitely, numbers fail! ♾️❤️", isCorrect: true }
            ],
            feedback: "Infinite and beyond! Is meter mein humara pyaar nahi sama sakta. 🚀"
        }
    ];

    let currentQIndex = 0;
    let quizScore = 0;
    let quizAnswered = false;

    function initQuiz() {
        currentQIndex = 0;
        quizScore = 0;
        quizAnswered = false;
        if (quizScoreVal) quizScoreVal.textContent = "0";
        if (quizCard) quizCard.classList.remove("hidden");
        if (quizFinishedBox) quizFinishedBox.classList.add("hidden");
        renderQuestion();
    }

    function renderQuestion() {
        quizAnswered = false;
        if (quizFeedback) quizFeedback.classList.add("hidden");
        
        const qData = quizQuestions[currentQIndex];
        if (quizQnum) quizQnum.textContent = `Question ${currentQIndex + 1} of ${quizQuestions.length}`;
        if (quizQuestion) quizQuestion.textContent = qData.q;
        
        if (quizOptionsContainer) {
            quizOptionsContainer.innerHTML = "";
            qData.options.forEach((opt, idx) => {
                const optBtn = document.createElement("button");
                optBtn.className = "btn-option";
                optBtn.textContent = opt.text;
                optBtn.addEventListener("click", () => handleAnswerSelect(optBtn, opt.isCorrect, qData.feedback));
                quizOptionsContainer.appendChild(optBtn);
            });
        }
    }

    function handleAnswerSelect(btnEl, isCorrect, feedbackText) {
        if (quizAnswered) return;
        quizAnswered = true;

        playSound(isCorrect ? "correct" : "wrong");

        const optionsBtns = quizOptionsContainer.querySelectorAll(".btn-option");
        optionsBtns.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            btnEl.classList.add("correct");
            quizScore++;
            if (quizScoreVal) quizScoreVal.textContent = quizScore;
            
            confetti({
                particleCount: 20,
                spread: 30,
                origin: { y: 0.6 }
            });
        } else {
            btnEl.classList.add("wrong");
            const correctOptIdx = quizQuestions[currentQIndex].options.findIndex(o => o.isCorrect);
            if (correctOptIdx !== -1) {
                optionsBtns[correctOptIdx].classList.add("correct");
            }
        }

        if (quizFeedbackText) quizFeedbackText.innerHTML = feedbackText;
        if (quizFeedback) quizFeedback.classList.remove("hidden");
    }

    if (btnNextQuestion) {
        btnNextQuestion.addEventListener("click", () => {
            playSound("click");
            currentQIndex++;
            if (currentQIndex < quizQuestions.length) {
                renderQuestion();
            } else {
                if (quizCard) quizCard.classList.add("hidden");
                if (quizFinishedBox) quizFinishedBox.classList.remove("hidden");
                if (quizFinalResult) {
                    quizFinalResult.innerHTML = `Aapne <strong>${quizScore}</strong> out of <strong>${quizQuestions.length}</strong> questions sahi guess kiye! 🎉<br>Humari chemistry sach mein top class hai. I love you so much, Khushi!`;
                }
                const navToReasons = document.getElementById("nav-to-reasons");
                if (navToReasons) navToReasons.classList.remove("hidden");
                playSound("chime");
            }
        });
    }

    if (btnRestartQuiz) btnRestartQuiz.addEventListener("click", initQuiz);
    initQuiz();

    // -----------------------------------------
    // 12. Heart Catcher Mini Game
    // -----------------------------------------
    const gameBox = document.getElementById("game-box");
    const gameBasket = document.getElementById("game-basket");
    const gameScoreVal = document.getElementById("game-score-val");
    const gameTimerVal = document.getElementById("game-timer-val");
    const gameOverlay = document.getElementById("game-overlay");
    const btnStartGame = document.getElementById("btn-start-game");
    const gameResultBox = document.getElementById("game-result-box");
    const gameResultText = document.getElementById("game-result-text");
    const btnRestartGame = document.getElementById("btn-restart-game");

    let gameScore = 0;
    let gameTimeLeft = 15;
    let gameInterval = null;
    let spawnInterval = null;
    let isGameRunning = false;
    let heartSpeed = 4; // pixels per frame

    // Move basket on mousemove
    if (gameBox && gameBasket) {
        gameBox.addEventListener("mousemove", (e) => {
            if (!isGameRunning) return;
            const rect = gameBox.getBoundingClientRect();
            // Calculate mouse position relative to game box
            let x = e.clientX - rect.left;
            
            // Constrain basket within gamebox boundary
            const basketWidth = gameBasket.offsetWidth;
            if (x < basketWidth / 2) x = basketWidth / 2;
            if (x > rect.width - basketWidth / 2) x = rect.width - basketWidth / 2;
            
            // Set basket left position
            gameBasket.style.left = `${x}px`;
        });

        // Mobile touch support
        gameBox.addEventListener("touchmove", (e) => {
            if (!isGameRunning) return;
            const rect = gameBox.getBoundingClientRect();
            let x = e.touches[0].clientX - rect.left;
            
            const basketWidth = gameBasket.offsetWidth;
            if (x < basketWidth / 2) x = basketWidth / 2;
            if (x > rect.width - basketWidth / 2) x = rect.width - basketWidth / 2;
            
            gameBasket.style.left = `${x}px`;
        }, { passive: true });
    }

    function startGame() {
        gameScore = 0;
        gameTimeLeft = 15;
        isGameRunning = true;
        if (gameScoreVal) gameScoreVal.textContent = "0";
        if (gameTimerVal) gameTimerVal.textContent = "15";
        if (gameOverlay) gameOverlay.classList.add("hidden");
        if (gameResultBox) gameResultBox.classList.add("hidden");

        // Timer countdown
        gameInterval = setInterval(() => {
            gameTimeLeft--;
            if (gameTimerVal) gameTimerVal.textContent = gameTimeLeft;
            
            if (gameTimeLeft <= 0) {
                endGame();
            }
        }, 1000);

        // Spawn falling hearts
        spawnInterval = setInterval(() => {
            createFallingHeartNode();
        }, 450);
    }

    function createFallingHeartNode() {
        if (!gameBox || !isGameRunning) return;

        const heartNode = document.createElement("div");
        heartNode.className = "falling-heart-node";
        
        // Randomly pick a heart/love symbol
        const heartSymbols = ["❤️", "💖", "🥰", "🌹", "🧸"];
        heartNode.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        const boxWidth = gameBox.clientWidth;
        const randomLeft = Math.random() * (boxWidth - 40);
        
        heartNode.style.left = `${randomLeft}px`;
        heartNode.style.top = `-30px`;
        
        gameBox.appendChild(heartNode);

        // Animate heart node falling downwards
        let topPos = -30;
        
        function fallStep() {
            if (!isGameRunning) {
                heartNode.remove();
                return;
            }

            topPos += heartSpeed;
            heartNode.style.top = `${topPos}px`;

            // Bounding collision checks with the cup
            const basketLeft = gameBasket.offsetLeft - gameBasket.offsetWidth / 2;
            const basketRight = gameBasket.offsetLeft + gameBasket.offsetWidth / 2;
            const basketTop = gameBasket.offsetTop;

            const heartLeft = heartNode.offsetLeft;
            const heartTop = heartNode.offsetTop;

            // Simple overlap bounding check
            if (heartTop >= basketTop - 25 && heartTop <= basketTop + 20 &&
                heartLeft >= basketLeft - 15 && heartLeft <= basketRight - 15) {
                // Heart caught!
                playSound("click");
                gameScore++;
                if (gameScoreVal) gameScoreVal.textContent = gameScore;
                heartNode.remove();
                
                // Small click feedback confetti burst
                return;
            }

            // Remove heart if it hits bottom boundary
            if (topPos > gameBox.clientHeight) {
                heartNode.remove();
            } else {
                requestAnimationFrame(fallStep);
            }
        }
        
        requestAnimationFrame(fallStep);
    }

    function endGame() {
        isGameRunning = false;
        clearInterval(gameInterval);
        clearInterval(spawnInterval);

        // Clear all remaining falling nodes
        const nodes = document.querySelectorAll(".falling-heart-node");
        nodes.forEach(n => n.remove());

        // Reveal game completion box
        if (gameResultBox) gameResultBox.classList.remove("hidden");
        if (gameResultText) {
            gameResultText.innerHTML = `Khushi, aapne <strong>${gameScore}</strong> points score kiye! 🎉<br>Lekin real calculator toh batata hai ki Prashant ne aapke liye laakhon feelings capture kar rakhi hain... ❤️`;
        }

        playSound("chime");
        // Celebrate success
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 }
        });

        const navToCarousel = document.getElementById("nav-to-carousel");
        if (navToCarousel) navToCarousel.classList.remove("hidden");
    }

    if (btnStartGame) btnStartGame.addEventListener("click", startGame);
    if (btnRestartGame) btnRestartGame.addEventListener("click", startGame);

    // -----------------------------------------
    // 13. HTML5 Canvas Surprise Scratch Cards
    // -----------------------------------------
    const scratchCanvases = document.querySelectorAll(".scratch-canvas");
    const resetScratchBtn = document.getElementById("btn-reset-scratch");

    if (scratchCanvases.length > 0) {
        function initScratchCard(canvas) {
            const ctx = canvas.getContext("2d");
            const box = canvas.closest(".scratch-card-box");
            if (!box) return;

            // Set size match to parent box (use fallback 280x240 if hidden on load)
            canvas.width = box.offsetWidth || 280;
            canvas.height = box.offsetHeight || 240;

            ctx.globalCompositeOperation = "source-over";

            // Draw a solid silver gradient paint overlay
            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, "#ff8fa3");
            grad.addColorStop(0.5, "#ffccd5");
            grad.addColorStop(1, "#ff758f");
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add instruction text
            ctx.font = "bold 1.1rem Poppins, sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Scratch Karein ✨", canvas.width / 2, canvas.height / 2);
            
            ctx.font = "0.7rem Poppins, sans-serif";
            ctx.fillText("(Click & Drag)", canvas.width / 2, canvas.height / 2 + 25);

            canvas.style.opacity = "1";
            canvas.style.pointerEvents = "auto";
            canvas.style.transition = "none";
        }

        function setupScratchListeners(canvas) {
            const ctx = canvas.getContext("2d");
            let isDrawing = false;

            function scratch(clientX, clientY) {
                const rect = canvas.getBoundingClientRect();
                const x = clientX - rect.left;
                const y = clientY - rect.top;

                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                ctx.arc(x, y, 22, 0, Math.PI * 2);
                ctx.fill();
            }

            // Mouse Events
            canvas.addEventListener("mousedown", (e) => {
                isDrawing = true;
                scratch(e.clientX, e.clientY);
            });

            canvas.addEventListener("mousemove", (e) => {
                if (isDrawing) {
                    scratch(e.clientX, e.clientY);
                }
            });

            window.addEventListener("mouseup", () => {
                if (isDrawing) {
                    isDrawing = false;
                    checkPercent();
                }
            });

            // Touch Events
            canvas.addEventListener("touchstart", (e) => {
                isDrawing = true;
                const touch = e.touches[0];
                scratch(touch.clientX, touch.clientY);
            });

            canvas.addEventListener("touchmove", (e) => {
                if (isDrawing) {
                    const touch = e.touches[0];
                    scratch(touch.clientX, touch.clientY);
                }
            });

            canvas.addEventListener("touchend", () => {
                isDrawing = false;
                checkPercent();
            });

            function checkPercent() {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imgData.data;
                let transparentCount = 0;

                for (let i = 3; i < pixels.length; i += 4) {
                    if (pixels[i] === 0) {
                        transparentCount++;
                    }
                }

                const percent = (transparentCount / (pixels.length / 4)) * 100;
                
                if (percent > 40) {
                    canvas.style.transition = "opacity 0.8s ease";
                    canvas.style.opacity = "0";
                    canvas.style.pointerEvents = "none";

                    playSound("chime");
                    // Celebrate reveal!
                    confetti({
                        particleCount: 40,
                        spread: 40,
                        origin: { y: 0.75 }
                    });

                    const navToCalc = document.getElementById("nav-to-calc");
                    if (navToCalc) navToCalc.classList.remove("hidden");
                }
            }
        }

        // Initialize all cards
        function initAllScratchCards() {
            scratchCanvases.forEach(canvas => {
                initScratchCard(canvas);
            });
        }
        window.initAllScratchCardsGlobal = initAllScratchCards;

        scratchCanvases.forEach(canvas => {
            setupScratchListeners(canvas);
        });

        if (resetScratchBtn) {
            resetScratchBtn.addEventListener("click", initAllScratchCards);
        }

        window.addEventListener("load", () => {
            setTimeout(initAllScratchCards, 300);
        });
    }

    // -----------------------------------------
    // 14.5. Cute Pics Carousel Slideshow Logic
    // -----------------------------------------
    const carouselImages = [
        "image/457128556_1195970734954852_2799928085898927945_n_1195970731621519.jpg",
        "image/481311967_2437469753282707_1813172007490226648_n_2437469749949374.jpg",
        "image/IMG_1991.JPG",
        "image/IMG_2123.JPG",
        "image/IMG_2298.JPG",
        "image/IMG_2308.JPG",
        "image/IMG_2311.JPG",
        "image/IMG_3064.JPG",
        "image/IMG_3484.JPG",
        "image/IMG_4807.JPG",
        "image/IMG_5392.JPG",
        "image/Snapchat-12831284.jpg",
        "image/Snapchat-2058885309.jpg",
        "image/Snapchat-222406974.jpg",
        "image/Snapchat-357688198.jpg",
        "image/Snapchat-657655642.jpg",
        "image/Snapchat-872738059.jpg",
        "image/copy_8AA2D4C0-82C8-4E51-B652-EEA191D83684.jpeg",
        "image/fc6b06cd-362f-445d-a344-acc563bf630f.jpg"
    ];

    const carouselImg = document.getElementById("carousel-img");
    const btnCarouselPrev = document.getElementById("btn-carousel-prev");
    const btnCarouselNext = document.getElementById("btn-carousel-next");
    
    let carouselIdx = 0;
    let carouselInterval = null;

    function startCarousel() {
        if (!carouselImg) return;
        stopCarousel();
        carouselInterval = setInterval(() => {
            navigateCarousel(1);
        }, 2800);
    }

    function stopCarousel() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
            carouselInterval = null;
        }
    }

    function navigateCarousel(direction) {
        if (!carouselImg) return;
        
        carouselImg.style.opacity = "0";
        carouselImg.style.transform = "scale(0.95)";
        
        setTimeout(() => {
            carouselIdx = (carouselIdx + direction + carouselImages.length) % carouselImages.length;
            carouselImg.src = carouselImages[carouselIdx];
            
            carouselImg.style.opacity = "1";
            carouselImg.style.transform = "scale(1)";
        }, 300);
    }

    if (btnCarouselPrev) {
        btnCarouselPrev.addEventListener("click", () => {
            playSound("click");
            stopCarousel();
            navigateCarousel(-1);
            startCarousel();
        });
    }

    if (btnCarouselNext) {
        btnCarouselNext.addEventListener("click", () => {
            playSound("click");
            stopCarousel();
            navigateCarousel(1);
            startCarousel();
        });
    }

    // -----------------------------------------
    // 15. Page by Page Slide Transitions & Sound Integration
    // -----------------------------------------
    const nextSlideBtns = document.querySelectorAll(".next-slide-btn");
    nextSlideBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            playSound("click");
            const currentSlide = btn.closest(".screen-slide");
            const nextSlideId = btn.getAttribute("data-next");
            const nextSlide = document.getElementById(nextSlideId);

            if (currentSlide && nextSlide) {
                currentSlide.classList.remove("active-slide");
                nextSlide.classList.add("active-slide");
                
                // Jump to top instantly so next screen views cleanly
                window.scrollTo({ top: 0, behavior: "instant" });

                // Start/Stop carousel timer
                if (nextSlideId === "carousel-section") {
                    startCarousel();
                } else {
                    stopCarousel();
                }

                // Re-initialize scratch cards once their section goes active/visible
                if (nextSlideId === "scratch-section" && window.initAllScratchCardsGlobal) {
                    window.initAllScratchCardsGlobal();
                }
            }
        });
    });

    const prevSlideBtns = document.querySelectorAll(".prev-slide-btn");
    prevSlideBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            playSound("click");
            const currentSlide = btn.closest(".screen-slide");
            const prevSlideId = btn.getAttribute("data-prev");
            const prevSlide = document.getElementById(prevSlideId);

            if (currentSlide && prevSlide) {
                currentSlide.classList.remove("active-slide");
                prevSlide.classList.add("active-slide");
                window.scrollTo({ top: 0, behavior: "instant" });

                // Start/Stop carousel timer
                if (prevSlideId === "carousel-section") {
                    startCarousel();
                } else {
                    stopCarousel();
                }
            }
        });
    });

    const scrollBtn = document.querySelector(".scroll-btn");
    if (scrollBtn) {
        scrollBtn.addEventListener("click", (e) => {
            e.preventDefault();
            playSound("click");
            const hero = document.getElementById("hero");
            const envelope = document.getElementById("envelope-section");
            if (hero && envelope) {
                hero.classList.remove("active-slide");
                envelope.classList.add("active-slide");
                window.scrollTo({ top: 0, behavior: "instant" });
            }
        });
    }

    // -----------------------------------------
    // 16. Polaroid Flip Card Logic (Enforces strict gallery review lock)
    // -----------------------------------------
    const polaroidFrames = document.querySelectorAll(".polaroid-frame");
    const flippedPolaroids = new Set();

    polaroidFrames.forEach((frame, idx) => {
        frame.addEventListener("click", () => {
            playSound("flip");
            frame.classList.toggle("flipped");
            
            if (frame.classList.contains("flipped")) {
                flippedPolaroids.add(idx);
                // Once all 3 cards have been flipped at least once, unlock surprises next button
                if (flippedPolaroids.size === polaroidFrames.length) {
                    const navToScratch = document.getElementById("nav-to-scratch");
                    if (navToScratch) {
                        navToScratch.classList.remove("hidden");
                        setTimeout(() => {
                            navToScratch.scrollIntoView({ behavior: "smooth" });
                        }, 300);
                    }
                }
            }
        });
    });

    // -----------------------------------------
    // 17. Phone Call Simulation Logic
    // -----------------------------------------
    const callSlider = document.getElementById("call-slider");
    const incomingCallScreen = document.getElementById("incoming-call-screen");
    const activeCallScreen = document.getElementById("active-call-screen");
    const callTimer = document.getElementById("call-timer");
    const callCaption = document.getElementById("call-caption");
    const btnHangup = document.getElementById("btn-hangup");
    const navToGame = document.getElementById("nav-to-game");
    
    let callTimerInterval = null;
    let callSeconds = 0;
    let callActive = false;

    if (callSlider) {
        callSlider.addEventListener("input", () => {
            if (parseInt(callSlider.value) >= 90 && !callActive) {
                callActive = true;
                answerCall();
            }
        });
    }

    function answerCall() {
        playSound("chime");
        if (incomingCallScreen) incomingCallScreen.classList.add("hidden");
        if (activeCallScreen) activeCallScreen.classList.remove("hidden");
        
        // Start background music automatically if not playing
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().then(() => {
                if (musicBtn) musicBtn.classList.add("playing");
                if (musicText) musicText.textContent = "Music Stop Karein 🎵";
            }).catch(err => console.log("Audio play blocked by browser policies: ", err));
        }

        // Start Call Timer counter
        callSeconds = 0;
        callTimerInterval = setInterval(() => {
            callSeconds++;
            const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
            const secs = String(callSeconds % 60).padStart(2, '0');
            if (callTimer) callTimer.textContent = `${mins}:${secs}`;
        }, 1000);

        // Sequence simulated dialogues subtitles
        const dialogues = [
            { text: "Prashant: \"Hello bacha! Sunaayi de raha hai? ❤️\"", delay: 800 },
            { text: "Prashant: \"Maine socha direct call karke batayein ki aap mere liye kitni special ho...\"", delay: 4200 },
            { text: "Prashant: \"Tumhari aawaz, tumhare cute nakhre, tumhari hasi—sabse bada sukoon hai mera.\"", delay: 8500 },
            { text: "Prashant: \"I love you very much, Khushi. Ab call hang-up karo aur next game par chalo! 😘\"", delay: 13000 }
        ];

        dialogues.forEach((d, idx) => {
            setTimeout(() => {
                if (callCaption) {
                    callCaption.style.opacity = "0";
                    setTimeout(() => {
                        callCaption.textContent = d.text;
                        callCaption.style.opacity = "1";
                    }, 300);
                }
            }, d.delay);
        });

        // Set hanging up unlock button highlight
        setTimeout(() => {
            if (btnHangup) btnHangup.classList.add("pulse-hangup");
        }, 13000);
    }

    if (btnHangup) {
        btnHangup.addEventListener("click", () => {
            playSound("click");
            clearInterval(callTimerInterval);
            if (callCaption) callCaption.textContent = "Call Ended.";
            btnHangup.disabled = true;
            btnHangup.classList.remove("pulse-hangup");
            
            // Show Next Button
            if (navToGame) navToGame.classList.remove("hidden");
        });
    }

    // -----------------------------------------
    // 18. Synthesized Web Audio Sound Chimes
    // -----------------------------------------
    function playSound(type) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            if (type === "click") {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } else if (type === "chime") {
                // Ascending magical arpeggio
                const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
                notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
                    gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + idx * 0.08);
                    osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
                });
            } else if (type === "correct") {
                // Happy double beep
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const gain1 = ctx.createGain();
                const gain2 = ctx.createGain();
                osc1.type = "sine";
                osc2.type = "sine";
                osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
                gain1.gain.setValueAtTime(0.08, ctx.currentTime);
                gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.1);
                gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc1.start();
                osc1.stop(ctx.currentTime + 0.25);
                osc2.start(ctx.currentTime + 0.1);
                osc2.stop(ctx.currentTime + 0.35);
            } else if (type === "wrong") {
                // Sad descending note
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.4);
            } else if (type === "flip") {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(320, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.15);
            }
        } catch (e) {
            console.log("Audio Context blocked or failed:", e);
        }
    }

    // -----------------------------------------
    // 19. GitHub Gist Database Real-time Sync
    // -----------------------------------------
    function isGistConfigured() {
        return GIST_ID.trim() !== "" && GIST_TOKEN.trim() !== "";
    }

    async function syncFromGist() {
        if (!isGistConfigured()) {
            loadLocalNotes();
            return;
        }

        try {
            const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                headers: {
                    "Authorization": `token ${GIST_TOKEN.trim()}`
                }
            });
            if (!res.ok) throw new Error("Gist fetch failed");
            const data = await res.json();
            const content = data.files["database.json"].content;
            db = JSON.parse(content);
            
            // Re-render UI based on retrieved database state
            renderGistNotes();
            applyGistContractState();
        } catch (err) {
            console.error("Error syncing from Gist, falling back to LocalStorage:", err);
            loadLocalNotes();
        }
    }

    function renderGistNotes() {
        if (!notesGrid) return;
        // Keep initial Prashant notes, clear dynamic ones
        notesGrid.innerHTML = `
            <div class="sticky-note note-pink">
                <p class="note-content">"Hamesha tumhara nakhra handle karunga 💖"</p>
                <span class="note-author">- Prashant</span>
            </div>
            <div class="sticky-note note-yellow">
                <p class="note-content">"Hamesha tumhein khush rakhne ki guarantee! 💖"</p>
                <span class="note-author">- Prashant</span>
            </div>
            <div class="sticky-note note-blue">
                <p class="note-content">"Always there to hold your hand, chahe situation jo bhi ho. 🤝"</p>
                <span class="note-author">- Prashant</span>
            </div>
        `;

        db.notes.forEach(note => {
            createNoteDOM(note.text, note.author, true); // true: do not save back to Gist during sync
        });
    }

    function applyGistContractState() {
        if (db.contractSigned) {
            // Disable inputs and sign contract in UI
            if (termCheckboxes) {
                termCheckboxes.forEach(c => {
                    c.checked = true;
                    c.disabled = true;
                });
            }
            if (btnSignContract) btnSignContract.disabled = true;
            if (khushiSignature) {
                khushiSignature.textContent = db.signatureName || "Khushi";
                khushiSignature.classList.add("active-sig");
            }
            if (approvedStamp) approvedStamp.classList.remove("hidden");
            
            // Instantly unlock the slot machine next button if contract was approved
            const navToSlot = document.getElementById("nav-to-slot");
            if (navToSlot) navToSlot.classList.remove("hidden");
        }
    }

    async function saveToGist() {
        if (!isGistConfigured()) return;
        try {
            const body = {
                files: {
                    "database.json": {
                        content: JSON.stringify(db, null, 2)
                    }
                }
            };
            const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `token ${GIST_TOKEN.trim()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error("Gist patch failed");
        } catch (err) {
            console.error("Error saving to Gist:", err);
        }
    }

    function loadLocalNotes() {
        const saved = JSON.parse(localStorage.getItem("khushi_notes") || "[]");
        saved.forEach(text => {
            createNoteDOM(text, "- Khushi", true);
        });
        
        // Local contract signature check
        const signed = localStorage.getItem("contract_signed");
        if (signed === "true") {
            db.contractSigned = true;
            db.signatureName = "Khushi";
            applyGistContractState();
        }
    }

    // Trigger initial Gist sync
    syncFromGist();
});
