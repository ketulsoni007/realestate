import { useAppSelector } from 'src/store';

const userPermissionCheck = (
    moduleName: string,
    permissionType: "can_view" | "can_edit" | "can_create" | "can_delete",
    subModuleName?: string
): boolean | "loading" => {
    const rolePermissions = useAppSelector((state: any) => state.common.isPermissionList);
    const isApiStatus = useAppSelector((state: any) => state.common.isApiStatus);
    const permissionLoading = isApiStatus?.permissionListApi === 'loading';
    if (permissionLoading) {
        return "loading";
    }
    const hasPermission = () => {
        if (!rolePermissions || !rolePermissions.permissions) {
            return false;
        }
        for (const role of rolePermissions.permissions) {
            if (role.module && role.module.name === moduleName) {
                if (!subModuleName) {
                    return role[permissionType] === true;
                }
                if (Array.isArray(role.submodule)) {
                    for (const sub of role.submodule) {
                        if (sub.submodule && sub.submodule.name === subModuleName) {
                            return sub[permissionType] === true;
                        }
                    }
                }
            }
        }
        return false;
    };

    return hasPermission();
};

export default userPermissionCheck;
