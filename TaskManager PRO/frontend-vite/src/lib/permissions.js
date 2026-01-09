// Define role permissions
const rolePermissions = {
    // Admin has all permissions
    admin: [
        'tasks:create',
        'tasks:read',
        'tasks:update',
        'tasks:delete',
        'tasks:assign',
        'tasks:read-all',
        'tasks:update-all',
        'tasks:delete-all',
        'users:read',
        'users:update',
        'users:create',
        'users:delete',
        'users:manage-roles',
        'reports:view',
        'reports:export',
        'system:settings'
    ],

    // Manager has most permissions except user management and system settings
    manager: [
        'tasks:read',
        'tasks:update',
        'tasks:delete',
        'tasks:assign',
        'tasks:read-all',
        'tasks:update-all',
        'tasks:delete-all',
        'users:read',
        'reports:view',
        'reports:export',
        'tasks:create' // Managers should likely be able to create tasks too
    ],

    // Regular user has basic permissions
    user: [
        'tasks:read',
        'tasks:update',
        // 'tasks:delete', // Users usually shouldn't delete tasks
        // 'tasks:create' // Depending on requirements, maybe users can create tasks?
    ]
};

// Get user role from sessionStorage
export const getUserRole = () => {
    try {
        const authData = sessionStorage.getItem('auth-storage');
        if (authData) {
            const parsed = JSON.parse(authData);
            if (parsed?.user?.role) {
                return parsed.user.role;
            }
        }
        return null;
    } catch (err) {
        console.error('Error getting user role:', err);
        return null;
    }
};

// Check if user has permission
export const hasPermission = (permission) => {
    const role = getUserRole();

    if (!role) return false;

    // Admin has all permissions implicitly (failsafe)
    if (role === 'admin') return true;

    const permissions = rolePermissions[role];
    return permissions?.includes(permission) || false;
};

// Check if user has any of the permissions
export const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
};

// Check if user has all of the permissions
export const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
};

// Function for conditional rendering based on permissions
export const checkPermission = (
    permission,
    hasPermissionFn,
    noPermissionFn
) => {
    // Check for single permission
    if (typeof permission === 'string') {
        return hasPermission(permission) ? hasPermissionFn() : (noPermissionFn ? noPermissionFn() : null);
    }

    // Check for multiple permissions (any of them)
    return hasAnyPermission(permission) ? hasPermissionFn() : (noPermissionFn ? noPermissionFn() : null);
};

// Export role checking helpers
export const isAdmin = () => getUserRole() === 'admin';
export const isManager = () => getUserRole() === 'manager';
export const isUser = () => getUserRole() === 'user';
