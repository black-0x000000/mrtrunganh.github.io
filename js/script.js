// ===== ĐỊNH NGHĨA TÀI KHOẢN MẶC ĐỊNH =====
const DEFAULT_USERS = {
    'owner': {
        username: 'owner',
        password: 'owner123',
        role: 'owner',
        fullName: 'Chủ sở hữu'
    },
    'admin': {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        fullName: 'Quản trị viên'
    },
    'user': {
        username: 'user',
        password: 'user123',
        role: 'user',
        fullName: 'Người dùng'
    }
};

// ===== KHỞI TẠO DỮ LIỆU =====
function initializeUsers() {
    let users = localStorage.getItem('users');
    
    if (!users) {
        localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
        console.log('✅ Đã tạo tài khoản mặc định');
    }
}

initializeUsers();

// ===== LẤY DANH SÁCH USERS =====
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : {};
}

// ===== LƯU DANH SÁCH USERS =====
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// ===== XỬ LÝ ĐĂNG NHẬP =====
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }

    // ===== FORM ĐĂNG NHẬP =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const messageDiv = document.getElementById('message');
            
            if (!username || !password) {
                showMessage(messageDiv, 'Vui lòng nhập đầy đủ thông tin!', 'error');
                return;
            }
            
            const users = getUsers();
            const user = users[username];
            
            if (!user) {
                showMessage(messageDiv, '❌ Tên đăng nhập không tồn tại!', 'error');
                return;
            }
            
            if (user.password !== password) {
                showMessage(messageDiv, '❌ Mật khẩu không chính xác!', 'error');
                return;
            }
            
            showMessage(messageDiv, '✅ Đăng nhập thành công!', 'success');
            
            sessionStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                role: user.role,
                fullName: user.fullName
            }));
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }

    // ===== FORM ĐĂNG KÝ (ĐÃ SỬA - BỎ CHỌN VAI TRÒ) =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
            const messageDiv = document.getElementById('message');
            
            // Validate
            if (!username || !password || !confirmPassword) {
                showMessage(messageDiv, 'Vui lòng nhập đầy đủ thông tin!', 'error');
                return;
            }
            
            if (username.length < 3) {
                showMessage(messageDiv, 'Tên đăng nhập phải có ít nhất 3 ký tự!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage(messageDiv, 'Mật khẩu phải có ít nhất 6 ký tự!', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage(messageDiv, '❌ Mật khẩu xác nhận không khớp!', 'error');
                return;
            }
            
            // Kiểm tra username đã tồn tại
            const users = getUsers();
            if (users[username]) {
                showMessage(messageDiv, '❌ Tên đăng nhập đã tồn tại!', 'error');
                return;
            }
            
            // Tạo tài khoản mới - MẶC ĐỊNH LÀ USER
            users[username] = {
                username: username,
                password: password,
                role: 'user',  // 🟢 LUÔN LÀ USER
                fullName: username
            };
            
            saveUsers(users);
            
            showMessage(
                messageDiv, 
                `✅ Đăng ký thành công!<br>Bạn đã tạo tài khoản với vai trò: Người dùng (User)<br>Hãy đăng nhập ngay!`, 
                'success'
            );
            
            registerForm.reset();
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        });
    }

    // ===== DASHBOARD =====
    if (window.location.pathname.includes('dashboard.html')) {
        const currentUserData = sessionStorage.getItem('currentUser');
        
        if (!currentUserData) {
            window.location.href = 'index.html';
            return;
        }
        
        const user = JSON.parse(currentUserData);
        const users = getUsers();
        
        document.getElementById('userDisplay').textContent = `👤 ${user.fullName} (${user.role})`;
        document.getElementById('welcomeMessage').textContent = `Chào mừng ${user.fullName} trở lại!`;
        
        const roleMessages = {
            'owner': 'Bạn có quyền cao nhất trong hệ thống. Hãy quản lý mọi thứ một cách khôn ngoan! 👑',
            'admin': 'Bạn có quyền quản trị hệ thống. Hãy kiểm duyệt và quản lý người dùng! ⚙️',
            'user': 'Bạn đang ở khu vực người dùng. Khám phá các tính năng dành cho bạn! 👤'
        };
        document.getElementById('roleMessage').textContent = roleMessages[user.role] || '';
        
        document.getElementById('userContent').style.display = 'block';
        
        if (user.role === 'admin' || user.role === 'owner') {
            document.getElementById('adminContent').style.display = 'block';
            document.getElementById('userListSection').style.display = 'block';
            renderUserList(users);
        }
        
        if (user.role === 'owner') {
            document.getElementById('ownerContent').style.display = 'block';
        }
        
        document.getElementById('logoutBtn').addEventListener('click', function() {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});

// ===== HIỂN THỊ DANH SÁCH USER =====
function renderUserList(users) {
    const userListDiv = document.getElementById('userList');
    if (!userListDiv) return;
    
    userListDiv.innerHTML = '';
    
    Object.keys(users).forEach(key => {
        const user = users[key];
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        const roleLabels = {
            'owner': '👑 Owner',
            'admin': '⚙️ Admin',
            'user': '👤 User'
        };
        
        userItem.innerHTML = `
            <span><strong>${user.username}</strong></span>
            <span class="role-badge ${user.role}">${roleLabels[user.role] || user.role}</span>
        `;
        
        userListDiv.appendChild(userItem);
    });
}

// ===== HIỂN THỊ THÔNG BÁO =====
function showMessage(element, message, type) {
    if (!element) return;
    
    element.innerHTML = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    if (type !== 'success' || !message.includes('Đăng ký thành công')) {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}
