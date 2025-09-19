// TypeMaster - Advanced Typing Practice Application
class TypeMaster {
    constructor() {
        this.currentUser = null;
        this.currentSession = null;
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.errors = 0;
        this.totalChars = 0;
        this.isRacing = false;
        this.raceInterval = null;
        this.opponentProgress = 0;
        
        // Sample data from provided JSON
        this.sampleTexts = [
            "The quick brown fox jumps over the lazy dog.",
            "Programming is both an art and a science that requires logical thinking.",
            "TypeScript brings static typing to JavaScript for better development experience.",
            "Modern web applications require scalable and maintainable architecture patterns.",
            "Effective keyboard skills significantly improve productivity in digital work environments."
        ];
        
        this.difficultyLevels = [
            { level: 1, name: "Beginner", characters: "asdf jkl;", minWPM: 0, maxWPM: 15 },
            { level: 2, name: "Intermediate", characters: "asdfgh jkl;'", minWPM: 15, maxWPM: 30 },
            { level: 3, name: "Advanced", characters: "qwertyuiop asdfghjkl; zxcvbnm", minWPM: 30, maxWPM: 50 },
            { level: 4, name: "Expert", characters: "full alphabet + numbers + punctuation", minWPM: 50, maxWPM: 999 }
        ];
        
        this.achievements = [
            { id: "first_lesson", name: "Getting Started", description: "Complete your first lesson", icon: "🎯" },
            { id: "speed_demon", name: "Speed Demon", description: "Reach 60 WPM", icon: "⚡" },
            { id: "accuracy_master", name: "Accuracy Master", description: "Achieve 95% accuracy", icon: "🎯" },
            { id: "consistent_practice", name: "Consistent Practice", description: "Practice for 7 days straight", icon: "🔥" },
            { id: "race_winner", name: "Race Winner", description: "Win your first multiplayer race", icon: "🏆" }
        ];
    }
    
    init() {
        console.log('TypeMaster initializing...');
        this.loadUserData();
        this.setupEventListeners();
        this.showSection('landing');
        this.updateUI();
        this.generateLeaderboard();
        console.log('TypeMaster initialized successfully');
    }
    
