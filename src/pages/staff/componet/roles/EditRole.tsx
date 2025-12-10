import { Save, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BackButton } from "../../../../component/global/components/back/back";
import { inputField } from "../../../../component/global/components/customStyle";
import { useToast } from "../../../../component/toaster/useToast";
import { permissionValues } from "../../../../component/utils/permissons";
import type { IRole } from "../../role.helper/role.interface";
import { useRoleStore } from "../../role.helper/role.store";

const EditRole = () => {

    const { updateRole, getAllRoles } = useRoleStore();
    const location = useLocation();
    const data = location.state?.data as IRole;
    const { showToast } = useToast();

    const [form, setForm] = useState({
        role: data.role,
        permissions: data.permissions,
        isActive: data.isActive,
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getAllRoles({ page: 0, size: 10 });
    }, [getAllRoles]);

    const togglePermission = (permission: string) => {
        setForm((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter((p) => p !== permission)
                : [...prev.permissions, permission],
        }));
    };

    const toggleAllPermissions = () => {
        setForm((prev) => ({
            ...prev,
            permissions:
                prev.permissions.length === permissionValues.length
                    ? []
                    : [...permissionValues],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.role.trim()) {
            showToast("Role name is required", "warning");
            return;
        }

        setIsLoading(true);

        try {
            const res = await updateRole(data.id, form);
            showToast(res.message, res.severity);

            if (res.severity === "success") {
                setForm({ role: "", permissions: [], isActive: true });
                await getAllRoles({ page: 0, size: 10 });
                window.history.back();
            }
        } catch (error) {
            showToast("Failed to update role", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <BackButton />
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Shield className="w-6 h-6 text-primary" />
                            Edit Role {form.role}
                        </h1>
                        <p className="text-muted pt-2">
                            Edit an existing role with specific permissions
                        </p>
                    </div>


                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Role Name */}
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Role Name *
                            </label>
                            <input
                                id="role"
                                type="text"
                                value={form.role}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, role: e.target.value }))
                                }
                                placeholder="e.g., Administrator, Doctor, Nurse"
                                className={inputField}
                                required
                            />
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-3">
                            <input
                                id="isActive"
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                                }
                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                            />
                            <label
                                htmlFor="isActive"
                                className="text-sm font-medium text-foreground"
                            >
                                Active Role
                            </label>
                            <span className="text-xs text-muted">
                                (Inactive roles cannot be assigned)
                            </span>
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">
                                Permissions
                            </h3>
                            <button
                                type="button"
                                onClick={toggleAllPermissions}
                                className="text-sm text-primary hover:text-primary-dark"
                            >
                                {form.permissions.length === permissionValues.length
                                    ? "Deselect All"
                                    : "Select All"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {permissionValues.map((permission) => (
                                <div
                                    key={permission}
                                    className={`
                    p-3 rounded-lg border cursor-pointer transition-all
                    ${form.permissions.includes(permission)
                                            ? "border-primary bg-primary-light/10"
                                            : "border-border hover:border-primary/50"
                                        }
                  `}
                                    onClick={() => togglePermission(permission)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`
                      w-4 h-4 rounded border flex items-center justify-center
                      ${form.permissions.includes(permission)
                                                    ? "bg-primary border-primary"
                                                    : "border-border"
                                                }
                    `}
                                        >
                                            {form.permissions.includes(permission) && (
                                                <div className="w-2 h-2 bg-white rounded-sm" />
                                            )}
                                        </div>
                                        <span className="text-sm text-foreground select-none">
                                            {permission}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-sm text-muted">
                            Selected {form.permissions.length} of {permissionValues.length}{" "}
                            permissions
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-border">
                        <button
                            type="submit"
                            disabled={isLoading || !form.role.trim()}
                            className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Updating Role...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Update Role
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRole;