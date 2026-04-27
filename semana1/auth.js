// Sistema de autenticación y gestión de usuarios

// Usuarios iniciales del sistema
const initialUsers = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador Principal' },
    { id: 2, username: 'usuario', password: 'user123', role: 'user', name: 'Usuario Demo' }
];

// Tiendas iniciales
const initialStores = [
    { id: 1, userId: 2, name: 'Tienda de Ropa', type: 'ropa', description: 'Ropa para toda la familia', location: 'Centro Comercial', date: '2023-10-01' },
    { id: 2, userId: 2, name: 'ElectroShop', type: 'electronica', description: 'Electrónica y gadgets', location: 'Zona Comercial', date: '2023-10-05' }
];

// Clase para manejar la autenticación
class AuthSystem {
    constructor() {
        // Cargar datos del localStorage o usar datos iniciales
        this.users = JSON.parse(localStorage.getItem('users')) || initialUsers;
        this.stores = JSON.parse(localStorage.getItem('stores')) || initialStores;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.nextUserId = Math.max(...this.users.map(u => u.id)) + 1;
        this.nextStoreId = Math.max(...this.stores.map(s => s.id)) + 1;
        
        this.saveData();
    }
    
    saveData() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('stores', JSON.stringify(this.stores));
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }
    
    login(username, password) {
        const user = this.users.find(u => 
            u.username === username && u.password === password
        );
        
        if (user) {
            this.currentUser = user;
            this.saveData();
            return { success: true, user };
        }
        
        return { success: false, message: 'Usuario o contraseña incorrectos' };
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }
    
    registerUser(username, password, role, name = '') {
        // Verificar si el usuario ya existe
        if (this.users.some(u => u.username === username)) {
            return { success: false, message: 'El usuario ya existe' };
        }
        
        const newUser = {
            id: this.nextUserId++,
            username,
            password,
            role,
            name: name || username
        };
        
        this.users.push(newUser);
        this.saveData();
        
        return { success: true, user: newUser };
    }
    
    addStore(storeData) {
        if (!this.currentUser) return { success: false, message: 'No hay usuario autenticado' };
        
        const newStore = {
            id: this.nextStoreId++,
            userId: this.currentUser.id,
            ...storeData,
            date: new Date().toISOString().split('T')[0]
        };
        
        this.stores.push(newStore);
        this.saveData();
        
        return { success: true, store: newStore };
    }
    
    getUserStores(userId) {
        return this.stores.filter(store => store.userId === userId);
    }
    
    getAllUsers() {
        return this.users;
    }
    
    getAllStores() {
        return this.stores;
    }
    
    getStats() {
        const totalUsers = this.users.length;
        const adminCount = this.users.filter(u => u.role === 'admin').length;
        const userCount = this.users.filter(u => u.role === 'user').length;
        const totalStores = this.stores.length;
        
        return { totalUsers, adminCount, userCount, totalStores };
    }
}

// Inicializar el sistema de autenticación
const authSystem = new AuthSystem();