// Gestione delle schede di allenamento
let workouts = [];
let currentUser = null;
let clients = [];
let clientWorkouts = {}; // { clientId: [workoutIds] }

// Database utenti (in produzione usare un backend reale)
let users = [];

// Utenti predefiniti
const defaultUsers = [
    { id: 'admin', username: 'admin', password: 'admin123', role: 'admin', name: 'Amministratore' },
    { id: 'client1', username: 'cliente1', password: 'cliente123', role: 'client', name: 'Mario Rossi' },
    { id: 'client2', username: 'cliente2', password: 'cliente123', role: 'client', name: 'Luigi Bianchi' },
    { id: 'client3', username: 'cliente3', password: 'cliente123', role: 'client', name: 'Anna Verdi' }
];

// Carica dati all'avvio
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    checkSession();
    
    // Event listeners per login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Event listeners per admin
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Event listeners per client
    const clientLogoutBtn = document.getElementById('clientLogoutBtn');
    if (clientLogoutBtn) {
        clientLogoutBtn.addEventListener('click', handleLogout);
    }
});

// Aggiungi un nuovo campo esercizio
function addExerciseField() {
    const exercisesList = document.getElementById('exercisesList');
    const exerciseItem = document.createElement('div');
    exerciseItem.className = 'exercise-item';
    exerciseItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Nome Esercizio:</label>
                <input type="text" class="exercise-name" placeholder="es. Panca piana" required>
            </div>
            <div class="form-group">
                <label>Serie:</label>
                <input type="number" class="exercise-sets" placeholder="3" min="1" required>
            </div>
            <div class="form-group">
                <label>Ripetizioni:</label>
                <input type="number" class="exercise-reps" placeholder="10" min="1" required>
            </div>
            <div class="form-group">
                <label>Peso (kg):</label>
                <input type="number" class="exercise-weight" placeholder="50" min="0" step="0.5">
            </div>
            <button type="button" class="btn-remove" onclick="removeExercise(this)">✕</button>
        </div>
        <div class="form-group">
            <label>Note:</label>
            <input type="text" class="exercise-notes" placeholder="Note aggiuntive (opzionale)">
        </div>
        <div class="form-group image-upload-group">
            <label>Immagine Esercizio:</label>
            <div class="image-upload-container">
                <input type="file" class="exercise-image" accept="image/*" onchange="previewImage(this)">
                <div class="image-preview" style="display: none;">
                    <img src="" alt="Anteprima">
                    <button type="button" class="btn-remove-image" onclick="removeImage(this)">✕ Rimuovi</button>
                </div>
            </div>
        </div>
    `;
    exercisesList.appendChild(exerciseItem);
}

// Rimuovi un campo esercizio
function removeExercise(button) {
    const exercisesList = document.getElementById('exercisesList');
    const exerciseItems = exercisesList.getElementsByClassName('exercise-item');
    
    // Non permettere di rimuovere se c'è solo un esercizio
    if (exerciseItems.length > 1) {
        button.closest('.exercise-item').remove();
    } else {
        alert('Devi avere almeno un esercizio nella scheda!');
    }
}

// Anteprima immagine caricata
function previewImage(input) {
    const exerciseItem = input.closest('.exercise-item');
    const preview = exerciseItem.querySelector('.image-preview');
    const img = preview.querySelector('img');
    const fileInput = input;
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            img.src = e.target.result;
            preview.style.display = 'block';
            fileInput.style.display = 'none';
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Rimuovi immagine
function removeImage(button) {
    const exerciseItem = button.closest('.exercise-item');
    const preview = exerciseItem.querySelector('.image-preview');
    const img = preview.querySelector('img');
    const fileInput = exerciseItem.querySelector('.exercise-image');
    
    img.src = '';
    fileInput.value = '';
    preview.style.display = 'none';
    fileInput.style.display = 'block';
}

// Gestisci il submit del form
function handleFormSubmit(e) {
    e.preventDefault();
    
    const workoutName = document.getElementById('workoutName').value.trim();
    const exerciseItems = document.querySelectorAll('.exercise-item');
    
    const exercises = [];
    exerciseItems.forEach(item => {
        const name = item.querySelector('.exercise-name').value.trim();
        const sets = parseInt(item.querySelector('.exercise-sets').value);
        const reps = parseInt(item.querySelector('.exercise-reps').value);
        const weight = parseFloat(item.querySelector('.exercise-weight').value) || 0;
        const notes = item.querySelector('.exercise-notes').value.trim();
        
        // Recupera l'immagine se presente
        const imgPreview = item.querySelector('.image-preview img');
        const image = imgPreview && imgPreview.src && imgPreview.src.startsWith('data:') ? imgPreview.src : null;
        
        exercises.push({ name, sets, reps, weight, notes, image });
    });
    
    const workout = {
        id: Date.now(),
        name: workoutName,
        exercises: exercises,
        createdAt: new Date().toLocaleDateString('it-IT')
    };
    
    workouts.push(workout);
    saveWorkouts();
    displayWorkouts();
    
    // Reset form
    document.getElementById('workoutForm').reset();
    
    // Rimuovi tutti gli esercizi tranne il primo e resetta l'immagine
    const exercisesList = document.getElementById('exercisesList');
    const items = exercisesList.querySelectorAll('.exercise-item');
    for (let i = items.length - 1; i > 0; i--) {
        items[i].remove();
    }
    
    // Resetta l'immagine nel primo esercizio
    const firstExercise = exercisesList.querySelector('.exercise-item');
    if (firstExercise) {
        const preview = firstExercise.querySelector('.image-preview');
        const img = preview.querySelector('img');
        const fileInput = firstExercise.querySelector('.exercise-image');
        img.src = '';
        preview.style.display = 'none';
        fileInput.style.display = 'block';
    }
    
    alert('Scheda salvata con successo!');
}

// Salva le schede nel localStorage
function saveWorkouts() {
    localStorage.setItem('gymWorkouts', JSON.stringify(workouts));
}

// Carica le schede dal localStorage
function loadWorkouts() {
    const saved = localStorage.getItem('gymWorkouts');
    if (saved) {
        workouts = JSON.parse(saved);
    }
}

// Visualizza tutte le schede
function displayWorkouts() {
    const container = document.getElementById('workoutsContainer');
    
    if (workouts.length === 0) {
        container.innerHTML = '<p class="empty-state">Nessuna scheda creata. Crea la tua prima scheda!</p>';
        return;
    }
    
    container.innerHTML = workouts.map(workout => `
        <div class="workout-card">
            <h3>${workout.name}</h3>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 10px;">Creata il: ${workout.createdAt}</p>
            <div class="exercise-list">
                ${workout.exercises.map(exercise => `
                    <div class="exercise-entry">
                        ${exercise.image ? `<div class="exercise-image-display"><img src="${exercise.image}" alt="${exercise.name}"></div>` : ''}
                        <div class="exercise-info">
                            <strong>${exercise.name}</strong>
                            <div class="exercise-details">
                                ${exercise.sets} serie × ${exercise.reps} ripetizioni
                                ${exercise.weight > 0 ? ` • ${exercise.weight} kg` : ''}
                            </div>
                            ${exercise.notes ? `<div class="exercise-notes">Note: ${exercise.notes}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="workout-actions">
                <button class="btn-edit" onclick="editWorkout(${workout.id})">Modifica</button>
                <button class="btn-delete" onclick="deleteWorkout(${workout.id})">Elimina</button>
            </div>
        </div>
    `).join('');
}

// Elimina una scheda
function deleteWorkout(id) {
    if (confirm('Sei sicuro di voler eliminare questa scheda?')) {
        workouts = workouts.filter(w => w.id !== id);
        saveWorkouts();
        displayWorkouts();
    }
}

// Modifica una scheda (riempie il form con i dati esistenti)
function editWorkout(id) {
    const workout = workouts.find(w => w.id === id);
    if (!workout) return;
    
    // Riempi il nome
    document.getElementById('workoutName').value = workout.name;
    
    // Rimuovi tutti gli esercizi esistenti nel form
    const exercisesList = document.getElementById('exercisesList');
    exercisesList.innerHTML = '';
    
    // Aggiungi gli esercizi della scheda
    workout.exercises.forEach(exercise => {
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Nome Esercizio:</label>
                    <input type="text" class="exercise-name" value="${exercise.name}" required>
                </div>
                <div class="form-group">
                    <label>Serie:</label>
                    <input type="number" class="exercise-sets" value="${exercise.sets}" min="1" required>
                </div>
                <div class="form-group">
                    <label>Ripetizioni:</label>
                    <input type="number" class="exercise-reps" value="${exercise.reps}" min="1" required>
                </div>
                <div class="form-group">
                    <label>Peso (kg):</label>
                    <input type="number" class="exercise-weight" value="${exercise.weight}" min="0" step="0.5">
                </div>
                <button type="button" class="btn-remove" onclick="removeExercise(this)">✕</button>
            </div>
            <div class="form-group">
                <label>Note:</label>
                <input type="text" class="exercise-notes" value="${exercise.notes || ''}" placeholder="Note aggiuntive (opzionale)">
            </div>
            <div class="form-group image-upload-group">
                <label>Immagine Esercizio:</label>
                <div class="image-upload-container">
                    <input type="file" class="exercise-image" accept="image/*" onchange="previewImage(this)" style="${exercise.image ? 'display: none;' : ''}">
                    <div class="image-preview" style="${exercise.image ? 'display: block;' : 'display: none;'}">
                        <img src="${exercise.image || ''}" alt="Anteprima">
                        <button type="button" class="btn-remove-image" onclick="removeImage(this)">✕ Rimuovi</button>
                    </div>
                </div>
            </div>
        `;
        exercisesList.appendChild(exerciseItem);
    });
    
    // Elimina la scheda vecchia (verrà ricreata con il submit)
    workouts = workouts.filter(w => w.id !== id);
    saveWorkouts();
    
    // Scroll al form
    document.querySelector('.create-workout').scrollIntoView({ behavior: 'smooth' });
}

// Funzioni di autenticazione
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showDashboard(user.role);
    } else {
        alert('Username o password non corretti!');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginPage();
}

function checkSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard(currentUser.role);
    } else {
        showLoginPage();
    }
}

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('clientDashboard').style.display = 'none';
}

function showDashboard(role) {
    document.getElementById('loginPage').style.display = 'none';
    
    if (role === 'admin') {
        document.getElementById('adminDashboard').style.display = 'block';
        document.getElementById('clientDashboard').style.display = 'none';
        
        // Setup admin dashboard
        setupAdminDashboard();
        displayWorkouts();
        populateClientSelect();
        populateWorkoutSelect();
    } else {
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('clientDashboard').style.display = 'block';
        
        // Setup client dashboard
        displayClientWorkouts();
    }
}

function setupAdminDashboard() {
    // Event listener per form creazione scheda
    const workoutForm = document.getElementById('workoutForm');
    if (workoutForm) {
        workoutForm.removeEventListener('submit', handleFormSubmit);
        workoutForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Event listener per aggiungere esercizi
    const addExerciseBtn = document.getElementById('addExerciseBtn');
    if (addExerciseBtn) {
        addExerciseBtn.removeEventListener('click', addExerciseField);
        addExerciseBtn.addEventListener('click', addExerciseField);
    }
    
    // Event listener per form invio scheda
    const sendWorkoutForm = document.getElementById('sendWorkoutForm');
    if (sendWorkoutForm) {
        sendWorkoutForm.removeEventListener('submit', handleSendWorkout);
        sendWorkoutForm.addEventListener('submit', handleSendWorkout);
    }
    
    // Event listener per form creazione account
    const createAccountForm = document.getElementById('createAccountForm');
    if (createAccountForm) {
        createAccountForm.removeEventListener('submit', handleCreateAccount);
        createAccountForm.addEventListener('submit', handleCreateAccount);
    }
}

// Gestione tab
function showTab(tabName) {
    const createTab = document.getElementById('createTab');
    const sendTab = document.getElementById('sendTab');
    const accountsTab = document.getElementById('accountsTab');
    const tabs = document.querySelectorAll('.tab-btn');
    
    // Nascondi tutti i tab
    createTab.style.display = 'none';
    sendTab.style.display = 'none';
    accountsTab.style.display = 'none';
    
    // Rimuovi active da tutti i bottoni
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Mostra il tab selezionato
    if (tabName === 'create') {
        createTab.style.display = 'block';
        tabs[0].classList.add('active');
    } else if (tabName === 'send') {
        sendTab.style.display = 'block';
        tabs[1].classList.add('active');
        populateWorkoutSelect();
    } else if (tabName === 'accounts') {
        accountsTab.style.display = 'block';
        tabs[2].classList.add('active');
        displayAccountsList();
    }
}

// Popola select clienti
function populateClientSelect() {
    const clientSelect = document.getElementById('clientSelect');
    const clients = users.filter(u => u.role === 'client');
    
    clientSelect.innerHTML = '<option value="">-- Scegli un cliente --</option>';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        clientSelect.appendChild(option);
    });
}

