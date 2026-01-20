import { useState, useEffect } from "react";
import {
    Layers,
    PlusCircle,
    PencilLine,
    Hash,
    DollarSign,
    Save,
    X,
    Trash2,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import styles from "./ProductAdditions.module.css";
import {
    getAdditionGroups,
    createAdditionGroup,
    updateAdditionGroup,
    deleteAdditionGroup,
    getAdditionsByGroup,
    createAddition,
    updateAddition,
    deleteAddition,
    type Addition,
    type AdditionGroup
} from "../../../services/additionsService";
import { useNotification } from "../../../contexts/NotificationContext";

interface GroupWithAdditions extends AdditionGroup {
    additions: Addition[];
    isExpanded?: boolean;
}

export const ProductAdditions = () => {
    const { showSuccess, showError } = useNotification();

    // State for data
    const [groups, setGroups] = useState<GroupWithAdditions[]>([]);
    const [loading, setLoading] = useState(true);

    // State for Group Form
    const [groupForm, setGroupForm] = useState({ name: "", maxSelectable: 1 });
    const [editingGroupId, setEditingGroupId] = useState<number | null>(null);

    // State for Addition Form
    const [additionForm, setAdditionForm] = useState({ name: "", price: 0 });
    const [editingAdditionId, setEditingAdditionId] = useState<number | null>(null);
    const [activeGroupId, setActiveGroupId] = useState<number | null>(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const res = await getAdditionGroups();
            const groupsData: AdditionGroup[] = res.data || [];

            // Fetch additions for each group
            const groupsWithAdditions = await Promise.all(groupsData.map(async (group) => {
                const addRes = await getAdditionsByGroup(group.id);
                return { ...group, additions: addRes.data || [], isExpanded: true };
            }));

            setGroups(groupsWithAdditions);
        } catch (error) {
            console.error("Error fetching additions data:", error);
            showError("Failed to fetch customizations");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- Group Handlers ---------------- */

    const handleGroupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupForm.name) return;

        try {
            if (editingGroupId) {
                await updateAdditionGroup(editingGroupId, groupForm.name, groupForm.maxSelectable);
                showSuccess("Group updated successfully");
            } else {
                await createAdditionGroup(groupForm.name, groupForm.maxSelectable);
                showSuccess("Group added successfully");
            }
            setGroupForm({ name: "", maxSelectable: 1 });
            setEditingGroupId(null);
            fetchGroups();
        } catch (error) {
            showError("Failed to save group");
        }
    };

    const handleEditGroup = (group: AdditionGroup) => {
        setEditingGroupId(group.id);
        setGroupForm({ name: group.name, maxSelectable: group.maxSelectable || 1 });
    };

    const handleDeleteGroup = async (id: number) => {
        if (!confirm("Are you sure? This will delete the group and ALL its additions across all shops.")) return;
        try {
            await deleteAdditionGroup(id);
            showSuccess("Group deleted successfully");
            fetchGroups();
        } catch (error) {
            showError("Failed to delete group");
        }
    };

    const toggleGroupExpand = (groupId: number) => {
        setGroups(prev => prev.map(g => g.id === groupId ? { ...g, isExpanded: !g.isExpanded } : g));
    };

    /* ---------------- Addition Handlers ---------------- */

    const handleAdditionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!additionForm.name || activeGroupId === null) return;

        try {
            if (editingAdditionId) {
                await updateAddition(editingAdditionId, additionForm);
                showSuccess("Addition updated successfully");
            } else {
                await createAddition(activeGroupId, additionForm);
                showSuccess("Addition added successfully");
            }
            resetAdditionForm();
            fetchGroups();
        } catch (error) {
            showError("Failed to save addition");
        }
    };

    const handleEditAddition = (groupId: number, addition: Addition) => {
        setActiveGroupId(groupId);
        setEditingAdditionId(addition.id);
        setAdditionForm({
            name: addition.name,
            price: addition.price
        });
    };

    const handleDeleteAddition = async (id: number) => {
        if (!confirm("Delete this addition? It will be removed from all shops.")) return;
        try {
            await deleteAddition(id);
            showSuccess("Addition deleted");
            fetchGroups();
        } catch (error) {
            showError("Failed to delete addition");
        }
    };

    const resetAdditionForm = () => {
        setAdditionForm({ name: "", price: 0 });
        setEditingAdditionId(null);
        setActiveGroupId(null);
    };

    return (
        <div className={styles.additionsContainer}>
            {/* Addition Groups Management */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Layers size={24} />
                    Customization Groups
                </h2>

                <form className={styles.form} onSubmit={handleGroupSubmit}>
                    <h3>{editingGroupId ? "Edit Group" : "Create New Group"}</h3>
                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup} style={{ flex: 3 }}>
                            <label>Group Name</label>
                            <div className={styles.inputWrapper}>
                                <Hash className={styles.inputIcon} size={18} />
                                <input
                                    value={groupForm.name}
                                    onChange={e => setGroupForm({ ...groupForm, name: e.target.value })}
                                    placeholder="e.g. Extra Toppings"
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup} style={{ flex: 1 }}>
                            <label>Max Selectable</label>
                            <div className={styles.inputWrapper}>
                                <PlusCircle className={styles.inputIcon} size={18} />
                                <input
                                    type="number"
                                    min="1"
                                    value={groupForm.maxSelectable}
                                    onChange={e => setGroupForm({ ...groupForm, maxSelectable: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitBtn}>
                            {editingGroupId ? <Save size={18} /> : <PlusCircle size={18} />}
                            {editingGroupId ? "Update Group" : "Add Group"}
                        </button>
                        {editingGroupId && (
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => { setEditingGroupId(null); setGroupForm({ name: "", maxSelectable: 1 }); }}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </form>

                <div className={styles.groupsAccordion}>
                    {loading ? (
                        <p className={styles.loadingText}>Loading customizations...</p>
                    ) : (
                        groups.map(group => (
                            <div key={group.id} className={`${styles.accordionItem} ${group.isExpanded ? styles.expanded : ""}`}>
                                <div className={styles.groupHeader}>
                                    <div className={styles.groupMainInfo} onClick={() => toggleGroupExpand(group.id)}>
                                        {group.isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        <h4>{group.name}</h4>
                                        <span className={styles.countBadge}>{group.additions.length} additions</span>
                                        <span className={styles.maxBadge}>Max: {group.maxSelectable}</span>
                                    </div>
                                    <div className={styles.groupActions}>
                                        <button className={styles.editBtn} onClick={(e) => { e.stopPropagation(); handleEditGroup(group); }}>
                                            <PencilLine size={16} />
                                        </button>
                                        <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}>
                                            <Trash2 size={16} />
                                        </button>
                                        <button
                                            className={styles.addBtn}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveGroupId(group.id);
                                                setEditingAdditionId(null);
                                                setAdditionForm({ name: "", price: 0 });
                                            }}
                                        >
                                            <PlusCircle size={16} />
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {group.isExpanded && (
                                    <div className={styles.groupContent}>
                                        {/* Nested Addition Form */}
                                        {(activeGroupId === group.id) && (
                                            <form className={styles.nestedForm} onSubmit={handleAdditionSubmit}>
                                                <div className={styles.nestedInputRow}>
                                                    <div className={styles.inputWrapper}>
                                                        <Hash size={14} className={styles.inputIcon} />
                                                        <input
                                                            placeholder="Addition name"
                                                            value={additionForm.name}
                                                            onChange={e => setAdditionForm({ ...additionForm, name: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className={styles.inputWrapper}>
                                                        <DollarSign size={14} className={styles.inputIcon} />
                                                        <input
                                                            type="number"
                                                            placeholder="Price"
                                                            step="0.5"
                                                            value={additionForm.price}
                                                            onChange={e => setAdditionForm({ ...additionForm, price: parseFloat(e.target.value) || 0 })}
                                                        />
                                                    </div>
                                                    <button type="submit" className={styles.saveBtn}>
                                                        <Save size={14} />
                                                    </button>
                                                    <button type="button" className={styles.cancelBtn} onClick={resetAdditionForm}>
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        <div className={styles.additionsList}>
                                            {group.additions.map(addition => (
                                                <div key={addition.id} className={styles.additionItem}>
                                                    <div className={styles.additionInfo}>
                                                        <span className={styles.additionName}>{addition.name}</span>
                                                        <span className={styles.additionPrice}>+{addition.price.toFixed(2)} EGP</span>
                                                    </div>
                                                    <div className={styles.additionActions}>
                                                        <button className={styles.miniBtn} onClick={() => handleEditAddition(group.id, addition)}>
                                                            <PencilLine size={14} />
                                                        </button>
                                                        <button className={styles.miniBtnDanger} onClick={() => handleDeleteAddition(addition.id)}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {group.additions.length === 0 && !activeGroupId && (
                                                <p className={styles.emptyAdditions}>No additions in this group.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {!loading && groups.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>No customization groups created yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
