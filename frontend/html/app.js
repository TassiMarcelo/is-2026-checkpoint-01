// Configuración de la API del backend
// El navegador siempre accede al backend mediante localhost (puerto del host)
// No se puede usar nombres de servicios Docker desde el navegador del cliente
const API_BASE_URL = 'http://localhost:5000';
const HEALTH_CHECK_INTERVAL = 5000; // 5 segundos

// Variables globales
let isBackendOnline = false;

console.log('🔗 API URL configurada:', API_BASE_URL);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadTeamData();
    checkBackendHealth();
    
    // Verificar salud del backend periódicamente
    setInterval(checkBackendHealth, HEALTH_CHECK_INTERVAL);
});

/**
 * Verifica la conexión con el backend
 */
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000) // Timeout de 3 segundos
        });
        
        if (response.ok) {
            isBackendOnline = true;
            updateStatusIndicator(true);
        } else {
            isBackendOnline = false;
            updateStatusIndicator(false);
        }
    } catch (error) {
        isBackendOnline = false;
        updateStatusIndicator(false);
    }
}

/**
 * Actualiza el indicador visual del estado del backend
 * @param {boolean} isOnline - Estado del backend
 */
function updateStatusIndicator(isOnline) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    if (isOnline) {
        indicator.classList.remove('offline');
        indicator.classList.add('online');
        statusText.textContent = '✓ Backend conectado';
    } else {
        indicator.classList.remove('online');
        indicator.classList.add('offline');
        statusText.textContent = '✗ Backend desconectado';
    }
}

/**
 * Carga los datos del equipo desde el backend
 */
async function loadTeamData() {
    const contentDiv = document.getElementById('content');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/team`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const members = await response.json();
        
        if (!Array.isArray(members) || members.length === 0) {
            contentDiv.innerHTML = '<div class="error">⚠️ No hay integrantes registrados en el equipo.</div>';
            return;
        }
        
        // Construir la tabla dinámicamente
        const tableHTML = buildTeamTable(members);
        contentDiv.innerHTML = tableHTML;
        
    } catch (error) {
        console.error('Error al cargar datos del equipo:', error);
        contentDiv.innerHTML = `
            <div class="error">
                <strong>❌ Error al cargar los datos:</strong><br>
                ${error.message}<br>
                <small>Asegúrate de que el backend esté ejecutándose en ${API_BASE_URL}</small>
            </div>
        `;
    }
}

/**
 * Construye la tabla HTML con los datos de los miembros
 * @param {Array} members - Lista de miembros del equipo
 * @returns {string} Tabla HTML
 */
function buildTeamTable(members) {
    let tableHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Legajo</th>
                        <th>Feature</th>
                        <th>Servicio</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    members.forEach(member => {
        const nombreCompleto = `${member.nombre} ${member.apellido}`;
        const featureBadge = getFeatureBadge(member.feature);
        const estadoBadge = getEstadoBadge(member.estado);
        
        tableHTML += `
            <tr>
                <td class="nombre">${sanitizeHTML(nombreCompleto)}</td>
                <td>${sanitizeHTML(member.legajo)}</td>
                <td><span class="feature-badge ${featureBadge}">${sanitizeHTML(member.feature)}</span></td>
                <td>${sanitizeHTML(member.servicio)}</td>
                <td><span class="estado-badge ${estadoBadge}">${sanitizeHTML(member.estado)}</span></td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    return tableHTML;
}

/**
 * Retorna la clase CSS para el badge de feature
 * @param {string} feature - Nombre de la feature
 * @returns {string} Clase CSS
 */
function getFeatureBadge(feature) {
    const lowerFeature = feature.toLowerCase();
    
    if (lowerFeature.includes('frontend')) {
        return 'frontend';
    } else if (lowerFeature.includes('backend')) {
        return 'backend';
    } else if (lowerFeature.includes('database') || lowerFeature.includes('db')) {
        return 'database';
    }
    
    return '';
}

/**
 * Retorna la clase CSS para el badge de estado
 * @param {string} estado - Estado del miembro
 * @returns {string} Clase CSS
 */
function getEstadoBadge(estado) {
    const lowerEstado = estado.toLowerCase();
    
    if (lowerEstado.includes('completado') || lowerEstado.includes('hecho')) {
        return 'completado';
    } else if (lowerEstado.includes('progreso') || lowerEstado.includes('en-progreso')) {
        return 'en-progreso';
    } else if (lowerEstado.includes('pendiente')) {
        return 'pendiente';
    }
    
    return '';
}

/**
 * Sanitiza texto para evitar inyección XSS
 * @param {string} text - Texto a sanitizar
 * @returns {string} Texto sanitizado
 */
function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
