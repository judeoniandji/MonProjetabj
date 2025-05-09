// Configuration Socket.IO
let socket = null;

// Initialisation de Socket.IO avec le token JWT
function initializeSocket(token) {
    socket = io({
        auth: {
            token: `Bearer ${token}`
        }
    });

    // Gestion des événements Socket.IO
    socket.on('connect', () => {
        console.log('Connected to WebSocket');
    });

    socket.on('new_message', (data) => {
        showNotification('Nouveau message', data.content);
        updateUnreadMessages();
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
    });
}

// Gestion des notifications
function showNotification(title, message) {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, {
                    body: message,
                    icon: '/static/img/logo.png'
                });
            }
        });
    }

    // Notification visuelle dans l'interface
    const toast = `
        <div class="toast" role="alert">
            <div class="toast-header">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toast);
    const toastEl = document.querySelector('.toast:last-child');
    const bsToast = new bootstrap.Toast(toastEl);
    bsToast.show();
}

// Mise à jour du compteur de messages non lus
function updateUnreadMessages() {
    fetch('/api/messages/unread')
        .then(response => response.json())
        .then(data => {
            const badge = document.getElementById('unread-messages');
            if (data.unread_count > 0) {
                badge.textContent = data.unread_count;
                badge.classList.remove('d-none');
            } else {
                badge.classList.add('d-none');
            }
        });
}

// Gestion des formulaires avec AJAX
function handleFormSubmit(form, successCallback) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification('Succès', 'Opération réussie');
                if (successCallback) successCallback(result);
            } else {
                showNotification('Erreur', result.error || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Erreur', 'Une erreur est survenue');
        }
    });
}

// Gestion du scroll infini
function initInfiniteScroll(container, url, renderItem) {
    let page = 1;
    let loading = false;
    let hasMore = true;

    container.addEventListener('scroll', () => {
        if (loading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loading = true;
            page++;

            fetch(`${url}?page=${page}`)
                .then(response => response.json())
                .then(data => {
                    data.items.forEach(item => {
                        container.insertAdjacentHTML('beforeend', renderItem(item));
                    });
                    
                    hasMore = data.has_more;
                    loading = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    loading = false;
                });
        }
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les tooltips Bootstrap
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Initialiser les popovers Bootstrap
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach(popover => new bootstrap.Popover(popover));

    // Gérer les formulaires AJAX
    document.querySelectorAll('form[data-ajax="true"]').forEach(form => {
        handleFormSubmit(form);
    });

    // Initialiser Socket.IO si l'utilisateur est connecté
    const token = localStorage.getItem('jwt_token');
    if (token) {
        initializeSocket(token);
        updateUnreadMessages();
    }
});
