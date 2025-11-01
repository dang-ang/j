// --- CONFIGURAZIONE ---
const CLIENT_ID = 'IL_TUO_CLIENT_ID.apps.googleusercontent.com'; // SOSTITUISCI CON IL TUO CLIENT_ID
const SPREADSHEET_ID = 'IL_TUO_ID_FOGLIO_GOOGLE'; // L'ID del tuo foglio Google "2526_input" (lo trovi nell'URL del foglio)
const PARAMETER_SHEET_NAMES = ['rpe', 'fatigue', 'wellness']; // Nomi dei fogli/parametri nel tuo spreadsheet

// --- ELEMENTI DOM ---
const authButton = document.getElementById('auth-button');
const signoutButton = document.getElementById('signout-button');
const loadDataButton = document.getElementById('load-data-button');
const authStatus = document.getElementById('auth-status');
const dashboardControls = document.getElementById('dashboard-controls');
const playerSelect = document.getElementById('player-select');
const playerChartsDiv = document.getElementById('player-charts');
const teamChartsDiv = document.getElementById('team-charts');

// --- VARIABILI GLOBALI ---
let gapiInited = false;
let gisInited = false;
let tokenClient;
let googleAccessToken = null; // Memorizza il token di accesso
let allSheetsData = {}; // Memorizza i dati di tutti i fogli per evitare ricaricamenti

// --- FUNZIONI DI AUTENTICAZIONE E INIZIALIZZAZIONE ---

/**
 * Inizializza l'API GAPI client.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Inizializza il client GAPI per l'API di Google Sheets.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Inizializza il client Google Identity Services per l'autenticazione.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/spreadsheets.readonly', // Solo lettura
        callback: '', // Definito dinamicamente in handleAuthClick
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Abilita o disabilita i pulsanti in base allo stato di caricamento delle API.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        authButton.style.display = 'block';
    }
}

/**
 * Gestisce il click sul pulsante di autenticazione.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error) {
            // Handle error, e.g., prompt to consent again
            console.error('Authentication failed:', resp.error);
            alert('Autenticazione fallita. Riprova.');
            return;
        }
        googleAccessToken = resp.access_token;
        updateSignInStatus(true);
        loadAllSheetData(); // Carica i dati appena autenticato
    };

    if (gapi.client.getToken() === null) {
        // No token, start new authorization flow.
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Token exists, refresh it.
        tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 * Gestisce il click sul pulsante di disconnessione.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken(null);
        googleAccessToken = null;
        updateSignInStatus(false);
        clearDashboards();
        allSheetsData = {}; // Resetta i dati caricati
    }
}

/**
 * Aggiorna lo stato di login nell'interfaccia utente.
 */
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        authStatus.innerHTML = '<p>Autenticato con successo.</p>';
        authButton.style.display = 'none';
        signoutButton.style.display = 'block';
        dashboardControls.style.display = 'block';
    } else {
        authStatus.innerHTML = '<p>Accedi con il tuo account Google per visualizzare i dati.</p>';
        authButton.style.display = 'block';
        signoutButton.style.display = 'none';
        dashboardControls.style.display = 'none';
    }
}

/**
 * Pulisce tutti i grafici dalla dashboard.
 */
function clearDashboards() {
    playerChartsDiv.innerHTML = '';
    teamChartsDiv.innerHTML = '';
    playerSelect.innerHTML = '<option value="">Seleziona Giocatore</option>'; // Reset select
}


// --- FUNZIONI DI RECUPERO E ELABORAZIONE DATI ---

/**
 * Recupera i dati da un singolo foglio Google.
 * @param {string} sheetName - Il nome del foglio (es. 'rpe').
 * @returns {Promise<Array<Object>>} - Una Promise che risolve con i dati del foglio.
 */
