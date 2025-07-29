# VideoGear Pro - Guida Completa per l'Utente

## Sommario
1. [Introduzione](#introduzione)
2. [Accesso al Sistema](#accesso-al-sistema)
3. [Ruoli Utente](#ruoli-utente)
4. [Dashboard Principale](#dashboard-principale)
5. [Gestione Attrezzature](#gestione-attrezzature)
6. [Sistema di Prelievo e Riconsegna](#sistema-di-prelievo-e-riconsegna)
7. [Monitoraggio e Storico](#monitoraggio-e-storico)
8. [Gestione Manutenzione](#gestione-manutenzione)
9. [Funzionalità Avanzate](#funzionalità-avanzate)
10. [Risoluzione Problemi](#risoluzione-problemi)

---

## Introduzione

VideoGear Pro è un sistema professionale di gestione attrezzature video progettato per studi di produzione, case di produzione cinematografica e organizzazioni che necessitano di tracciamento accurato delle proprie risorse tecnologiche.

### Caratteristiche Principali:
- **Tracciabilità Completa**: Ogni movimento di attrezzatura viene registrato con timestamp e firme digitali
- **Controllo Accessi**: Sistema a due livelli (Amministratore/Operatore) per sicurezza ottimale
- **Monitoraggio Real-time**: Stato delle attrezzature aggiornato in tempo reale
- **Prevenzione Frodi**: Sistema di audit log per prevenire utilizzi non autorizzati
- **Manutenzione Programmata**: Gestione automatica degli interventi di manutenzione
- **Interface Responsive**: Funziona perfettamente su desktop, tablet e smartphone

---

## Accesso al Sistema

### Primo Accesso
1. Navigare all'indirizzo del sistema VideoGear Pro
2. Dalla pagina di benvenuto, cliccare su **"Accedi al Sistema"**
3. Utilizzare le credenziali Replit per l'autenticazione
4. Una volta autenticati, il sistema determinerà automaticamente il vostro ruolo

### Logout
Per uscire dal sistema in sicurezza:
1. Cliccare sull'avatar utente nell'angolo superiore destro
2. Selezionare **"Logout"** dal menu a tendina
3. Verrete reindirizzati alla pagina di login

---

## Ruoli Utente

Il sistema VideoGear Pro utilizza due livelli di accesso distinti:

### 👤 Operatore
**Permessi disponibili:**
- Visualizzazione dashboard e statistiche
- Consultazione inventario attrezzature
- Prelievo e riconsegna attrezzature
- Visualizzazione storico personale
- Accesso alle attività recenti

**Limitazioni:**
- Non può aggiungere/modificare/eliminare attrezzature
- Non può accedere agli audit log amministrativi
- Non può gestire manutenzioni programmate

### 👑 Amministratore
**Permessi completi includono tutto quello dell'operatore più:**
- Gestione completa inventario (CRUD attrezzature)
- Accesso completo agli audit log
- Gestione manutenzioni programmate
- Cancellazione transazioni
- Esportazione report avanzati
- Gestione utenti e permessi

---

## Dashboard Principale

La dashboard è il centro di controllo del sistema e fornisce una panoramica completa in tempo reale.

### Sezioni della Dashboard

#### 📊 Statistiche Immediate
Quattro card mostrano:
- **Totale Attrezzature**: Numero complessivo di items nell'inventario
- **Disponibili**: Attrezzature pronte per l'uso
- **In Uso**: Attrezzature attualmente in prestito
- **Manutenzione**: Attrezzature in manutenzione o che necessitano interventi

#### 📋 Tabella Attrezzature
- Visualizzazione in tempo reale di tutte le attrezzature
- Filtri per categoria e ricerca testuale
- Indicatori di stato colorati:
  - 🟢 **Verde**: Disponibile
  - 🟡 **Giallo**: In uso
  - 🔴 **Rosso**: In manutenzione
  - ⚫ **Grigio**: Non disponibile

#### 🔄 Attività Recenti
Feed in tempo reale delle ultime transazioni:
- Prelievi e riconsegne recenti
- Nome utente e attrezzatura coinvolta
- Timestamp preciso dell'operazione
- Tipo di transazione (checkout/checkin)

#### ⚠️ Avvisi Manutenzione
Alerting automatico per:
- Manutenzioni scadute (rosso)
- Manutenzioni in scadenza (giallo)
- Promemoria programmati (blu)

#### ⚡ Azioni Rapide
Pulsanti di accesso veloce:
- **Scansiona QR**: Per accesso rapido via QR code
- **Esporta Report**: Generazione report PDF/Excel

---

## Gestione Attrezzature

### Aggiunta Nuova Attrezzatura (Solo Amministratori)

1. **Accesso**: Cliccare su **"+ Aggiungi Attrezzatura"** nella dashboard
2. **Compilazione Modulo**:
   - **Nome**: Denominazione commerciale (es. "Sony FX6")
   - **Codice**: Identificativo univoco interno (es. "CAM-001")
   - **Categoria**: Tipo di attrezzatura (Telecamere, Audio, Luci, etc.)
   - **Numero Seriale**: Seriale del produttore
   - **Descrizione**: Dettagli tecnici e note
   - **Data Acquisto**: Quando è stata acquisita
   - **Prezzo**: Valore economico per assicurazione
   - **Immagine**: Foto dell'attrezzatura (consigliata)

3. **Salvataggio**: Cliccare **"Salva Attrezzatura"**

### Modifica Attrezzatura (Solo Amministratori)

1. Trovare l'attrezzatura nella tabella dashboard
2. Cliccare sull'icona matita ✏️
3. Modificare i campi necessari
4. Salvare le modifiche
5. Il sistema registrerà automaticamente l'operazione negli audit log

### Eliminazione Attrezzatura (Solo Amministratori)

1. Selezionare l'attrezzatura da eliminare
2. Cliccare sull'icona cestino 🗑️
3. Confermare l'operazione
4. **Nota**: L'eliminazione è logica - i dati rimangono per audit

---

## Sistema di Prelievo e Riconsegna

Il core del sistema VideoGear Pro è il processo di tracking delle attrezzature.

### Processo di Prelievo (Checkout)

#### Passo 1: Selezione Attrezzatura
- Identificare l'attrezzatura desiderata dalla dashboard
- Verificare che lo stato sia "Disponibile" (verde)
- Cliccare sul pulsante **"Preleva"**

#### Passo 2: Compilazione Dati
Il modulo di prelievo richiede:
- **Scopo Utilizzo**: Descrizione del progetto/utilizzo previsto
- **Data Riconsegna Prevista**: Quando si prevede di restituire
- **Note Aggiuntive**: Informazioni extra (opzionale)

#### Passo 3: Firma Digitale
- Utilizzare mouse, touchpad o touch screen per firmare
- La firma conferma la presa in carico della responsabilità
- **Importante**: Senza firma la transazione non è valida

#### Passo 4: Conferma
- Verificare tutti i dati inseriti
- Cliccare **"Conferma Prelievo"**
- L'attrezzatura cambierà stato immediatamente a "In Uso"

### Processo di Riconsegna (Checkin)

#### Passo 1: Avvio Riconsegna
- Dalla dashboard, identificare l'attrezzatura da restituire
- Cliccare sul pulsante **"Riconsegna"**

#### Passo 2: Controllo Condizioni
Il modulo di riconsegna include:
- **Condizioni al Ritorno**: Valutazione stato (Ottimo/Buono/Danneggiato)
- **Note Condizioni**: Descrizione dettagliata di eventuali problemi
- **Ore Utilizzo**: Tempo effettivo di utilizzo (se applicabile)

#### Passo 3: Firma di Riconsegna
- Firmare digitalmente per confermare la restituzione
- La firma certifica che la riconsegna è avvenuta

#### Passo 4: Completamento
- Confermare la riconsegna
- L'attrezzatura tornerà automaticamente "Disponibile"
- Se riportati danni, lo stato può passare a "Manutenzione"

### Calcolo Automatico Ore di Utilizzo

Il sistema calcola automaticamente:
- **Durata Prelievo**: Tempo tra checkout e checkin
- **Ore Fatturabili**: Per calcoli di costi interni
- **Statistiche Utilizzo**: Per analisi di rendimento attrezzature

---

## Monitoraggio e Storico

### Visualizzazione Attività Recenti

La sezione **Attività Recenti** nella dashboard mostra:
- Ultime 10 transazioni del sistema
- Informazioni per transazione:
  - Tipo operazione (Prelievo/Riconsegna)
  - Utente responsabile
  - Attrezzatura coinvolta
  - Timestamp preciso
  - Durata utilizzo (per riconsegne)

### Storico Completo (In Sviluppo)

La sezione **Storico** permetterà:
- Ricerca avanzata per date, utenti, attrezzature
- Filtri multipli per analisi mirate
- Esportazione dati per reporting
- Grafici di utilizzo temporale

### Audit Log (Solo Amministratori)

Sistema completo di tracciamento che registra:
- **Modifiche Inventario**: Aggiunte, modifiche, eliminazioni
- **Transazioni**: Ogni prelievo e riconsegna
- **Accessi Sistema**: Login e logout utenti
- **Modifiche Utenti**: Cambi ruolo o permessi

Ogni record include:
- Timestamp preciso
- Utente responsabile
- Azione eseguita
- Dati prima e dopo (per modifiche)
- Indirizzo IP e device info

---

## Gestione Manutenzione

### Tipi di Manutenzione

#### Manutenzione Programmata
- **Preventiva**: Basata su calendar o ore di utilizzo
- **Correttiva**: In risposta a segnalazioni problemi
- **Emergenza**: Per attrezzature critiche danneggiate

#### Stati Manutenzione
- **Pianificata**: Manutenzione schedulata ma non iniziata
- **In Corso**: Manutenzione attualmente in esecuzione
- **Completata**: Manutenzione terminata con successo
- **In Ritardo**: Manutenzione scaduta non completata

### Creazione Manutenzione (Solo Amministratori)

1. **Accesso**: Sezione Manutenzione → "Nuova Manutenzione"
2. **Dati Richiesti**:
   - **Attrezzatura**: Selezione dal menu a tendina
   - **Tipo Manutenzione**: Preventiva/Correttiva/Emergenza
   - **Descrizione**: Dettagli dell'intervento richiesto
   - **Data Programmata**: Quando eseguire l'intervento
   - **Tecnico Assegnato**: Chi effettuerà l'intervento
   - **Note**: Informazioni aggiuntive

3. **Pianificazione**: Il sistema invierà alerting automatici

### Alerting Automatico

Il sistema genera avvisi per:
- **7 giorni prima**: Promemoria manutenzione in arrivo
- **Giorno stesso**: Notifica manutenzione programmata
- **Giorni di ritardo**: Alert per manutenzioni scadute

Gli avvisi appaiono:
- Nella dashboard (card Avvisi Manutenzione)
- Nel menu notifiche
- Come badge rossi sui componenti

---

## Funzionalità Avanzate

### Codici QR (Funzionalità Futura)

Ogni attrezzatura avrà un QR code per:
- **Accesso Rapido**: Scan per aprire direttamente la scheda attrezzatura
- **Prelievo Mobile**: Checkout tramite smartphone
- **Verifica Inventario**: Controllo rapido durante inventari fisici

### Esportazione Report

Gli amministratori possono generare:
- **Report Utilizzo**: Statistiche per attrezzatura o periodo
- **Report Manutenzione**: Cronologia interventi e costi
- **Report Audit**: Log completi per compliance
- **Report Inventario**: Stato attuale e valorizzazione

Formati disponibili: PDF, Excel, CSV

### Integrazione API (Funzionalità Futura)

Il sistema offrirà API REST per:
- Integrazione con sistemi di produzione esistenti
- Collegamento con software di project management
- Automazione workflow aziendali
- Sviluppo app mobile personalizzate

---

## Risoluzione Problemi

### Problemi Comuni e Soluzioni

#### "Non riesco ad accedere al sistema"
**Possibili cause:**
- Credenziali errate
- Session scaduta
- Problemi di rete

**Soluzioni:**
1. Verificare credenziali Replit
2. Cancellare cache browser
3. Tentare accesso da incognito
4. Contattare amministratore sistema

#### "L'attrezzatura non cambia stato dopo prelievo"
**Possibili cause:**
- Transazione non completata
- Firma digitale mancante
- Errore di connessione

**Soluzioni:**
1. Verificare che la firma sia stata apposta
2. Controllare conferma transazione
3. Ricaricare la pagina
4. Ripetere l'operazione

#### "Non vedo le mie transazioni recenti"
**Possibili cause:**
- Cache del browser
- Filtri attivi
- Permessi insufficienti

**Soluzioni:**
1. Ricaricare la pagina (F5)
2. Verificare filtri applicati
3. Controllare il proprio ruolo utente
4. Contattare supporto tecnico

### Messaggi di Errore Comuni

| Errore | Significato | Soluzione |
|--------|-------------|-----------|
| "Unauthorized" | Accesso negato o session scaduta | Rifare login |
| "Equipment not found" | Attrezzatura non esiste | Verificare codice/ID |
| "Already checked out" | Attrezzatura già in uso | Controllare stato attuale |
| "Admin access required" | Operazione riservata admin | Contattare amministratore |
| "Invalid signature" | Firma digitale non valida | Ripetere firma |

### Supporto Tecnico

In caso di problemi persistenti:

1. **Raccogliere Informazioni**:
   - Ora e data del problema
   - Azione che si stava compiendo
   - Messaggio di errore esatto
   - Browser e versione utilizzata

2. **Contatti Supporto**:
   - Email amministratore sistema
   - Ticket interno se disponibile
   - Numero verde aziendale

3. **Informazioni da Fornire**:
   - Username utilizzatore
   - Descrizione dettagliata problema
   - Screenshot se possibile
   - Passi per riprodurre l'errore

---

## Best Practice per l'Utilizzo

### Per gli Operatori

1. **Prelievi**:
   - Sempre compilare accuratamente lo scopo utilizzo
   - Firmare chiaramente con nome leggibile
   - Verificare data riconsegna realistica
   - Aggiungere note se necessario

2. **Riconsegne**:
   - Controllare fisicamente l'attrezzatura prima della riconsegna
   - Segnalare immediatamente eventuali danni
   - Non ritardare la riconsegna oltre il previsto
   - Documentare ore di utilizzo accurate

3. **Generale**:
   - Fare logout alla fine della sessione
   - Non condividere credenziali di accesso
   - Segnalare immediatamente problemi o malfunzionamenti

### Per gli Amministratori

1. **Gestione Inventario**:
   - Mantenere informazioni attrezzature sempre aggiornate
   - Utilizzare codici identificativi consistenti
   - Caricare foto di alta qualità
   - Aggiornare valori assicurativi periodicamente

2. **Manutenzione**:
   - Programmare manutenzioni preventive regolari
   - Monitorare alerting e agire tempestivamente
   - Documentare accuratamente gli interventi
   - Tenere traccia dei costi di manutenzione

3. **Sicurezza**:
   - Rivedere regolarmente gli audit log
   - Monitorare accessi e transazioni anomale
   - Mantenere backup dei dati critici
   - Aggiornare permessi utenti quando necessario

---

## Glossario Tecnico

**Audit Log**: Registro cronologico di tutte le attività del sistema

**Checkout**: Processo di prelievo attrezzatura con assegnazione responsabilità

**Checkin**: Processo di riconsegna attrezzatura con verifica condizioni

**Dashboard**: Pannello principale con panoramica sistema e controlli

**Firma Digitale**: Autenticazione biometrica per validare transazioni

**Inventory**: Elenco completo delle attrezzature gestite dal sistema

**QR Code**: Codice a barre bidimensionale per accesso rapido via mobile

**Real-time**: Aggiornamento immediato dei dati senza necessità di refresh

**Responsive**: Interface che si adatta automaticamente a device diversi

**Timestamp**: Marca temporale precisa di quando è avvenuta un'azione

---

*VideoGear Pro - Sistema di Gestione Attrezzature Video Professionale*
*Versione Guida: 1.0 - Ultima modifica: Gennaio 2025*