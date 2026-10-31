// Configuración Realtime Database Sazón Casero
const firebaseConfig = {
    databaseURL: "https://sazon-d80f9-default-rtdb.firebaseio.com"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let dbProducts = [];
let isStoreOpen = true;
let isClosingSoon = false;
let hasUnsavedAdminChanges = false;
let productToDeleteIndex = null;

// Semilla inicial cargada fielmente desde la carta oficial en PDF
const initialProductsSeed = [
    // ENTRADAS
    { id: "e1", categoria: "entradas", nombre: "Bastones de mozzarella rebozados", precio: 10500, disponible: "TRUE", veggie: true },
    { id: "e2", categoria: "entradas", nombre: "Langostinos rebozados con sésamo y salsa agripicante", precio: 17000, disponible: "TRUE" },
    { id: "e3", categoria: "entradas", nombre: "Rabas con salsa tártara", precio: 17000, disponible: "TRUE" },
    { id: "e4", categoria: "entradas", nombre: "Tortilla de papa", precio: 10500, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "e5", categoria: "entradas", nombre: "Tortilla de papa rellena (Jamón y queso / Cebolla y queso)", precio: 12000, disponible: "TRUE" },

    // PRINCIPALES
    { id: "pr1", categoria: "principales", nombre: "Pechuga rellena sobre salsa de azafrán con papas bastón", precio: 16500, disponible: "TRUE" },
    { id: "pr2", categoria: "principales", nombre: "Pechuga grillada con papas bastón", precio: 12000, disponible: "TRUE" },
    { id: "pr3", categoria: "principales", nombre: "Pechuga grillada con salsa de hongos y papas bastón", precio: 15000, disponible: "TRUE" },
    { id: "pr4", categoria: "principales", nombre: "Paella de mariscos", precio: 24000, disponible: "TRUE" },
    { id: "pr5", categoria: "principales", nombre: "Langostinos y calamares con crema cítrica y fetuccini", precio: 25000, disponible: "TRUE" },
    { id: "pr6", categoria: "principales", nombre: "Boga a la pizza o 4 quesos con papas bastón", precio: 20500, disponible: "TRUE" },
    { id: "pr7", categoria: "principales", nombre: "Boga al limón con papas bastón", precio: 19000, disponible: "TRUE" },
    { id: "pr8", categoria: "principales", nombre: "Vacío de cerdo con chimichurri y papas bastón", precio: 18000, disponible: "TRUE" },
    { id: "pr9", categoria: "principales", nombre: "Entrecot con crema de hongos y papas bastón", precio: 22000, disponible: "TRUE" },
    { id: "pr10", categoria: "principales", nombre: "Tapa de asado 3 hs con criolla y papas bastón", precio: 19000, disponible: "TRUE" },
    { id: "pr11", categoria: "principales", nombre: "Matambrito de cerdo al limón con papas bastón", precio: 20000, disponible: "TRUE" },
    { id: "pr12", categoria: "principales", nombre: "Matambrito de cerdo a la pizza o 4 quesos con papas bastón", precio: 22000, disponible: "TRUE" },

    // PIZZANESAS
    { id: "pz1", categoria: "pizzanesas", nombre: "Pizzanesa Mozzarella", precio: 17000, precio_secundario: 39500, disponible: "TRUE" },
    { id: "pz2", categoria: "pizzanesas", nombre: "Pizzanesa Cuatro quesos", precio: 19500, precio_secundario: 41000, disponible: "TRUE" },
    { id: "pz3", categoria: "pizzanesas", nombre: "Pizzanesa Napolitana", precio: 19500, precio_secundario: 41000, disponible: "TRUE" },
    { id: "pz4", categoria: "pizzanesas", nombre: "Pizzanesa Fugazza", precio: 19000, precio_secundario: 40000, disponible: "TRUE" },
    { id: "pz5", categoria: "pizzanesas", nombre: "Pizzanesa Huevo frito, panceta y cheddar", precio: 19500, precio_secundario: 41000, disponible: "TRUE" },
    { id: "pz6", categoria: "pizzanesas", nombre: "Pizzanesa Especial", precio: 19500, precio_secundario: 41000, disponible: "TRUE" },

    // BURGERS
    { id: "b1", categoria: "burgers", nombre: "Burger Especial", detalle: "Medallón de carne 180g, queso muzzarella, jamón cocido, huevo frito, lechuga y tomate en pan artesanal.", precio: 14300, disponible: "TRUE" },
    { id: "b2", categoria: "burgers", nombre: "Burger Española", detalle: "Medallón de carne 180g, queso provoleta, chorizo colorado salteado, pimientos asados y mayonesa de ajo.", precio: 14300, disponible: "TRUE" },
    { id: "b3", categoria: "burgers", nombre: "Burger Queen", detalle: "Doble medallón de carne, queso cheddar, panceta crocante, cebolla caramelizada y salsa BBQ de la casa.", precio: 14300, disponible: "TRUE" },
    { id: "b4", categoria: "burgers", nombre: "Burger Sazón", detalle: "Doble medallón de carne, doble cheddar, salsa criolla más porción de papas.", precio: 13700, disponible: "TRUE" },
    { id: "b5", categoria: "burgers", nombre: "Burger Triple quesos", detalle: "Medallón de carne 180g, combinación cremosa de cheddar, muzzarella y queso dabo con panceta salteada.", precio: 13000, disponible: "TRUE" },
    { id: "b6", categoria: "burgers", nombre: "Burger Vegetariana", detalle: "Medallón artesanal de lentejas y vegetales, queso port salut, vegetales asados y palta fresca.", precio: 13000, disponible: "TRUE", veggie: true },

    // LOMITOS
    { id: "l1", categoria: "lomitos", nombre: "Lomito Especial", precio: 20300, disponible: "TRUE" },
    { id: "l2", categoria: "lomitos", nombre: "Lomito Queen", precio: 20300, disponible: "TRUE" },
    { id: "l3", categoria: "lomitos", nombre: "Lomito Triple queso", precio: 17700, disponible: "TRUE" },
    { id: "l4", categoria: "lomitos", nombre: "Sándwich de bondiola desmechada con barbacoa", precio: 14000, disponible: "TRUE" },

    // FAMILIARES
    { id: "f1", categoria: "familiares", nombre: "Familiar Especial (Pan trenzado, milanesa, omelette, lechuga y tomate)", precio: 19200, disponible: "TRUE" },
    { id: "f2", categoria: "familiares", nombre: "Familiar Triple queso (Pan trenzado, milanesa, danbo, cheddar y muzzarella)", precio: 16500, disponible: "TRUE" },

    // PASTAS
    { id: "pas1", categoria: "pastas", nombre: "Fetuccinis al huevo", precio: 5300, disponible: "TRUE", veggie: true },
    { id: "pas2", categoria: "pastas", nombre: "Ñoquis", precio: 5300, disponible: "TRUE", veggie: true },
    { id: "pas3", categoria: "pastas", nombre: "Ravioles de espinaca y queso", precio: 5600, disponible: "TRUE", veggie: true },
    { id: "pas4", categoria: "pastas", nombre: "Sorrentinos de jamón cocido y queso", precio: 6800, disponible: "TRUE" },
    { id: "pas5", categoria: "pastas", nombre: "Sorrentinos de calabaza, roquefort y nuez", precio: 6800, disponible: "TRUE", veggie: true },

    // SALSAS
    { id: "s1", categoria: "salsas", nombre: "Salsa Bolognesa", precio: 7500, disponible: "TRUE" },
    { id: "s2", categoria: "salsas", nombre: "Salsa de Hongos", precio: 6800, disponible: "TRUE", veggie: true },
    { id: "s3", categoria: "salsas", nombre: "Salsa de Puerro", precio: 5700, disponible: "TRUE", veggie: true },
    { id: "s4", categoria: "salsas", nombre: "Salsa Mixta", precio: 5700, disponible: "TRUE", veggie: true },
    { id: "s5", categoria: "salsas", nombre: "Salsa Roja", precio: 5700, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "s6", categoria: "salsas", nombre: "Salsa Crema", precio: 5700, disponible: "TRUE", veggie: true },
    { id: "s7", categoria: "salsas", nombre: "Salsa Mariscos", precio: 20700, disponible: "TRUE" },

    // PIZZAS
    { id: "p1", categoria: "pizzas", nombre: "Pizza Mozzarella", precio: 7300, precio_secundario: 14000, disponible: "TRUE", veggie: true },
    { id: "p2", categoria: "pizzas", nombre: "Pizza Napolitana", precio: 9000, precio_secundario: 16500, disponible: "TRUE", veggie: true },
    { id: "p3", categoria: "pizzas", nombre: "Pizza Fugazza", precio: 8000, precio_secundario: 15300, disponible: "TRUE", veggie: true },
    { id: "p4", categoria: "pizzas", nombre: "Pizza Cuatro quesos", precio: 9000, precio_secundario: 16500, disponible: "TRUE", veggie: true },
    { id: "p5", categoria: "pizzas", nombre: "Pizza Especial", precio: 9000, precio_secundario: 16500, disponible: "TRUE" },
    { id: "p6", categoria: "pizzas", nombre: "Pizza Huevo frito, panceta y verdeo", precio: 9300, precio_secundario: 17300, disponible: "TRUE" },
    { id: "p7", categoria: "pizzas", nombre: "Pizza Agridulce", precio: 9400, precio_secundario: 17500, disponible: "TRUE" },
    { id: "p8", categoria: "pizzas", nombre: "Pizza Cantimpalo", precio: 9300, precio_secundario: 17500, disponible: "TRUE" },
    { id: "p9", categoria: "pizzas", nombre: "Pizza Pollo, puerro y champiñones", precio: 9300, precio_secundario: 17300, disponible: "TRUE" },
    { id: "p10", categoria: "pizzas", nombre: "Pizza Sazón", precio: 9300, precio_secundario: 17300, disponible: "TRUE" },

    // PAPAS
    { id: "pa1", categoria: "papas", nombre: "Papas bastón", precio: 6500, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "pa2", categoria: "papas", nombre: "Papas cheddar", precio: 9500, disponible: "TRUE", veggie: true },
    { id: "pa3", categoria: "papas", nombre: "Papas mediterráneas", precio: 12300, disponible: "TRUE", veggie: true },
    { id: "pa4", categoria: "papas", nombre: "Papas sazón", precio: 11800, disponible: "TRUE" },

    // POSTRES
    { id: "po1", categoria: "postres", nombre: "Domo de chocolate con avellanas y crema bariloche", precio: 7500, disponible: "TRUE", veggie: true },
    { id: "po2", categoria: "postres", nombre: "Lingote de chocolate blanco, pistachos y crema chantilly", precio: 7500, disponible: "TRUE", veggie: true },
    { id: "po3", categoria: "postres", nombre: "Flan casero con dulce de leche y crema", precio: 4300, disponible: "TRUE", veggie: true, sintacc: true },

    // BEBIDAS
    { id: "beb1", categoria: "bebidas", nombre: "Gaseosa 500 cc (Coca Cola, Sprite, Fanta / Zero)", precio: 3200, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "beb2", categoria: "bebidas", nombre: "Gaseosa 1,500 cc", precio: 5500, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "beb3", categoria: "bebidas", nombre: "Gaseosa 2,250 cc", precio: 7000, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "beb4", categoria: "bebidas", nombre: "Agua sin gas 500 cc", precio: 3200, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "beb5", categoria: "bebidas", nombre: "Agua sin gas 1,500 cc", precio: 5500, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "beb6", categoria: "bebidas", nombre: "Agua con gas 500 cc", precio: 3200, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "beb7", categoria: "bebidas", nombre: "Agua con gas 1,500 cc", precio: 5500, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "beb8", categoria: "bebidas", nombre: "Agua saborizada Aquarius 500 cc", precio: 3200, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "beb9", categoria: "bebidas", nombre: "Agua saborizada Aquarius 1,500 cc", precio: 5500, disponible: "TRUE", veggie: true, sintacc: true },
    { id: "beb10", categoria: "bebidas", nombre: "Lata de cerveza Quilmes", precio: 5000, disponible: "TRUE", veggie: true }
];

let menuDiarioData = { text: 'Consultar opción del día', price: '', image: '' };
let currentSelectedMenuImageBase64 = '';

const categoryHeaders = {
    'entradas': { title: 'Entradas', icon: 'fa-shrimp' },
    'principales': { title: 'Platos Principales', icon: 'fa-drumstick-bite' },
    'pizzanesas': { title: 'Pizzanesas', icon: 'fa-utensils' },
    'burgers': { title: 'Burgers', icon: 'fa-burger' },
    'lomitos': { title: 'Lomitos', icon: 'fa-bread-slice' },
    'familiares': { title: 'Familiares', icon: 'fa-bread-slice' },
    'pastas': { title: 'Pastas', icon: 'fa-bowl-food' },
    'salsas': { title: 'Salsas', icon: 'fa-jar' },
    'pizzas': { title: 'Pizzas', icon: 'fa-pizza-slice' },
    'papas': { title: 'Papas', icon: 'fa-plate-wheat' },
    'postres': { title: 'Postres', icon: 'fa-ice-cream' },
    'bebidas': { title: 'Bebidas', icon: 'fa-wine-glass' }
};

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    checkStoreStatus();
    setInterval(checkStoreStatus, 30000); // Revisa horarios cada 30s
    listenToMenuDiario();
    renderCategoryPills();
    listenToProducts();

    const passInput = document.getElementById('admin-pass-input');
    if (passInput) {
        passInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') verifyAdminPass();
        });
    }
});

function generateOrderNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}

function showToast(message) {
    const toast = document.getElementById('toast-notification');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Evaluación precisa de horarios de atención incorporando el cambio de día de la madrugada
function checkStoreStatus() {
    const now = new Date();
    const day = now.getDay(); // 0: Dom, 1: Lun, 2: Mar, 3: Mié, 4: Jue, 5: Vie, 6: Sáb
    const hour = now.getHours();
    const min = now.getMinutes();
    const timeInMins = hour * 60 + min;

    let open = false;
    let closingSoon = false;

    // Evaluamos el turno actual o la extensión del turno nocturno iniciado el día anterior:
    // Si estamos en la madrugada (00:00 a 03:00), el día de la jornada comercial es el día anterior.
    const effectiveDay = (timeInMins < 180) ? (day === 0 ? 6 : day - 1) : day;

    if (effectiveDay >= 1 && effectiveDay <= 5) {
        // Lunes a Viernes: 10:00 (600m) a 15:00 (900m) y 19:00 (1140m) a 01:00 (60m del día siguiente)
        const isLunch = (timeInMins >= 600 && timeInMins < 900);
        const isDinner = (timeInMins >= 1140) || (timeInMins < 60);

        if (isLunch || isDinner) {
            open = true;
            // Próximo a cerrar (última media hora):
            if ((timeInMins >= 870 && timeInMins < 900) || (timeInMins >= 30 && timeInMins < 60)) {
                closingSoon = true;
            }
        }
    } else {
        // Sábados y Domingos: 18:30 (1110m) a 01:30 (90m del día siguiente)
        const isWeekendDinner = (timeInMins >= 1110) || (timeInMins < 90);

        if (isWeekendDinner) {
            open = true;
            // Próximo a cerrar (última media hora):
            if ((timeInMins >= 1080 && timeInMins < 1110) || (timeInMins >= 60 && timeInMins < 90)) {
                closingSoon = true;
            }
        }
    }

    isStoreOpen = open;
    isClosingSoon = open && closingSoon;

    const topBanner = document.getElementById('store-status-banner');
    if (topBanner) {
        topBanner.style.display = isStoreOpen ? 'none' : 'flex';
    }

    // Banners en Menú Diario
    const closingSoonBanner = document.getElementById('closing-soon-banner');
    const closedBanner = document.getElementById('closed-status-banner');

    if (closingSoonBanner) {
        closingSoonBanner.style.display = isClosingSoon ? 'flex' : 'none';
    }

    if (closedBanner) {
        closedBanner.style.display = !isStoreOpen ? 'flex' : 'none';
    }

    updateSubmitButtonsState();
}

function updateSubmitButtonsState() {
    const cartBtn = document.getElementById('cart-submit-btn');
    const mdBtn = document.getElementById('md-submit-btn');

    if (cartBtn) {
        cartBtn.disabled = !isStoreOpen;
        if (!isStoreOpen) {
            cartBtn.innerHTML = '<i class="fa-solid fa-clock"></i> Local Cerrado';
        } else {
            cartBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Confirmar por WhatsApp';
        }
    }

    if (mdBtn) {
        mdBtn.disabled = !isStoreOpen;
        if (!isStoreOpen) {
            mdBtn.innerHTML = '<i class="fa-solid fa-clock"></i> Local Cerrado';
        } else {
            mdBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Pedir por WhatsApp';
        }
    }
}

function openHorariosModal() {
    document.getElementById('horarios-modal').classList.add('open');
}

function closeHorariosModal() {
    document.getElementById('horarios-modal').classList.remove('open');
}

function listenToMenuDiario() {
    db.ref("MenuDiario").on("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
            menuDiarioData = {
                text: data.text || 'Consultar propuesta de hoy',
                price: data.price || '',
                image: data.image || ''
            };
        } else {
            const defaultMenu = {
                text: 'Pechuga grillada con papas bastón y salsa especial',
                price: '12000',
                image: ''
            };
            db.ref("MenuDiario").set(defaultMenu);
        }
    });
}

