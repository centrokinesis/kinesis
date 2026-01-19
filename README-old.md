# 💪 Webapp Schede di Palestra

Una webapp semplice e intuitiva per creare e gestire le tue schede di allenamento in palestra.

## ✨ Funzionalità

### Sistema di Autenticazione
- **Login sicuro**: Sistema di autenticazione con username e password
- **Due ruoli utente**:
  - **Amministratore**: Può creare schede e inviarle ai clienti
  - **Cliente**: Può visualizzare le schede ricevute dal proprio trainer
- **Sessione persistente**: Il login rimane attivo anche dopo aver chiuso il browser

### Funzionalità Amministratore
- **Crea schede personalizzate**: Inserisci nome della scheda e aggiungi tutti gli esercizi che vuoi
- **Gestione esercizi**: Per ogni esercizio puoi specificare:
  - Nome dell'esercizio
  - Numero di serie
  - Numero di ripetizioni
  - Peso (opzionale)
  - Note aggiuntive (opzionale)
  - Immagine esercizio (opzionale)
- **Visualizza schede**: Tutte le schede create sono visualizzate in modo chiaro e organizzato
- **Modifica schede**: Modifica facilmente una scheda esistente
- **Elimina schede**: Rimuovi le schede che non servono più
- **Invia schede ai clienti**: Seleziona un cliente e una scheda per inviarla direttamente
- **Gestione account clienti**:
  - Crea nuovi account cliente con nome, username e password
  - Visualizza lista di tutti i clienti registrati
  - Elimina account cliente (rimuove anche le schede associate)

### Funzionalità Cliente
- **Visualizza schede ricevute**: I clienti possono vedere tutte le schede inviate dal trainer
- **Interfaccia semplificata**: Dashboard dedicata solo alla visualizzazione delle schede

### Generale
- **Salvataggio automatico**: Le schede e le assegnazioni sono salvate nel browser (localStorage)
- **Design responsive**: Funziona perfettamente su desktop, tablet e smartphone

## 🚀 Come usare

### Accesso
1. Apri il file `index.html` nel tuo browser
2. Effettua il login con uno degli account disponibili:

**Account Amministratore:**
- Username: `admin`
- Password: `admin123`

**Account Clienti:**
- Username: `cliente1` / Password: `cliente123` (Mario Rossi)
- Username: `cliente2` / Password: `cliente123` (Luigi Bianchi)
- Username: `cliente3` / Password: `cliente123` (Anna Verdi)

### Come Amministratore
1. Dopo il login, accedi alla dashboard amministratore
2. **Crea una nuova scheda**:
   - Vai alla tab "Crea Scheda"
   - Inserisci il nome della scheda
   - Aggiungi gli esercizi con tutti i dettagli (serie, ripetizioni, peso, note)
   - Opzionalmente carica un'immagine per ogni esercizio
   - Clicca su "+ Aggiungi Esercizio" per aggiungere più esercizi
   - Clicca su "Salva Scheda"
3. **Invia una scheda a un cliente**:
   - Vai alla tab "Invia Scheda"
   - Seleziona il cliente destinatario
   - Seleziona la scheda da inviare
   - Clicca su "Invia Scheda"
4. **Gestisci account clienti**:
   - Vai alla tab "Gestione Account"
   - Compila il form con nome completo, username e password del nuovo cliente
   - Clicca su "Crea Account"
   - Visualizza tutti i clienti registrati e, se necessario, elimina account
5. Le tue schede appariranno nella sezione "Le Mie Schede" dove potrai modificarle o eliminarle

### Come Cliente
1. Dopo il login, visualizzerai automaticamente le schede che ti sono state inviate
2. Potrai consultare tutti i dettagli degli esercizi, incluse le immagini

## 📁 Struttura del progetto

```
gym-workout-app/
├── index.html      # Struttura HTML della webapp
├── styles.css      # Stili e layout
├── app.js          # Logica JavaScript
└── README.md       # Questo file
```

## 💻 Tecnologie utilizzate

- HTML5
- CSS3 (con Grid e Flexbox)
- JavaScript (vanilla, no framework)
- LocalStorage per il salvataggio dei dati

## 🎨 Caratteristiche design

- Interfaccia moderna con gradiente viola
- Animazioni fluide
- Design responsive per tutti i dispositivi
- Card con effetto hover
- Colori accattivanti e leggibili

Buon allenamento! 💪