    loadUserData() {
        try {
            const userData = localStorage.getItem('typeMasterUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.updateUserProfile();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
    
    saveUserData() {
        try {
            if (this.currentUser) {
                localStorage.setItem('typeMasterUser', JSON.stringify(this.currentUser));
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        console.log('Found nav buttons:', navButtons.length);
        
        navButtons.forEach((btn, index) => {
            const section = btn.getAttribute('data-section');
            console.log(`Setting up nav button ${index}: ${section}`);
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Nav button clicked: ${section}`);
                this.showSection(section);
            });
        });
        
        // Hero action buttons
        const guestButtons = document.querySelectorAll('[data-action="guest-mode"]');
        console.log('Found guest mode buttons:', guestButtons.length);
        
        guestButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Guest mode clicked');
                this.startGuestMode();
            });
        });
        
        const startPracticeButtons = document.querySelectorAll('[data-action="start-practice"]');
        console.log('Found start practice buttons:', startPracticeButtons.length);
        
        startPracticeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Start practice clicked');
                if (!this.currentUser) {
                    this.showModal('loginModal');
                } else {
                    this.showSection('practice');
                    this.startNewSession();
                }
            });
        });
        
        // Authentication
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Login button clicked');
                this.showModal('loginModal');
            });
        }
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
        
        // Practice controls
        const difficultySelect = document.getElementById('difficultySelect');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', () => {
                this.generateAdaptiveText();
            });
        }
        
        const typingInput = document.getElementById('typingInput');
        if (typingInput) {
            typingInput.addEventListener('input', (e) => {
                this.handleTyping(e.target.value);
            });
        }
        
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.restartSession();
            });
        }
        
        const newTextBtn = document.getElementById('newTextBtn');
        if (newTextBtn) {
            newTextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateAdaptiveText();
                this.restartSession();
            });
        }
        
        // Results modal
        const practiceAgainBtn = document.getElementById('practiceAgainBtn');
        if (practiceAgainBtn) {
            practiceAgainBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('resultsModal');
                this.startNewSession();
            });
        }
        
        // Multiplayer
        const quickRaceBtn = document.getElementById('quickRaceBtn');
        if (quickRaceBtn) {
            quickRaceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startQuickRace();
            });
        }
        
        const createRaceBtn = document.getElementById('createRaceBtn');
        if (createRaceBtn) {
            createRaceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.createPrivateRace();
            });
        }
        
        const raceTypingInput = document.getElementById('raceTypingInput');
        if (raceTypingInput) {
            raceTypingInput.addEventListener('input', (e) => {
                if (this.isRacing) {
                    this.handleRaceTyping(e.target.value);
                }
            });
        }
        
        // Leaderboard filters
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.generateLeaderboard(e.target.getAttribute('data-filter'));
            });
        });
        
        // Modal controls
        const modalCloseButtons = document.querySelectorAll('.modal-close');
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });
        
        // Click outside modal to close
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
        
        console.log('Event listeners setup complete');
    }
    
    showSection(sectionName) {
        console.log(`Showing section: ${sectionName}`);
        
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        console.log(`Found ${sections.length} sections`);
        
        sections.forEach((section, index) => {
            section.style.display = 'none';
            console.log(`Hiding section ${index}: ${section.id}`);
        });
        
        // Show the requested section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.style.display = 'block';
            console.log(`Showing target section: ${sectionName}`);
        } else {
            console.error(`Section not found: ${sectionName}`);
        }
        
        // Update navigation state
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            console.log(`Activated nav button for: ${sectionName}`);
        }
        
        // Load section-specific data
        if (sectionName === 'dashboard') {
            this.updateDashboard();
        } else if (sectionName === 'leaderboard') {
            this.generateLeaderboard();
        } else if (sectionName === 'multiplayer') {
            this.resetMultiplayerView();
        }
    }
    
    startGuestMode() {
        console.log('Starting guest mode...');
        this.currentUser = { 
            username: 'Guest', 
            isGuest: true, 
            stats: this.getDefaultStats(),
            sessions: [],
            achievements: []
        };
        this.updateUserProfile();
        this.showSection('practice');
        this.startNewSession();
        console.log('Guest mode started successfully');
    }
    
    showModal(modalId) {
        console.log(`Showing modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    hideModal(modalId) {
        console.log(`Hiding modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        // Simulate authentication
        let user = this.getUserFromStorage(username);
        
        if (user && user.password === password) {
            this.currentUser = user;
            this.updateUserProfile();
            this.hideModal('loginModal');
            this.showSection('practice');
            this.startNewSession();
            // Clear form
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        } else {
            alert('Invalid credentials');
        }
    }
    
    handleRegister() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        if (this.getUserFromStorage(username)) {
            alert('Username already exists');
            return;
        }
        
        const newUser = {
            username,
            password,
            stats: this.getDefaultStats(),
            sessions: [],
            achievements: [],
            createdAt: new Date().toISOString()
        };
        
        this.saveUserToStorage(newUser);
        this.currentUser = newUser;
        this.updateUserProfile();
        this.hideModal('loginModal');
        this.showSection('practice');
        this.startNewSession();
        
        // Clear form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
    
    logout() {
        this.currentUser = null;
        this.updateUserProfile();
        this.showSection('landing');
    }
    
    getUserFromStorage(username) {
        try {
            const users = JSON.parse(localStorage.getItem('typeMasterUsers') || '{}');
            return users[username];
        } catch (error) {
            console.error('Error getting user from storage:', error);
            return null;
        }
    }
    
    saveUserToStorage(user) {
        try {
            const users = JSON.parse(localStorage.getItem('typeMasterUsers') || '{}');
            users[user.username] = user;
            localStorage.setItem('typeMasterUsers', JSON.stringify(users));
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    }
    
    getDefaultStats() {
        return {
            bestWPM: 0,
            bestAccuracy: 0,
            totalSessions: 0,
            totalTime: 0,
            totalChars: 0,
            currentLevel: 1,
            weakChars: {},
            streak: 0,
            lastPracticeDate: null
        };
    }
    
    updateUserProfile() {
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');
        const userName = document.getElementById('userName');
        
        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userProfile) userProfile.style.display = 'flex';
            if (userName) userName.textContent = this.currentUser.username;
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userProfile) userProfile.style.display = 'none';
        }
    }
    
    startNewSession() {
        console.log('Starting new session...');
        this.currentSession = {
            startTime: new Date(),
            wpm: 0,
            accuracy: 100,
            errors: 0,
            totalChars: 0
        };
        
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.errors = 0;
        this.totalChars = 0;
        
        this.generateAdaptiveText();
        this.resetTypingInput();
        this.updateStats();
        console.log('New session started');
    }
    
    generateAdaptiveText() {
        const difficultySelect = document.getElementById('difficultySelect');
        const difficulty = difficultySelect ? parseInt(difficultySelect.value) : 1;
        const difficultyLevel = this.difficultyLevels[difficulty - 1];
        
        let text;
        if (difficulty <= 2) {
            // For beginners, generate practice text with specific characters
            text = this.generateCharacterPractice(difficultyLevel.characters);
        } else {
            // For advanced users, use sample texts with weak character focus
            text = this.generateAdaptiveTextFromSamples();
        }
        
        this.currentText = text;
        this.displayText();
        console.log('Generated text:', text);
    }
    
    generateCharacterPractice(characters) {
        const chars = characters.replace(/ /g, '').split('');
        let practice = '';
        
        for (let i = 0; i < 50; i++) {
            if (i > 0 && i % 5 === 0) {
                practice += ' ';
            }
            practice += chars[Math.floor(Math.random() * chars.length)];
        }
        
        return practice.trim();
    }
    
    generateAdaptiveTextFromSamples() {
        const userStats = this.currentUser?.stats;
        let selectedText = this.sampleTexts[Math.floor(Math.random() * this.sampleTexts.length)];
        
        // If user has weak characters, focus on them
        if (userStats && userStats.weakChars && Object.keys(userStats.weakChars).length > 0) {
            const weakChars = Object.keys(userStats.weakChars);
            selectedText = this.sampleTexts.find(text => 
                weakChars.some(char => text.includes(char))
            ) || selectedText;
        }
        
        return selectedText;
    }
    
    displayText() {
        const textDisplay = document.getElementById('textDisplay');
        if (!textDisplay) return;
        
        textDisplay.innerHTML = '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const span = document.createElement('span');
            span.textContent = this.currentText[i];
            span.className = 'char';
            if (i === 0) span.classList.add('current');
            textDisplay.appendChild(span);
        }
    }
    
    resetTypingInput() {
        const input = document.getElementById('typingInput');
        if (input) {
            input.value = '';
            setTimeout(() => input.focus(), 100);
        }
    }
    
    handleTyping(inputValue) {
        if (!this.startTime) {
            this.startTime = new Date();
        }
        
        const chars = document.querySelectorAll('#textDisplay .char');
        this.totalChars = inputValue.length;
        
        // Clear all classes first
        chars.forEach(char => {
            char.classList.remove('correct', 'incorrect', 'current');
        });
        
        let errors = 0;
        
        for (let i = 0; i < inputValue.length; i++) {
            if (i < chars.length) {
                if (inputValue[i] === this.currentText[i]) {
                    chars[i].classList.add('correct');
                } else {
                    chars[i].classList.add('incorrect');
                    errors++;
                    this.trackWeakCharacter(this.currentText[i]);
                }
            }
        }
        
        // Highlight current character
        if (inputValue.length < chars.length) {
            chars[inputValue.length].classList.add('current');
            this.highlightNextKey(this.currentText[inputValue.length]);
        }
        
        this.errors = errors;
        this.currentIndex = inputValue.length;
        
        this.updateStats();
        
        // Check if text is completed
        if (inputValue.length === this.currentText.length) {
            this.completeSession();
        }
    }
    
    trackWeakCharacter(char) {
        if (this.currentUser && !this.currentUser.isGuest) {
            if (!this.currentUser.stats.weakChars) {
                this.currentUser.stats.weakChars = {};
            }
            this.currentUser.stats.weakChars[char] = (this.currentUser.stats.weakChars[char] || 0) + 1;
        }
    }
    
    updateStats() {
        if (this.startTime) {
            const timeElapsed = (new Date() - this.startTime) / 1000 / 60; // minutes
            const wpm = Math.round((this.totalChars / 5) / timeElapsed) || 0;
            const accuracy = this.totalChars > 0 ? Math.round(((this.totalChars - this.errors) / this.totalChars) * 100) : 100;
            
            const currentWPM = document.getElementById('currentWPM');
            const currentAccuracy = document.getElementById('currentAccuracy');
            const practiceTime = document.getElementById('practiceTime');
            
            if (currentWPM) currentWPM.textContent = wpm;
            if (currentAccuracy) currentAccuracy.textContent = accuracy + '%';
            
            if (practiceTime) {
                const time = Math.floor((new Date() - this.startTime) / 1000);
                const minutes = Math.floor(time / 60);
                const seconds = time % 60;
                practiceTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (this.currentSession) {
                this.currentSession.wpm = wpm;
                this.currentSession.accuracy = accuracy;
                this.currentSession.errors = this.errors;
                this.currentSession.totalChars = this.totalChars;
            }
        }
    }
    
    completeSession() {
        this.endTime = new Date();
        const sessionData = {
            ...this.currentSession,
            endTime: this.endTime,
            duration: (this.endTime - this.startTime) / 1000,
            text: this.currentText,
            difficulty: parseInt(document.getElementById('difficultySelect')?.value || '1')
        };
        
        this.saveSessionData(sessionData);
        this.updateUserStats(sessionData);
        this.checkAchievements(sessionData);
        this.showResults(sessionData);
    }
    
    saveSessionData(sessionData) {
        if (this.currentUser && !this.currentUser.isGuest) {
            if (!this.currentUser.sessions) {
                this.currentUser.sessions = [];
            }
            this.currentUser.sessions.push(sessionData);
            this.saveUserData();
        }
    }
    
    updateUserStats(sessionData) {
        if (this.currentUser) {
            const stats = this.currentUser.stats;
            stats.totalSessions++;
            stats.totalTime += sessionData.duration;
            stats.totalChars += sessionData.totalChars;
            
            if (sessionData.wpm > stats.bestWPM) {
                stats.bestWPM = sessionData.wpm;
            }
            
            if (sessionData.accuracy > stats.bestAccuracy) {
                stats.bestAccuracy = sessionData.accuracy;
            }
            
            // Update streak
            const today = new Date().toDateString();
            if (stats.lastPracticeDate === today) {
                // Same day, don't increment streak
            } else if (stats.lastPracticeDate === new Date(Date.now() - 86400000).toDateString()) {
                // Yesterday, increment streak
                stats.streak++;
            } else {
                // Gap in practice, reset streak
                stats.streak = 1;
            }
            stats.lastPracticeDate = today;
            
            // Auto-level up based on performance
            if (sessionData.wpm >= this.difficultyLevels[stats.currentLevel - 1].maxWPM && sessionData.accuracy >= 90) {
                if (stats.currentLevel < this.difficultyLevels.length) {
                    stats.currentLevel++;
                }
            }
            
            if (!this.currentUser.isGuest) {
                this.saveUserData();
            }
        }
    }
    
    checkAchievements(sessionData) {
        if (!this.currentUser || this.currentUser.isGuest) return;
        
        const stats = this.currentUser.stats;
        const achievements = this.currentUser.achievements || [];
        
        // Check each achievement
        const achievementChecks = {
            'first_lesson': () => stats.totalSessions >= 1,
            'speed_demon': () => sessionData.wpm >= 60,
            'accuracy_master': () => sessionData.accuracy >= 95,
            'consistent_practice': () => stats.streak >= 7,
            'race_winner': () => false // Will be implemented in multiplayer
        };
        
        Object.keys(achievementChecks).forEach(achievementId => {
            if (!achievements.includes(achievementId) && achievementChecks[achievementId]()) {
                achievements.push(achievementId);
                this.showAchievementNotification(achievementId);
            }
        });
        
        this.currentUser.achievements = achievements;
        this.saveUserData();
    }
    
    showAchievementNotification(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement) {
            // Simple notification - could be enhanced with a toast system
            setTimeout(() => {
                alert(`🎉 Achievement Unlocked: ${achievement.name}\n${achievement.description}`);
            }, 1000);
        }
    }
    
    showResults(sessionData) {
        const resultWPM = document.getElementById('resultWPM');
        const resultAccuracy = document.getElementById('resultAccuracy');
        const resultTime = document.getElementById('resultTime');
        const resultChars = document.getElementById('resultChars');
        
        if (resultWPM) resultWPM.textContent = sessionData.wpm;
        if (resultAccuracy) resultAccuracy.textContent = sessionData.accuracy + '%';
        if (resultTime) {
            resultTime.textContent = Math.floor(sessionData.duration / 60) + ':' + 
                (Math.floor(sessionData.duration % 60)).toString().padStart(2, '0');
        }
        if (resultChars) resultChars.textContent = sessionData.totalChars;
        
        this.showModal('resultsModal');
    }
    
    restartSession() {
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.errors = 0;
        this.totalChars = 0;
        this.displayText();
        this.resetTypingInput();
        this.updateStats();
    }
    
    updateDashboard() {
        if (!this.currentUser) return;
        
        const stats = this.currentUser.stats;
        
        // Update current stats
        const bestWPM = document.getElementById('bestWPM');
        const bestAccuracy = document.getElementById('bestAccuracy');
        const sessionsCount = document.getElementById('sessionsCount');
        
        if (bestWPM) bestWPM.textContent = stats.bestWPM;
        if (bestAccuracy) bestAccuracy.textContent = stats.bestAccuracy + '%';
        if (sessionsCount) sessionsCount.textContent = stats.totalSessions;
        
        // Update achievements
        this.displayAchievements();
        
        // Update recent sessions
        this.displayRecentSessions();
        
        // Update weak characters
        this.displayWeakCharacters();
    }
    
    displayAchievements() {
        const achievementsList = document.getElementById('achievementsList');
        if (!achievementsList) return;
        
        achievementsList.innerHTML = '';
        
        const userAchievements = this.currentUser?.achievements || [];
        
        this.achievements.forEach(achievement => {
            const div = document.createElement('div');
            div.className = 'achievement-item' + (userAchievements.includes(achievement.id) ? ' unlocked' : '');
            
            div.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            `;
            
            achievementsList.appendChild(div);
        });
    }
    
    displayRecentSessions() {
        const sessionsList = document.getElementById('recentSessions');
        if (!sessionsList) return;
        
        sessionsList.innerHTML = '';
        
        const sessions = this.currentUser?.sessions || [];
        const recentSessions = sessions.slice(-10).reverse();
        
        if (recentSessions.length === 0) {
            sessionsList.innerHTML = '<div class="loading">No sessions yet</div>';
            return;
        }
        
        recentSessions.forEach(session => {
            const div = document.createElement('div');
            div.className = 'session-item';
            
            const date = new Date(session.startTime).toLocaleDateString();
            
            div.innerHTML = `
                <div>
                    <div>${date}</div>
                    <div class="session-stats">
                        <span>${session.wpm} WPM</span>
                        <span>${session.accuracy}% Acc</span>
                        <span>${Math.floor(session.duration / 60)}:${(Math.floor(session.duration % 60)).toString().padStart(2, '0')}</span>
                    </div>
                </div>
            `;
            
            sessionsList.appendChild(div);
        });
    }
    
    displayWeakCharacters() {
        const weakCharsList = document.getElementById('weakCharacters');
        if (!weakCharsList) return;
        
        weakCharsList.innerHTML = '';
        
        const weakChars = this.currentUser?.stats?.weakChars || {};
        const sortedChars = Object.entries(weakChars)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        if (sortedChars.length === 0) {
            weakCharsList.innerHTML = '<div class="loading">No data yet</div>';
            return;
        }
        
        sortedChars.forEach(([char, count]) => {
            const div = document.createElement('div');
            div.className = 'weak-char';
            div.textContent = char === ' ' ? 'SPACE' : char;
            div.title = `${count} errors`;
            weakCharsList.appendChild(div);
        });
    }
    
    generateLeaderboard(filter = 'weekly') {
        const leaderboardList = document.getElementById('leaderboardList');
        if (!leaderboardList) return;
        
        leaderboardList.innerHTML = '';
        
        // Generate sample leaderboard data
        const sampleUsers = [
            { username: 'SpeedTyper99', wpm: 85, accuracy: 96 },
            { username: 'KeyboardMaster', wpm: 82, accuracy: 98 },
            { username: 'TypingNinja', wpm: 78, accuracy: 94 },
            { username: 'FastFingers', wpm: 75, accuracy: 97 },
            { username: 'WordRacer', wpm: 73, accuracy: 95 }
        ];
        
        // Add current user if logged in
        if (this.currentUser && !this.currentUser.isGuest) {
            sampleUsers.push({
                username: this.currentUser.username,
                wpm: this.currentUser.stats.bestWPM,
                accuracy: this.currentUser.stats.bestAccuracy
            });
        }
        
        // Sort by WPM
        sampleUsers.sort((a, b) => b.wpm - a.wpm);
        
        sampleUsers.forEach((user, index) => {
            const div = document.createElement('div');
            div.className = 'leaderboard-item' + (user.username === this.currentUser?.username ? ' highlighted' : '');
            
            div.innerHTML = `
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="leaderboard-user">${user.username}</div>
                <div class="leaderboard-stats">
                    <span>${user.wpm} WPM</span>
                    <span>${user.accuracy}% Acc</span>
                </div>
            `;
            
            leaderboardList.appendChild(div);
        });
    }
    
    resetMultiplayerView() {
        const raceLobby = document.querySelector('.race-lobby');
        const raceArea = document.getElementById('raceArea');
        
        if (raceLobby) raceLobby.style.display = 'grid';
        if (raceArea) raceArea.style.display = 'none';
        
        this.isRacing = false;
        if (this.raceInterval) {
            clearInterval(this.raceInterval);
        }
    }
    
    // Multiplayer functionality (simulated)
    startQuickRace() {
        this.showRaceArea();
        this.generateRaceText();
        this.startRaceCountdown();
    }
    
    createPrivateRace() {
        alert('Private race room created! Share code: TR-' + Math.random().toString(36).substr(2, 6).toUpperCase());
        this.startQuickRace();
    }
    
    showRaceArea() {
        const raceLobby = document.querySelector('.race-lobby');
        const raceArea = document.getElementById('raceArea');
        
        if (raceLobby) raceLobby.style.display = 'none';
        if (raceArea) raceArea.style.display = 'block';
    }
    
    generateRaceText() {
        this.currentText = this.sampleTexts[Math.floor(Math.random() * this.sampleTexts.length)];
        const raceTextDisplay = document.getElementById('raceTextDisplay');
        if (!raceTextDisplay) return;
        
        raceTextDisplay.innerHTML = '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const span = document.createElement('span');
            span.textContent = this.currentText[i];
            span.className = 'char';
            if (i === 0) span.classList.add('current');
            raceTextDisplay.appendChild(span);
        }
    }
    
    startRaceCountdown() {
        const countdown = document.getElementById('raceCountdown');
        if (!countdown) return;
        
        let count = 3;
        
        const countdownInterval = setInterval(() => {
            if (count > 0) {
                countdown.textContent = count;
                count--;
            } else {
                countdown.textContent = 'GO!';
                clearInterval(countdownInterval);
                setTimeout(() => {
                    countdown.textContent = '';
                    this.startRace();
                }, 500);
            }
        }, 1000);
    }
    
    startRace() {
        this.isRacing = true;
        this.currentIndex = 0;
        this.startTime = new Date();
        this.opponentProgress = 0;
        
        const raceInput = document.getElementById('raceTypingInput');
        if (raceInput) {
            raceInput.disabled = false;
            raceInput.placeholder = 'Start typing...';
            raceInput.focus();
        }
        
        // Simulate opponent typing
        this.simulateOpponent();
    }
    
    simulateOpponent() {
        this.raceInterval = setInterval(() => {
            if (this.opponentProgress < this.currentText.length) {
                // Opponent types at 60-80 WPM with some variance
                const baseSpeed = 70 + Math.random() * 20;
                const charsPerSecond = (baseSpeed * 5) / 60;
                this.opponentProgress += charsPerSecond * 0.1;
                
                const opponentPercent = Math.min((this.opponentProgress / this.currentText.length) * 100, 100);
                const opponentFill = document.querySelector('[data-player="opponent"] .progress-fill');
                if (opponentFill) {
                    opponentFill.style.width = opponentPercent + '%';
                }
                
                if (this.opponentProgress >= this.currentText.length) {
                    this.endRace(false);
                }
            }
        }, 100);
    }
    
    handleRaceTyping(inputValue) {
        const chars = document.querySelectorAll('#raceTextDisplay .char');
        
        // Clear classes
        chars.forEach(char => {
            char.classList.remove('correct', 'incorrect', 'current');
        });
        
        let errors = 0;
        for (let i = 0; i < inputValue.length; i++) {
            if (i < chars.length) {
                if (inputValue[i] === this.currentText[i]) {
                    chars[i].classList.add('correct');
                } else {
                    chars[i].classList.add('incorrect');
                    errors++;
                }
            }
        }
        
        if (inputValue.length < chars.length) {
            chars[inputValue.length].classList.add('current');
        }
        
        // Update player progress
        const playerPercent = Math.min((inputValue.length / this.currentText.length) * 100, 100);
        const playerFill = document.querySelector('[data-player="you"] .progress-fill');
        if (playerFill) {
            playerFill.style.width = playerPercent + '%';
        }
        
        // Check if race is complete
        if (inputValue.length === this.currentText.length) {
            this.endRace(true);
        }
    }
    
    endRace(playerWon) {
        this.isRacing = false;
        clearInterval(this.raceInterval);
        
        const message = playerWon ? '🏆 You Won!' : '😢 You Lost!';
        const countdown = document.getElementById('raceCountdown');
        if (countdown) {
            countdown.textContent = message;
        }
        
        if (playerWon && this.currentUser && !this.currentUser.isGuest) {
            // Award race winner achievement
            const achievements = this.currentUser.achievements || [];
            if (!achievements.includes('race_winner')) {
                achievements.push('race_winner');
                this.currentUser.achievements = achievements;
                this.saveUserData();
                this.showAchievementNotification('race_winner');
            }
        }
        
        setTimeout(() => {
            this.resetMultiplayerView();
            const raceInput = document.getElementById('raceTypingInput');
            if (raceInput) {
                raceInput.value = '';
                raceInput.disabled = true;
                raceInput.placeholder = 'Wait for race to start...';
            }
        }, 3000);
    }
    
    highlightKey(key) {
        const keyElement = document.querySelector(`[data-key="${key.toLowerCase()}"]`);
        if (keyElement) {
            keyElement.classList.add('active');
        }
    }
    
    unhighlightKey(key) {
        const keyElement = document.querySelector(`[data-key="${key.toLowerCase()}"]`);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
    }
    
    highlightNextKey(char) {
        // Remove previous next key highlighting
        document.querySelectorAll('.key.next').forEach(key => {
            key.classList.remove('next');
        });
        
        // Highlight next key
        const nextKey = document.querySelector(`[data-key="${char.toLowerCase()}"]`);
        if (nextKey) {
            nextKey.classList.add('next');
        }
    }
    
    updateUI() {
        // Update any UI elements that need refreshing
        if (this.currentUser) {
            this.updateUserProfile();
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing TypeMaster...');
    window.typeMaster = new TypeMaster();
    window.typeMaster.init();
});