// ===== ĐỊNH NGHĨA TÀI KHOẢN MẶC ĐỊNH =====
const DEFAULT_USERS = {
    'owner': {
        username: 'owner',
        password: 'owner123',
        role: 'owner',
        fullName: 'Chủ sở hữu',
        avatar: '',
        bio: ''
    },
    'admin': {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        fullName: 'Quản trị viên',
        avatar: '',
        bio: ''
    },
    'user': {
        username: 'user',
        password: 'user123',
        role: 'user',
        fullName: 'Người dùng',
        avatar: '',
        bio: ''
    }
};

// ===== KHỞI TẠO DỮ LIỆU =====
function initializeUsers() {
    let users = localStorage.getItem('users');
    
    if (!users) {
        localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
        console.log('✅ Đã tạo tài khoản mặc định');
    } else {
        // Kiểm tra và thêm avatar/bio cho user cũ nếu chưa có
        const userData = JSON.parse(users);
        let updated = false;
        Object.keys(userData).forEach(key => {
            if (!userData[key].avatar) {
                userData[key].avatar = '';
                updated = true;
            }
            if (!userData[key].bio) {
                userData[key].bio = '';
                updated = true;
            }
        });
        if (updated) {
            localStorage.setItem('users', JSON.stringify(userData));
        }
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

// ===== LẤY USER HIỆN TẠI =====
function getCurrentUser() {
    const data = sessionStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
}

// ===== CẬP NHẬT USER =====
function updateUser(username, updates) {
    const users = getUsers();
    if (users[username]) {
        users[username] = { ...users[username], ...updates };
        saveUsers(users);
        return true;
    }
    return false;
}

// ============================================================
// ===== XỬ LÝ ĐĂNG NHẬP =====
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
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
                fullName: user.fullName,
                avatar: user.avatar || '',
                bio: user.bio || ''
            }));
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }

    // ===== FORM ĐĂNG KÝ =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
            const messageDiv = document.getElementById('message');
            
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
            
            const users = getUsers();
            if (users[username]) {
                showMessage(messageDiv, '❌ Tên đăng nhập đã tồn tại!', 'error');
                return;
            }
            
            // Tạo tài khoản mới - mặc định User
            users[username] = {
                username: username,
                password: password,
                role: 'user',
                fullName: username,
                avatar: '',
                bio: ''
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

    // ============================================================
    // ===== DASHBOARD =====
    // ============================================================
    
    if (window.location.pathname.includes('dashboard.html')) {
        const currentUserData = getCurrentUser();
        
        if (!currentUserData) {
            window.location.href = 'index.html';
            return;
        }
        
        const users = getUsers();
        const user = users[currentUserData.username];
        
        // Cập nhật session với dữ liệu mới nhất
        if (user) {
            currentUserData.avatar = user.avatar || '';
            currentUserData.bio = user.bio || '';
            sessionStorage.setItem('currentUser', JSON.stringify(currentUserData));
        }
        
        // Hiển thị avatar
        const avatarImg = document.getElementById('avatarImage');
        if (avatarImg) {
            if (user && user.avatar) {
                avatarImg.src = user.avatar;
            } else {
                // Avatar mặc định - tạo chữ cái đầu
                const name = currentUserData.fullName || currentUserData.username;
                const initial = name.charAt(0).toUpperCase();
                const canvas = document.createElement('canvas');
                canvas.width = 48;
                canvas.height = 48;
                const ctx = canvas.getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, 48, 48);
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(24, 24, 24, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(initial, 24, 26);
                avatarImg.src = canvas.toDataURL();
            }
        }
        
        // Hiển thị tên
        document.getElementById('userDisplay').textContent = currentUserData.fullName || currentUserData.username;
        document.getElementById('welcomeMessage').textContent = `Chào mừng ${currentUserData.fullName || currentUserData.username} trở lại!`;
        
        const roleMessages = {
            'owner': 'Bạn có quyền cao nhất trong hệ thống. Hãy quản lý mọi thứ một cách khôn ngoan! 👑',
            'admin': 'Bạn có quyền quản trị hệ thống. Hãy kiểm duyệt và quản lý người dùng! ⚙️',
            'user': 'Bạn đang ở khu vực người dùng. Khám phá các tính năng dành cho bạn! 👤'
        };
        document.getElementById('roleMessage').textContent = roleMessages[currentUserData.role] || '';
        
        // Hiển thị nội dung theo role
        document.getElementById('userContent').style.display = 'block';
        
        if (currentUserData.role === 'admin' || currentUserData.role === 'owner') {
            document.getElementById('adminContent').style.display = 'block';
            document.getElementById('userListSection').style.display = 'block';
            renderUserList(users);
        }
        
        if (currentUserData.role === 'owner') {
            document.getElementById('ownerContent').style.display = 'block';
        }
        
        // Click avatar -> sang profile
        const avatarBtn = document.getElementById('avatarBtn');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', function() {
                window.location.href = 'profile.html';
            });
        }
        
        // Đăng xuất
        document.getElementById('logoutBtn').addEventListener('click', function() {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // ============================================================
    // ===== PROFILE PAGE =====
    // ============================================================
    
    if (window.location.pathname.includes('profile.html')) {
        const currentUserData = getCurrentUser();
        
        if (!currentUserData) {
            window.location.href = 'index.html';
            return;
        }
        
        const users = getUsers();
        const user = users[currentUserData.username];
        
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        
        // Hiển thị avatar lớn
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            if (user.avatar) {
                profileAvatar.src = user.avatar;
            } else {
                // Avatar mặc định
                const name = currentUserData.fullName || currentUserData.username;
                const initial = name.charAt(0).toUpperCase();
                const canvas = document.createElement('canvas');
                canvas.width = 150;
                canvas.height = 150;
                const ctx = canvas.getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, 150, 150);
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(75, 75, 75, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 60px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(initial, 75, 80);
                profileAvatar.src = canvas.toDataURL();
            }
        }
        
        // Hiển thị tên
        document.getElementById('profileName').textContent = currentUserData.fullName || currentUserData.username;
        
        const roleLabels = {
            'owner': '👑 Chủ sở hữu',
            'admin': '⚙️ Quản trị viên',
            'user': '👤 Người dùng'
        };
        document.getElementById('profileRole').textContent = roleLabels[currentUserData.role] || '';
        
        // Hiển thị bio
        const bioTextarea = document.getElementById('profileBio');
        if (bioTextarea) {
            bioTextarea.value = user.bio || '';
            document.getElementById('bioCount').textContent = (user.bio || '').length;
        }
        
        // Đếm số ký tự bio
        if (bioTextarea) {
            bioTextarea.addEventListener('input', function() {
                const count = this.value.length;
                document.getElementById('bioCount').textContent = count;
                const counter = document.getElementById('bioCount');
                if (count >= 180) {
                    counter.style.color = '#e74c3c';
                } else {
                    counter.style.color = 'rgba(255,255,255,0.3)';
                }
            });
        }
        
        // Lưu bio
        document.getElementById('saveBioBtn').addEventListener('click', function() {
            const bio = bioTextarea.value.trim();
            if (bio.length > 180) {
                showMessage(document.getElementById('profileMessage'), 'Tiểu sử không được vượt quá 180 ký tự!', 'error');
                return;
            }
            
            if (updateUser(currentUserData.username, { bio: bio })) {
                // Cập nhật session
                currentUserData.bio = bio;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUserData));
                showMessage(document.getElementById('profileMessage'), '✅ Đã lưu tiểu sử thành công!', 'success');
            } else {
                showMessage(document.getElementById('profileMessage'), '❌ Có lỗi xảy ra!', 'error');
            }
        });
        
        // Đổi avatar
        document.getElementById('changeAvatarBtn').addEventListener('click', function() {
            document.getElementById('avatarInput').click();
        });
        
        document.getElementById('avatarInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            // Kiểm tra file ảnh
            if (!file.type.startsWith('image/')) {
                showMessage(document.getElementById('profileMessage'), 'Vui lòng chọn file ảnh!', 'error');
                return;
            }
            
            // Kiểm tra kích thước (tối đa 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showMessage(document.getElementById('profileMessage'), 'Ảnh không được vượt quá 2MB!', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const avatarData = event.target.result;
                
                if (updateUser(currentUserData.username, { avatar: avatarData })) {
                    // Cập nhật session
                    currentUserData.avatar = avatarData;
                    sessionStorage.setItem('currentUser', JSON.stringify(currentUserData));
                    
                    // Cập nhật avatar trên trang
                    document.getElementById('profileAvatar').src = avatarData;
                    
                    showMessage(document.getElementById('profileMessage'), '✅ Đã cập nhật avatar thành công!', 'success');
                } else {
                    showMessage(document.getElementById('profileMessage'), '❌ Có lỗi xảy ra!', 'error');
                }
            };
            reader.readAsDataURL(file);
            
            // Reset input
            this.value = '';
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
