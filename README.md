# App Schede Palestra - Centro Kinesis

Web app per la gestione delle schede di allenamento per il Centro Kinesis.

## 🚀 Setup per GitHub Pages

### 1. Crea un progetto Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca su "Aggiungi progetto"
3. Segui la procedura guidata per creare il progetto

### 2. Attiva i servizi Firebase necessari

**Firestore Database:**
1. Nel menu laterale, vai su "Firestore Database"
2. Clicca "Crea database"
3. Seleziona "Modalità produzione"
4. Scegli la location (preferibilmente europe-west)

**Authentication:**
1. Nel menu laterale, vai su "Authentication"
2. Clicca "Inizia"
3. Nella tab "Sign-in method", abilita "Email/Password"

### 3. Configura le regole di sicurezza Firestore

Vai su Firestore Database > Regole e incolla questo codice:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo utenti autenticati possono leggere/scrivere
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Clicca "Pubblica" per salvare.

### 4. Ottieni le credenziali Firebase

1. Vai su Impostazioni Progetto (icona ingranaggio in alto a sinistra)
2. Scorri fino a "Le tue app"
3. Clicca sull'icona web `</>`
4. Registra l'app (dai un nickname tipo "Kinesis Web App")
5. Copia l'oggetto `firebaseConfig`

### 5. Configura l'app

Apri il file `firebase-config.js` e sostituisci i valori placeholder con le tue credenziali Firebase:

```javascript
const firebaseConfig = {
    apiKey: "TUA_API_KEY",
    authDomain: "tuo-progetto.firebaseapp.com",
    projectId: "tuo-progetto-id",
    storageBucket: "tuo-progetto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### 6. Crea l'utente amministratore iniziale

Dopo aver configurato Firebase e caricato l'app su GitHub Pages, devi creare manualmente il primo utente admin:

1. Vai su Firebase Console > Firestore Database
2. Clicca "Avvia raccolta"
3. ID raccolta: `users`
4. Aggiungi un documento con questi campi:
   - **ID documento**: lascia che Firebase lo generi automaticamente
   - **Campi**:
     - `username` (string): `admin`
     - `password` (string): `admin123` (cambiala dopo il primo accesso!)
     - `name` (string): `Amministratore`
     - `role` (string): `admin`
     - `createdAt` (timestamp): clicca su "timestamp" e usa il timestamp corrente

5. Vai su Firebase Console > Authentication
6. Clicca "Aggiungi utente"
7. Email: `admin@kinesis.local`
8. Password: `admin123` (la stessa del documento Firestore)

Ora puoi fare login con:
- **Username**: admin
- **Password**: admin123

### 7. Carica su GitHub Pages

1. Crea un repository GitHub
2. Carica tutti i file della cartella `gym-workout-app`
3. Vai su Settings > Pages
4. Seleziona la branch `main` come source
5. Salva e attendi qualche minuto

La tua app sarà disponibile su: `https://tuousername.github.io/nome-repo/`

## 📱 Funzionalità

### Per Amministratori:
- Creazione schede di allenamento con esercizi personalizzati
- Upload immagini per ogni esercizio
- Gestione clienti (creazione/eliminazione account)
- Assegnazione schede ai clienti

### Per Clienti:
- Visualizzazione schede ricevute dal trainer
- Dettagli esercizi con immagini, serie, ripetizioni e pesi

## 🔒 Sicurezza

**IMPORTANTE**: 
- Le password sono salvate in chiaro nel database per semplicità. Per un ambiente di produzione, implementa l'hashing delle password!
- Cambia la password admin predefinita dopo il primo accesso
- Configura le regole Firestore più restrittive per un ambiente di produzione

## 🎨 Personalizzazione

I colori dell'app sono personalizzati per il brand Centro Kinesis:
- **Azzurro principale**: #3CADD4
- **Grigio scuro**: #6B6B6B

Per modificare i colori, edita il file `styles.css`.

## 📞 Supporto

Per problemi o domande sull'app, contatta l'amministratore di sistema.