function listenToProducts() {
    db.ref("Productos").on("value", (snapshot) => {
        const data = snapshot.val();
        dbProducts = [];

        if (!data) {
            const updates = {};
            initialProductsSeed.forEach(prod => { updates[`Productos/${prod.id}`] = prod; });
            db.ref().update(updates);
            return;
        }

        Object.keys(data).forEach(key => {
            dbProducts.push({
                id: key,
                ...data[key],
                disponible: data[key].disponible !== undefined ? String(data[key].disponible).toUpperCase() : 'TRUE'
            });
        });

        renderMenu();

        const adminModal = document.getElementById('admin-panel-modal');
        if (adminModal && adminModal.classList.contains('open')) {
            renderAdminProductsList(document.getElementById('admin-search-input')?.value || '');
        }
    });
}

function openConfigModal() {
    const input = document.getElementById('admin-pass-input');
    input.value = '';
    input.type = 'password';
    document.getElementById('config-auth-modal').classList.add('open');
    setTimeout(() => input.focus(), 100);
}

function closeConfigAuthModal() {
    document.getElementById('config-auth-modal').classList.remove('open');
}

function togglePasswordVisibility() {
    const input = document.getElementById('admin-pass-input');
    const icon = document.getElementById('pass-eye-icon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
}

function verifyAdminPass() {
    const pass = document.getElementById('admin-pass-input').value;
    if (pass === 'sazonpororo') {
        closeConfigAuthModal();
        openAdminSelectorModal();
    } else {
        alert('Contraseña incorrecta.');
    }
}

function openAdminSelectorModal() {
    document.getElementById('admin-menu-selector-modal').classList.add('open');
}

function closeAdminSelectorModal() {
    document.getElementById('admin-menu-selector-modal').classList.remove('open');
}

function openAdminProductsPanel() {
    closeAdminSelectorModal();
    hasUnsavedAdminChanges = false;
    openAdminPanel();
}

function openAdminMenuDiarioPanel() {
    closeAdminSelectorModal();
    document.getElementById('admin-menu-text').value = menuDiarioData.text || '';
    document.getElementById('admin-menu-price').value = menuDiarioData.price || '';
    currentSelectedMenuImageBase64 = menuDiarioData.image || '';

    const imgPreviewBox = document.getElementById('admin-menu-img-preview-box');
    const imgPreview = document.getElementById('admin-menu-img-preview');

    if (currentSelectedMenuImageBase64) {
        imgPreview.src = currentSelectedMenuImageBase64;
        imgPreviewBox.style.display = 'block';
    } else {
        imgPreviewBox.style.display = 'none';
    }

    document.getElementById('admin-menu-diario-modal').classList.add('open');
}

function closeAdminMenuDiarioModal() {
    document.getElementById('admin-menu-diario-modal').classList.remove('open');
}

function previewAdminMenuImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            currentSelectedMenuImageBase64 = e.target.result;
            const imgPreviewBox = document.getElementById('admin-menu-img-preview-box');
            const imgPreview = document.getElementById('admin-menu-img-preview');
            imgPreview.src = currentSelectedMenuImageBase64;
            imgPreviewBox.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function saveAdminMenuDiario() {
    const textVal = document.getElementById('admin-menu-text').value.trim();
    const priceVal = document.getElementById('admin-menu-price').value.trim();

    const updatedMenu = {
        text: textVal || 'Consultar opción de hoy',
        price: priceVal || '',
        image: currentSelectedMenuImageBase64 || ''
    };

    db.ref("MenuDiario").set(updatedMenu).then(() => {
        closeAdminMenuDiarioModal();
        showToast("Menú del día guardado con éxito");
    });
}

function openMenuDiarioModal() {
    document.getElementById('public-menu-text').innerText = menuDiarioData.text || 'Consultar opción de hoy';
    
    const priceBadge = document.getElementById('public-menu-price');
    if (menuDiarioData.price) {
        priceBadge.innerText = `$${parseInt(menuDiarioData.price).toLocaleString('es-AR')}`;
        priceBadge.style.display = 'inline-block';
    } else {
        priceBadge.style.display = 'none';
    }

    const imgContainer = document.getElementById('public-menu-img-container');
    const imgElem = document.getElementById('public-menu-img');

    if (menuDiarioData.image) {
        imgElem.src = menuDiarioData.image;
        imgContainer.style.display = 'block';
    } else {
        imgContainer.style.display = 'none';
    }

    updateMdCheckoutFields();
    updateSubmitButtonsState();
    document.getElementById('public-menu-diario-modal').classList.add('open');
}

function closeMenuDiarioModal() {
    document.getElementById('public-menu-diario-modal').classList.remove('open');
}

function updateMdCheckoutFields() {
    const deliveryType = document.querySelector('input[name="md-delivery-type"]:checked').value;
    const paymentMethod = document.getElementById('md-payment-method').value;

    document.getElementById('md-address-group').style.display = (deliveryType === 'delivery') ? 'block' : 'none';
    document.getElementById('md-cash-change-group').style.display = (deliveryType === 'delivery' && paymentMethod === 'Efectivo') ? 'block' : 'none';
    document.getElementById('md-transfer-info').style.display = (paymentMethod === 'Transferencia') ? 'block' : 'none';
}

function sendWhatsAppMenuDiarioOrder() {
    if (!isStoreOpen) {
        alert('Actualmente nos encontramos fuera de horario de atención.');
        return;
    }

    const name = document.getElementById('md-client-name').value.trim();
    if (!name) { alert('Por favor ingresá tu nombre completo.'); return; }

    const deliveryType = document.querySelector('input[name="md-delivery-type"]:checked').value;
    const address = document.getElementById('md-client-address').value.trim();

    if (deliveryType === 'delivery' && !address) {
        alert('Por favor ingresá la dirección para el delivery.');
        return;
    }

    const paymentMethod = document.getElementById('md-payment-method').value;
    const cashAmount = document.getElementById('md-cash-amount').value.trim();
    const notes = document.getElementById('md-client-notes').value.trim();
    const orderNum = generateOrderNumber();

    let text = `*PEDIDO MENÚ DEL DÍA - SAZÓN CASERO*\n`;
    text += `*ORDEN N°:* #SZ-${orderNum}\n`;
    text += `---------------------------------\n`;
    text += `*Cliente:* ${name}\n`;
    text += `*Modalidad:* ${deliveryType === 'delivery' ? 'Delivery (+$2.500)' : 'Retiro en Local'}\n`;
    if (deliveryType === 'delivery') text += `*Domicilio:* ${address}\n`;
    text += `*Pago:* ${paymentMethod}\n`;
    if (paymentMethod === 'Efectivo' && cashAmount) text += `*Paga con:* ${cashAmount}\n`;
    if (notes) text += `*Notas:* ${notes}\n`;
    text += `---------------------------------\n`;
    text += `*MENÚ ELEGIDO:*\n`;
    text += `• ${menuDiarioData.text}${menuDiarioData.price ? ` - $${parseInt(menuDiarioData.price).toLocaleString('es-AR')}` : ''}\n`;

    window.open(`https://wa.me/543464625383?text=${encodeURIComponent(text)}`, '_blank');
}

function openAdminPanel() {
    document.getElementById('admin-search-input').value = '';
    renderAdminProductsList();
    document.getElementById('admin-panel-modal').classList.add('open');
}

function requestCloseAdminPanel() {
    if (hasUnsavedAdminChanges) {
        document.getElementById('unsaved-changes-modal').classList.add('open');
    } else {
        closeAdminPanelModal();
    }
}

function saveAndCloseAdminPanel() {
    saveAllAdminChanges();
    document.getElementById('unsaved-changes-modal').classList.remove('open');
    closeAdminPanelModal();
}

function discardAndCloseAdminPanel() {
    hasUnsavedAdminChanges = false;
    document.getElementById('unsaved-changes-modal').classList.remove('open');
    closeAdminPanelModal();
}

function cancelCloseAdminPanel() {
    document.getElementById('unsaved-changes-modal').classList.remove('open');
}

function closeAdminPanelModal() {
    document.getElementById('admin-panel-modal').classList.remove('open');
}

function markAdminUnsaved() {
    hasUnsavedAdminChanges = true;
}

function renderAdminProductsList(filterText = '') {
    const container = document.getElementById('admin-products-list');
    container.innerHTML = '';
    const query = filterText.toLowerCase().trim();

    dbProducts.forEach((prod, index) => {
        const catTitle = categoryHeaders[prod.categoria]?.title || prod.categoria;
        if (query && !prod.nombre.toLowerCase().includes(query) && !catTitle.toLowerCase().includes(query)) return;

        const isMultiPrice = prod.precio_secundario !== undefined;
        const isAvailable = String(prod.disponible).toUpperCase() === 'TRUE';

        container.innerHTML += `
            <div class="admin-prod-card">
                <div class="admin-prod-header">
                    <span class="admin-prod-cat">${catTitle}</span>
                    <span class="status-tag ${isAvailable ? 'active' : 'inactive'}">
                        ${isAvailable ? 'Visible' : 'Oculto'}
                    </span>
                </div>
                <div class="admin-prod-inputs">
                    <div>
                        <label style="font-size: 0.65rem; color: var(--text-muted); display: block; margin-bottom: 2px;">Producto:</label>
                        <input type="text" id="admin-name-${index}" value="${prod.nombre}" oninput="markAdminUnsaved()">
                    </div>
                    <div>
                        <label style="font-size: 0.65rem; color: var(--text-muted); display: block; margin-bottom: 2px;">Precio ($):</label>
                        <input type="number" id="admin-price-${index}" value="${prod.precio}" oninput="markAdminUnsaved()">
                    </div>
                    ${isMultiPrice ? `
                        <div>
                            <label style="font-size: 0.65rem; color: var(--text-muted); display: block; margin-bottom: 2px;">Precio Mayor ($):</label>
                            <input type="number" id="admin-price-sec-${index}" value="${prod.precio_secundario || 0}" oninput="markAdminUnsaved()">
                        </div>
                    ` : ''}
                </div>
                <div>
                    <label style="font-size: 0.65rem; color: var(--text-muted); display: block; margin-bottom: 2px;">Detalle / Ingredientes:</label>
                    <textarea id="admin-detail-${index}" class="large-admin-textarea" rows="3" placeholder="Ej: Doble medallón de carne, doble cheddar..." oninput="markAdminUnsaved()">${prod.detalle || ''}</textarea>
                </div>
                <div style="display: flex; gap: 16px; margin-top: 4px; font-size: 0.75rem; color: var(--text-secondary);">
                    <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                        <input type="checkbox" id="admin-veggie-${index}" ${prod.veggie ? 'checked' : ''} onchange="markAdminUnsaved()"> Veggie
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                        <input type="checkbox" id="admin-sintacc-${index}" ${prod.sintacc ? 'checked' : ''} onchange="markAdminUnsaved()"> Sin TACC
                    </label>
                </div>
                <div class="admin-card-actions">
                    <button class="btn-save-prod" onclick="saveProductChanges(${index})"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                    <button class="btn-toggle-prod" onclick="toggleProductAvailability(${index})"><i class="fa-solid ${isAvailable ? 'fa-eye-slash' : 'fa-eye'}"></i> ${isAvailable ? 'Ocultar' : 'Mostrar'}</button>
                    <button class="btn-delete-prod" onclick="promptDeleteProduct(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function filterAdminProducts() {
    renderAdminProductsList(document.getElementById('admin-search-input').value);
}

function saveProductChanges(index) {
    const prod = dbProducts[index];
    const updatedData = {
        ...prod,
        nombre: document.getElementById(`admin-name-${index}`).value,
        precio: document.getElementById(`admin-price-${index}`).value,
        detalle: document.getElementById(`admin-detail-${index}`).value,
        veggie: document.getElementById(`admin-veggie-${index}`).checked,
        sintacc: document.getElementById(`admin-sintacc-${index}`).checked
    };
    if (prod.precio_secundario !== undefined) {
        updatedData.precio_secundario = document.getElementById(`admin-price-sec-${index}`).value;
    }
    db.ref(`Productos/${prod.id}`).update(updatedData).then(() => {
        hasUnsavedAdminChanges = false;
        showToast("Cambios guardados con éxito");
    });
}

function saveAllAdminChanges() {
    dbProducts.forEach((prod, index) => {
        const nameElem = document.getElementById(`admin-name-${index}`);
        if (!nameElem) return;

        const updatedData = {
            ...prod,
            nombre: nameElem.value,
            precio: document.getElementById(`admin-price-${index}`).value,
            detalle: document.getElementById(`admin-detail-${index}`).value,
            veggie: document.getElementById(`admin-veggie-${index}`).checked,
            sintacc: document.getElementById(`admin-sintacc-${index}`).checked
        };
        if (prod.precio_secundario !== undefined) {
            updatedData.precio_secundario = document.getElementById(`admin-price-sec-${index}`).value;
        }
        db.ref(`Productos/${prod.id}`).update(updatedData);
    });
    hasUnsavedAdminChanges = false;
    showToast("Todos los cambios fueron guardados");
}

function toggleProductAvailability(index) {
    const prod = dbProducts[index];
    const newStatus = String(prod.disponible).toUpperCase() === 'TRUE' ? 'FALSE' : 'TRUE';
    db.ref(`Productos/${prod.id}/disponible`).set(newStatus).then(() => {
        showToast(newStatus === 'TRUE' ? 'Producto visible' : 'Producto oculto');
    });
}

function promptDeleteProduct(index) {
    productToDeleteIndex = index;
    const prod = dbProducts[index];
    document.getElementById('delete-modal-msg').innerText = `¿Estás seguro de que deseas eliminar "${prod.nombre}"? Esta acción no se puede deshacer.`;
    document.getElementById('confirm-delete-modal').classList.add('open');
}

function closeDeleteConfirmModal() {
    productToDeleteIndex = null;
    document.getElementById('confirm-delete-modal').classList.remove('open');
}

function executeProductDeletion() {
    if (productToDeleteIndex !== null) {
        const prod = dbProducts[productToDeleteIndex];
        db.ref(`Productos/${prod.id}`).remove().then(() => {
            closeDeleteConfirmModal();
            showToast("Producto eliminado");
        });
    }
}

function openAddProductModal() {
    document.getElementById('new-prod-name').value = '';
    document.getElementById('new-prod-detail').value = '';
    document.getElementById('new-prod-price').value = '';
    document.getElementById('new-prod-price-small').value = '';
    document.getElementById('new-prod-price-large').value = '';
    document.getElementById('new-prod-veggie').checked = false;
    document.getElementById('new-prod-sintacc').checked = false;
    toggleCategoryPriceFields();
    document.getElementById('add-product-modal').classList.add('open');
}

function closeAddProductModal() {
    document.getElementById('add-product-modal').classList.remove('open');
}

function toggleCategoryPriceFields() {
    const cat = document.getElementById('new-prod-category').value;
    const isMulti = ['pizzanesas', 'pizzas'].includes(cat);
    document.getElementById('standard-price-group').style.display = isMulti ? 'none' : 'block';
    document.getElementById('multi-price-group').style.display = isMulti ? 'block' : 'none';
}

function saveNewProduct() {
    const category = document.getElementById('new-prod-category').value;
    const name = document.getElementById('new-prod-name').value.trim();
    const detail = document.getElementById('new-prod-detail').value.trim();
    if (!name) return;

    const prodId = `prod_${Date.now()}`;
    let newProd = { 
        id: prodId, 
        categoria: category, 
        nombre: name, 
        detalle: detail,
        disponible: 'TRUE',
        veggie: document.getElementById('new-prod-veggie').checked,
        sintacc: document.getElementById('new-prod-sintacc').checked
    };

    if (['pizzanesas', 'pizzas'].includes(category)) {
        newProd.precio = document.getElementById('new-prod-price-small').value;
        newProd.precio_secundario = document.getElementById('new-prod-price-large').value;
    } else {
        newProd.precio = document.getElementById('new-prod-price').value;
    }

    db.ref(`Productos/${prodId}`).set(newProd).then(() => {
        closeAddProductModal();
        showToast("Producto agregado con éxito");
    });
}

function renderCategoryPills() {
    const container = document.getElementById('category-pills');
    container.innerHTML = `<button class="pill-btn active" onclick="filterCategory('all', this)">Carta Completa</button>`;
    Object.keys(categoryHeaders).forEach(key => {
        container.innerHTML += `<button class="pill-btn" onclick="filterCategory('${key}', this)">${categoryHeaders[key].title}</button>`;
    });
}

function filterCategory(catKey, element) {
    document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    document.querySelectorAll('.category-section').forEach(sec => {
        sec.style.display = (catKey === 'all' || sec.id === `section-${catKey}`) ? 'block' : 'none';
    });
}

function renderMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    Object.keys(categoryHeaders).forEach(catKey => {
        const items = dbProducts.filter(p => p.categoria === catKey && String(p.disponible).toUpperCase() === 'TRUE');
        if (items.length === 0) return;

        const sec = document.createElement('section');
        sec.className = 'category-section';
        sec.id = `section-${catKey}`;

        sec.innerHTML = `
            <div class="category-header-box">
                <div class="category-icon-wrapper">
                    <i class="fa-solid ${categoryHeaders[catKey].icon}"></i>
                </div>
                <div class="category-title-wrapper">
                    <h2>${categoryHeaders[catKey].title}</h2>
                </div>
            </div>
            <div class="products-grid" id="grid-${catKey}"></div>
        `;

        container.appendChild(sec);
        const grid = sec.querySelector(`#grid-${catKey}`);

        items.forEach(item => {
            const veggieIcon = item.veggie ? `<span class="dietary-icon veggie" title="Vegetariano"><i class="fa-solid fa-leaf"></i></span>` : '';
            const sintaccIcon = item.sintacc ? `<span class="dietary-icon sintacc-badge" title="Sin TACC"><i class="fa-solid fa-wheat-awn"></i></span>` : '';
            const detailText = item.detalle ? `<p class="prod-desc">${item.detalle}</p>` : '';

            if (item.precio_secundario) {
                grid.innerHTML += `
                    <div class="product-card" id="card-${item.id}">
                        <div>
                            <div class="prod-title">${item.nombre} ${veggieIcon} ${sintaccIcon}</div>
                            ${detailText}
                            <div id="pasta-notice-${item.id}"></div>
                            <div class="variant-pills">
                                <button class="variant-btn selected" id="var-1-${item.id}" onclick="selectVariant('${item.id}', 1, ${item.precio})">${catKey === 'pizzas' ? '4 Porciones' : 'P/1'}</button>
                                <button class="variant-btn" id="var-2-${item.id}" onclick="selectVariant('${item.id}', 2, ${item.precio_secundario})">${catKey === 'pizzas' ? '8 Porciones' : 'P/3'}</button>
                            </div>
                        </div>
                        <div class="product-bottom">
                            <div class="price-box">
                                <span class="price-label">Precio</span>
                                <span class="price" id="price-${item.id}">$${parseInt(item.precio).toLocaleString('es-AR')}</span>
                            </div>
                            <button class="btn-add" onclick="addMultiProductToCart('${item.id}', this)"><i class="fa-solid fa-plus"></i> Agregar</button>
                        </div>
                    </div>
                `;
            } else {
                grid.innerHTML += `
                    <div class="product-card" id="card-${item.id}">
                        <div>
                            <div class="prod-title">${item.nombre} ${veggieIcon} ${sintaccIcon}</div>
                            ${detailText}
                            <div id="pasta-notice-${item.id}"></div>
                        </div>
                        <div class="product-bottom">
                            <div class="price-box">
                                <span class="price-label">Precio</span>
                                <span class="price">$${parseInt(item.precio).toLocaleString('es-AR')}</span>
                            </div>
                            <button class="btn-add" onclick="addToCart('${item.id}', '${item.nombre.replace(/'/g, "\\'")}', ${item.precio}, this, '${catKey}')"><i class="fa-solid fa-plus"></i> Agregar</button>
                        </div>
                    </div>
                `;
            }
        });
    });
}

const itemVariants = {};

function selectVariant(itemId, variantNum, price) {
    itemVariants[itemId] = { variantNum, price };
    document.getElementById(`var-1-${itemId}`).classList.toggle('selected', variantNum === 1);
    document.getElementById(`var-2-${itemId}`).classList.toggle('selected', variantNum === 2);
    document.getElementById(`price-${itemId}`).innerText = `$${parseInt(price).toLocaleString('es-AR')}`;
}

function addMultiProductToCart(itemId, btnElem = null) {
    const prod = dbProducts.find(p => p.id === itemId);
    const selected = itemVariants[itemId] || { variantNum: 1, price: prod.precio };
    const label = prod.categoria === 'pizzas' ? (selected.variantNum === 1 ? '4P' : '8P') : (selected.variantNum === 1 ? 'P/1' : 'P/3');

    addToCart(`${itemId}-${selected.variantNum}`, `${prod.nombre} (${label})`, selected.price, btnElem, prod.categoria, itemId);
}

function triggerPastaNotice(prodId) {
    const container = document.getElementById(`pasta-notice-${prodId}`);
    if (!container) return;

    container.innerHTML = `
        <div class="pasta-sauce-notice">
            <i class="fa-solid fa-circle-info"></i>
            <span>Recordá elegir tu salsa en la sección <strong>Salsas</strong> (por defecto se sirve con Tuco).</span>
        </div>
    `;

    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function animateAddButton(btn) {
    if (!btn) return;
    const originalHTML = btn.innerHTML;
    btn.classList.add('added-success');
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Agregado`;

    setTimeout(() => {
        btn.classList.remove('added-success');
        btn.innerHTML = originalHTML;
    }, 1500);
}

function addToCart(id, name, price, btnElem = null, category = '', rawProdId = null) {
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, name, price: parseInt(price), qty: 1 });
    }
    updateCartUI();

    if (category === 'pastas') {
        triggerPastaNotice(rawProdId || id);
    }

    if (btnElem) {
        animateAddButton(btnElem);
    }
}

function updateQty(index, delta) {
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) cart.splice(index, 1);
    }
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    document.getElementById('cart-count').innerText = cart.reduce((acc, i) => acc + i.qty, 0);

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fa-solid fa-utensils"></i><p>El carrito está vacío</p></div>';
    } else {
        cartItems.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <div class="cart-item-header">
                    <div>
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-detail">$${item.price.toLocaleString('es-AR')} c/u</div>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${idx})"><i class="fa-solid fa-trash"></i></button>
                </div>
                <div class="cart-item-footer">
                    <div class="item-qty">
                        <button class="qty-btn" onclick="updateQty(${idx}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${idx}, 1)">+</button>
                    </div>
                    <strong>$${(item.price * item.qty).toLocaleString('es-AR')}</strong>
                </div>
            </div>
        `).join('');
    }
    updateCartTotal();
}