// Popola select schede
function populateWorkoutSelect() {
    const workoutSelect = document.getElementById('workoutSelect');
    
    workoutSelect.innerHTML = '<option value="">-- Scegli una scheda --</option>';
    workouts.forEach(workout => {
        const option = document.createElement('option');
        option.value = workout.id;
        option.textContent = workout.name;
        workoutSelect.appendChild(option);
    });
}

// Gestisci invio scheda
function handleSendWorkout(e) {
    e.preventDefault();
    
    const clientId = document.getElementById('clientSelect').value;
    const workoutId = parseInt(document.getElementById('workoutSelect').value);
    
    if (!clientId || !workoutId) {
        alert('Seleziona sia il cliente che la scheda!');
        return;
    }
    
    // Aggiungi la scheda al cliente
    if (!clientWorkouts[clientId]) {
        clientWorkouts[clientId] = [];
    }
    
    if (!clientWorkouts[clientId].includes(workoutId)) {
        clientWorkouts[clientId].push(workoutId);
        saveClientWorkouts();
        
        const client = users.find(u => u.id === clientId);
        const workout = workouts.find(w => w.id === workoutId);
        
        alert(`Scheda "${workout.name}" inviata a ${client.name}!`);
        
        // Reset form
        document.getElementById('sendWorkoutForm').reset();
    } else {
        alert('Questo cliente ha già ricevuto questa scheda!');
    }
}