async function fetchSheetData(sheetName) {
    if (!googleAccessToken) {
        console.error('Access token non disponibile.');
        return [];
    }
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${gapi.client.getToken().access_token}`,
            {
                headers: {
                    'Authorization': `Bearer ${googleAccessToken}`
                }
            }
        );
        const data = await response.json();
        
        // La prima riga è l'intestazione
        const headers = data.values[0];
        const rows = data.values.slice(1);
        
        // Trasforma in array di oggetti
        const parsedData = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });
        return parsedData;

    } catch (error) {
        console.error(`Errore nel recupero dati dal foglio ${sheetName}:`, error);
        return [];
    }
}

/**
 * Carica i dati da tutti i fogli specificati.
 */
async function loadAllSheetData() {
    clearDashboards(); // Pulisci prima di ricaricare
    authStatus.innerHTML = '<p>Caricamento dati in corso...</p>';
    const allPlayers = new Set();

    for (const param of PARAMETER_SHEET_NAMES) {
        const rawData = await fetchSheetData(param);
        if (rawData.length > 0) {
            const processedData = processData(rawData);
            allSheetsData[param] = processedData;

            // Raccogli tutti i nomi dei giocatori
            processedData.forEach(row => allPlayers.add(row.player));
        } else {
            console.warn(`Nessun dato trovato per il parametro: ${param}`);
            allSheetsData[param] = []; // Inizializza come array vuoto
        }
    }
    
    populatePlayerSelect(Array.from(allPlayers).sort());
    authStatus.innerHTML = '<p>Dati caricati. Seleziona un giocatore o visualizza la squadra.</p>';
    displayTeamDashboard(); // Mostra la dashboard della squadra per default
}

/**
 * Pre-processa i dati grezzi per l'analisi.
 * @param {Array<Object>} rawData - I dati grezzi dal foglio Google.
 * @returns {Array<Object>} - I dati processati.
 */
function processData(rawData) {
    return rawData.map(row => ({
        player: row.player,
        date: new Date(row.date), // Converti la stringa data in oggetto Date
        parametro: row.parametro,
        valore: parseFloat(row.valore) // Converti il valore in numero
    })).filter(row => !isNaN(row.valore) && row.date instanceof Date && !isNaN(row.date)); // Filtra dati invalidi
}

/**
 * Calcola l'andamento settimanale.
 * @param {Array<Object>} data - Dati processati.
 * @param {string} [groupByColumn=null] - Colonna per il raggruppamento (es. 'player').
 * @returns {Array<Object>} - Dati settimanali raggruppati.
 */
function calculateWeeklyTrend(data, groupByColumn = null) {
    const weeklyDataMap = new Map(); // Mappa per raggruppare i dati

    data.forEach(item => {
        const date = item.date;
        // Calcola l'inizio della settimana (Lunedì)
        const dayOfWeek = date.getDay(); // 0 = Domenica, 1 = Lunedì
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // lunedì della settimana corrente
        const weekStart = new Date(date.getFullYear(), date.getMonth(), diff);
        weekStart.setHours(0, 0, 0, 0); // Azzera l'ora

        const keyPrefix = groupByColumn ? item[groupByColumn] + '_' : '';
        const key = keyPrefix + weekStart.toISOString().split('T')[0]; // Es: "PlayerA_2023-01-01"

        if (!weeklyDataMap.has(key)) {
            weeklyDataMap.set(key, {
                week_start: weekStart,
                sum_valore: 0,
                count: 0,
                [groupByColumn]: item[groupByColumn] // Aggiungi la colonna di raggruppamento se presente
            });
        }
        const current = weeklyDataMap.get(key);
        current.sum_valore += item.valore;
        current.count++;
    });

    const weeklyTrend = Array.from(weeklyDataMap.values()).map(item => ({
        week_start: item.week_start,
        valore_medio: item.sum_valore / item.count,
        ...(groupByColumn && { [groupByColumn]: item[groupByColumn] }) // Conditionally add group column
    }));

    // Ordina per data
    weeklyTrend.sort((a, b) => a.week_start - b.week_start);
    return weeklyTrend;
}

// --- FUNZIONI DI VISUALIZZAZIONE GRAFICI ---

/**
 * Crea un grafico utilizzando Chart.js.
 * @param {HTMLElement} container - L'elemento DOM in cui inserire il canvas.
 * @param {string} title - Titolo del grafico.
 * @param {string} label - Etichetta della serie di dati.
 * @param {Array<Object>} data - Dati da plottare. Deve contenere 'week_start' e 'valore_medio'.
 */
function createChart(container, title, label, data) {
    // Rimuovi canvas esistente se presente
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: data.map(item => item.week_start.toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: 'numeric' })),
            datasets: [{
                label: label,
                data: data.map(item => item.valore_medio),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Per un controllo migliore delle dimensioni
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                x: {
                    type: 'category', // Tratta le etichette come categorie
                    title: {
                        display: true,
                        text: 'Settimana'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: label
                    }
                }
            }
        }
    });
}

/**
 * Popola il dropdown dei giocatori.
 * @param {Array<string>} players - Array di nomi dei giocatori.
 */
function populatePlayerSelect(players) {
    playerSelect.innerHTML = '<option value="">Seleziona Giocatore</option>';
    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player;
        option.textContent = player;
        playerSelect.appendChild(option);
    });
}

/**
 * Visualizza la dashboard per un giocatore selezionato.
 * @param {string} playerName - Il nome del giocatore.
 */
function displayPlayerDashboard(playerName) {
    playerChartsDiv.innerHTML = ''; // Pulisci i grafici precedenti
    if (!playerName) {
        return;
    }

    PARAMETER_SHEET_NAMES.forEach(param => {
        const dataForParam = allSheetsData[param] || [];
        const playerSpecificData = dataForParam.filter(row => row.player === playerName);

        if (playerSpecificData.length > 0) {
            const weeklyTrend = calculateWeeklyTrend(playerSpecificData);
            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container';
            playerChartsDiv.appendChild(chartContainer);
            createChart(chartContainer, `Andamento Settimanale ${param} per ${playerName}`, param, weeklyTrend);
        } else {
            const noDataMsg = document.createElement('p');
            noDataMsg.textContent = `Nessun dato "${param}" trovato per ${playerName}.`;
            playerChartsDiv.appendChild(noDataMsg);
        }
    });
}

/**
 * Visualizza la dashboard della squadra per tutti i parametri.
 */
function displayTeamDashboard() {
    teamChartsDiv.innerHTML = ''; // Pulisci i grafici precedenti

    PARAMETER_SHEET_NAMES.forEach(param => {
        const dataForParam = allSheetsData[param] || [];

        if (dataForParam.length > 0) {
            const weeklyTrend = calculateWeeklyTrend(dataForParam); // Nessun raggruppamento per giocatore per la squadra
            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container';
            teamChartsDiv.appendChild(chartContainer);
            createChart(chartContainer, `Andamento Settimanale ${param} per la Squadra`, param, weeklyTrend);
        } else {
            const noDataMsg = document.createElement('p');
            noDataMsg.textContent = `Nessun dato "${param}" trovato per la squadra.`;
            teamChartsDiv.appendChild(noDataMsg);
        }
    });
}


// --- EVENT LISTENERS ---
authButton.addEventListener('click', handleAuthClick);
signoutButton.addEventListener('click', handleSignoutClick);
loadDataButton.addEventListener('click', loadAllSheetData);
playerSelect.addEventListener('change', (event) => {
    displayPlayerDashboard(event.target.value);
});

// Carica le librerie Google quando il DOM è pronto
window.onload = () => {
    gapiLoaded();
    gisLoaded();
};