function updateCartTotal() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    const isDelivery = deliveryType === 'delivery';
    const deliveryCost = isDelivery ? 2500 : 0;
    const total = subtotal + deliveryCost;

    document.getElementById('cart-subtotal').innerText = `$${subtotal.toLocaleString('es-AR')}`;
    document.getElementById('cart-total').innerText = `$${total.toLocaleString('es-AR')}`;
    
    document.getElementById('subtotal-line').style.display = isDelivery ? 'flex' : 'none';
    document.getElementById('delivery-line').style.display = isDelivery ? 'flex' : 'none';

    document.getElementById('address-group').style.display = isDelivery ? 'block' : 'none';
    togglePaymentInfo();
    updateSubmitButtonsState();
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('open');
}

function togglePaymentInfo() {
    const method = document.getElementById('payment-method').value;
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    
    document.getElementById('cash-change-group').style.display = (deliveryType === 'delivery' && method === 'Efectivo') ? 'block' : 'none';
    document.getElementById('transfer-info').style.display = (method === 'Transferencia') ? 'block' : 'none';
}

function sendWhatsAppOrder() {
    if (!isStoreOpen) {
        alert('Actualmente nos encontramos fuera de horario de atención.');
        return;
    }

    if (cart.length === 0) return;

    const name = document.getElementById('client-name').value.trim();
    if (!name) { alert('Por favor ingresá tu nombre completo.'); return; }

    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    const address = document.getElementById('client-address').value.trim();

    if (deliveryType === 'delivery' && !address) {
        alert('Por favor ingresá tu domicilio para el envío.');
        return;
    }

    const paymentMethod = document.getElementById('payment-method').value;
    const cashAmount = document.getElementById('cash-amount').value.trim();
    const notes = document.getElementById('client-notes').value.trim();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const deliveryCost = deliveryType === 'delivery' ? 2500 : 0;
    const total = subtotal + deliveryCost;
    const orderNum = generateOrderNumber();

    let text = `*NUEVO PEDIDO - SAZÓN CASERO*\n`;
    text += `*ORDEN N°:* #SZ-${orderNum}\n`;
    text += `---------------------------------\n`;
    text += `*Cliente:* ${name}\n`;
    text += `*Modalidad:* ${deliveryType === 'delivery' ? 'Delivery (+$2.500)' : 'Retiro en Local'}\n`;
    if (deliveryType === 'delivery') text += `*Domicilio:* ${address}\n`;
    text += `*Pago:* ${paymentMethod}\n`;
    if (paymentMethod === 'Efectivo' && cashAmount) text += `*Paga con:* ${cashAmount}\n`;
    if (notes) text += `*Notas:* ${notes}\n`;
    text += `---------------------------------\n`;
    text += `*DETALLE DEL PEDIDO:*\n`;

    cart.forEach(item => {
        text += `• ${item.qty}x ${item.name} - $${(item.price * item.qty).toLocaleString('es-AR')}\n`;
    });

    text += `---------------------------------\n`;
    if (deliveryType === 'delivery') {
        text += `*Subtotal:* $${subtotal.toLocaleString('es-AR')}\n`;
        text += `*Costo de envío:* $2.500\n`;
    }
    text += `*TOTAL:* $${total.toLocaleString('es-AR')}\n`;

    window.open(`https://wa.me/543464625383?text=${encodeURIComponent(text)}`, '_blank');
}