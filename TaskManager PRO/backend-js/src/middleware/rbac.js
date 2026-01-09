// Define role permissions
export const rolePermissions = {
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
        'reports:export'
    ],

    // Regular user has basic permissions
    user: [
        'tasks:read',
        'tasks:update',
        'tasks:delete',
        'tasks:assign'
    ]
};

// Check if user has permission
export const hasPermission = (user, permission) => {
    if (!user || !user.role) return false;

    const permissions = rolePermissions[user.role];
    return permissions?.includes(permission) || false;
};

// Get all permissions for a role
export const getAllPermissions = (role) => {
    return rolePermissions[role] || [];
};

// Middleware to check for specific permissions
export const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!hasPermission(req.user, permission)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

// Middleware to check for multiple permissions (ANY of them)
export const requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const hasAnyPermission = permissions.some(permission =>
            hasPermission(req.user, permission)
        );

        if (!hasAnyPermission) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

// Middleware to check for multiple permissions (ALL of them)
export const requireAllPermissions = (permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const hasAllPermissions = permissions.every(permission =>
            hasPermission(req.user, permission)
        );

        if (!hasAllPermissions) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};