// Salva assegnazioni schede-clienti
function saveClientWorkouts() {
    localStorage.setItem('clientWorkouts', JSON.stringify(clientWorkouts));
}

// Carica assegnazioni schede-clienti
function loadClientWorkouts() {
    const saved = localStorage.getItem('clientWorkouts');
    if (saved) {
        clientWorkouts = JSON.parse(saved);
    }
}

// Visualizza schede del cliente
function displayClientWorkouts() {
    const container = document.getElementById('clientWorkoutsContainer');
    
    if (!currentUser || currentUser.role !== 'client') {
        container.innerHTML = '<p class="empty-state">Errore: utente non valido.</p>';
        return;
    }
    
    const clientWorkoutIds = clientWorkouts[currentUser.id] || [];
    
    if (clientWorkoutIds.length === 0) {
        container.innerHTML = '<p class="empty-state">Nessuna scheda ricevuta. Attendi che il tuo trainer te ne invii una!</p>';
        return;
    }
    
    const clientWorkoutsList = clientWorkoutIds
        .map(id => workouts.find(w => w.id === id))
        .filter(w => w !== undefined);
    
    container.innerHTML = clientWorkoutsList.map(workout => `
        <div class="workout-card">
            <h3>${workout.name}</h3>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 10px;">Creata il: ${workout.createdAt}</p>
            <div class="exercise-list">
                ${workout.exercises.map(exercise => `
                    <div class="exercise-entry">
                        ${exercise.image ? `<div class="exercise-image-display"><img src="${exercise.image}" alt="${exercise.name}"></div>` : ''}
                        <div class="exercise-info">
                            <strong>${exercise.name}</strong>
                            <div class="exercise-details">
                                ${exercise.sets} serie × ${exercise.reps} ripetizioni
                                ${exercise.weight > 0 ? ` • ${exercise.weight} kg` : ''}
                            </div>
                            ${exercise.notes ? `<div class="exercise-notes">Note: ${exercise.notes}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Carica tutti i dati
function loadData() {
    loadWorkouts();
    loadClientWorkouts();
    loadUsers();
}

// Carica utenti dal localStorage o usa quelli predefiniti
function loadUsers() {
    const saved = localStorage.getItem('users');
    if (saved) {
        users = JSON.parse(saved);
    } else {
        users = [...defaultUsers];
        saveUsers();
    }
}

// Salva utenti nel localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Gestisci creazione nuovo account
function handleCreateAccount(e) {
    e.preventDefault();
    
    const name = document.getElementById('newClientName').value.trim();
    const username = document.getElementById('newClientUsername').value.trim();
    const password = document.getElementById('newClientPassword').value;
    
    // Verifica se lo username esiste già
    if (users.find(u => u.username === username)) {
        alert('Questo username è già utilizzato. Scegline un altro.');
        return;
    }
    
    // Crea nuovo utente
    const newUser = {
        id: 'client_' + Date.now(),
        username: username,
        password: password,
        role: 'client',
        name: name
    };
    
    users.push(newUser);
    saveUsers();
    
    alert(`Account creato con successo!\nNome: ${name}\nUsername: ${username}`);
    
    // Reset form
    document.getElementById('createAccountForm').reset();
    
    // Aggiorna lista account e select clienti
    displayAccountsList();
    populateClientSelect();
}

// Visualizza lista account clienti
function displayAccountsList() {
    const container = document.getElementById('accountsList');
    const clients = users.filter(u => u.role === 'client');
    
    if (clients.length === 0) {
        container.innerHTML = '<p class="empty-state">Nessun cliente registrato.</p>';
        return;
    }
    
    container.innerHTML = clients.map(client => `
        <div class="account-card">
            <div class="account-info">
                <h4>${client.name}</h4>
                <p><strong>Username:</strong> ${client.username}</p>
                <p><strong>ID:</strong> ${client.id}</p>
            </div>
            <button class="btn-delete-account" onclick="deleteAccount('${client.id}')">Elimina</button>
        </div>
    `).join('');
}

// Elimina account cliente
function deleteAccount(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    if (confirm(`Sei sicuro di voler eliminare l'account di ${user.name}?\nQuesta azione eliminerà anche tutte le schede associate.`)) {
        // Rimuovi utente
        users = users.filter(u => u.id !== userId);
        saveUsers();
        
        // Rimuovi schede associate
        if (clientWorkouts[userId]) {
            delete clientWorkouts[userId];
            saveClientWorkouts();
        }
        
        // Aggiorna visualizzazioni
        displayAccountsList();
        populateClientSelect();
        
        alert('Account eliminato con successo.');
    }
}

