import { useState, useEffect } from "react";
import {
    Layers,
    PlusCircle,
    PencilLine,
    Hash,
    DollarSign,
    Save,
    X
} from "lucide-react";
import styles from "./ProductAdditions.module.css";
import {
    getAdditionGroups,
    getAdditions,
    addAdditionGroup,
    addAddition,
    updateAdditionGroup,
    updateAddition,
    type Addition,
    type AdditionGroup
} from "../../../services/vendorsService";
import { useNotification } from "../../../contexts/NotificationContext";

export const ProductAdditions = () => {
    const { showSuccess, showError } = useNotification();

    // State for data
    const [groups, setGroups] = useState<AdditionGroup[]>([]);
    const [additions, setAdditions] = useState<Addition[]>([]);

    // State for Group Form
    const [groupForm, setGroupForm] = useState({ name: "" });
    const [editingGroupId, setEditingGroupId] = useState<number | null>(null);

    // State for Addition Form
    const [additionForm, setAdditionForm] = useState({ name: "", price: 0, groupIds: [] as number[] });
    const [editingAdditionId, setEditingAdditionId] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [groupsRes, additionsRes] = await Promise.all([
                getAdditionGroups(),
                getAdditions()
            ]);
            setGroups(groupsRes.data || []);
            setAdditions(additionsRes.data || []);
        } catch (error) {
            console.error("Error fetching additions data:", error);
        }
    };

    /* ---------------- Group Handlers ---------------- */

    const handleGroupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupForm.name) return;

        try {
            if (editingGroupId) {
                await updateAdditionGroup({ id: editingGroupId, name: groupForm.name, vendorId: 0 });
                showSuccess("Group updated successfully");
            } else {
                await addAdditionGroup(groupForm);
                showSuccess("Group added successfully");
            }
            setGroupForm({ name: "" });
            setEditingGroupId(null);
            fetchData();
        } catch (error) {
            showError("Failed to save group");
        }
    };

    const handleEditGroup = (group: AdditionGroup) => {
        setEditingGroupId(group.id);
        setGroupForm({ name: group.name });
    };

    /* ---------------- Addition Handlers ---------------- */

    const handleAdditionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!additionForm.name) return;

        try {
            if (editingAdditionId) {
                await updateAddition({ id: editingAdditionId, ...additionForm });
                showSuccess("Addition updated successfully");
            } else {
                await addAddition(additionForm);
                showSuccess("Addition added successfully");
            }
            setAdditionForm({ name: "", price: 0, groupIds: [] });
            setEditingAdditionId(null);
            fetchData();
        } catch (error) {
            showError("Failed to save addition");
        }
    };

    const handleEditAddition = (addition: Addition) => {
        setEditingAdditionId(addition.id);
        setAdditionForm({
            name: addition.name,
            price: addition.price,
            groupIds: addition.groupIds || []
        });
    };

    const toggleGroupInAddition = (groupId: number) => {
        setAdditionForm(prev => {
            const isSelected = prev.groupIds.includes(groupId);
            if (isSelected) {
                return { ...prev, groupIds: prev.groupIds.filter(id => id !== groupId) };
            } else {
                return { ...prev, groupIds: [...prev.groupIds, groupId] };
            }
        });
    };

    return (
        <div className={styles.additionsContainer}>
            {/* Addition Groups Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Layers size={24} />
                    Addition Groups
                </h2>

                <form className={styles.form} onSubmit={handleGroupSubmit}>
                    <h3>{editingGroupId ? "Edit Group" : "Create New Group"}</h3>
                    <div className={styles.inputGroup}>
                        <label>Group Name</label>
                        <div className={styles.inputWrapper}>
                            <Hash className={styles.inputIcon} size={18} />
                            <input
                                value={groupForm.name}
                                onChange={e => setGroupForm({ name: e.target.value })}
                                placeholder="e.g. Extra Toppings"
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" className={styles.submitBtn}>
                            {editingGroupId ? <Save size={18} /> : <PlusCircle size={18} />}
                            {editingGroupId ? "Update Group" : "Add Group"}
                        </button>
                        {editingGroupId && (
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => { setEditingGroupId(null); setGroupForm({ name: "" }); }}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </form>

                <div className={styles.list}>
                    {groups.map(group => (
                        <div key={group.id} className={styles.listItem}>
                            <div className={styles.itemInfo}>
                                <h4>{group.name}</h4>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.editBtn} onClick={() => handleEditGroup(group)}>
                                    <PencilLine size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {groups.length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>No groups created yet</p>}
                </div>
            </div>

            {/* Additions Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <PlusCircle size={24} />
                    Individual Additions
                </h2>

                <form className={styles.form} onSubmit={handleAdditionSubmit}>
                    <h3>{editingAdditionId ? "Edit Addition" : "Create New Addition"}</h3>
                    <div className={styles.inputGroup}>
                        <label>Addition Name</label>
                        <div className={styles.inputWrapper}>
                            <Hash className={styles.inputIcon} size={18} />
                            <input
                                value={additionForm.name}
                                onChange={e => setAdditionForm({ ...additionForm, name: e.target.value })}
                                placeholder="e.g. Extra Cheese"
                            />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Price (EGP)</label>
                        <div className={styles.inputWrapper}>
                            <DollarSign className={styles.inputIcon} size={18} />
                            <input
                                type="number"
                                step="0.5"
                                value={additionForm.price}
                                onChange={e => setAdditionForm({ ...additionForm, price: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Assign to Groups</label>
                        <div className={styles.checkboxList}>
                            {groups.map(group => (
                                <label key={group.id} className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={additionForm.groupIds.includes(group.id)}
                                        onChange={() => toggleGroupInAddition(group.id)}
                                    />
                                    {group.name}
                                </label>
                            ))}
                            {groups.length === 0 && <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Create a group first</span>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" className={styles.submitBtn}>
                            {editingAdditionId ? <Save size={18} /> : <PlusCircle size={18} />}
                            {editingAdditionId ? "Update Addition" : "Add Addition"}
                        </button>
                        {editingAdditionId && (
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => {
                                    setEditingAdditionId(null);
                                    setAdditionForm({ name: "", price: 0, groupIds: [] });
                                }}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </form>

                <div className={styles.list}>
                    {additions.map(addition => (
                        <div key={addition.id} className={styles.listItem}>
                            <div className={styles.itemInfo}>
                                <h4>{addition.name}</h4>
                                <p>${addition.price.toFixed(2)}</p>
                                <div className={styles.itemBadges}>
                                    {addition.groupIds.map(gid => {
                                        const group = groups.find(g => g.id === gid);
                                        return group ? <span key={gid} className={styles.badge}>{group.name}</span> : null;
                                    })}
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.editBtn} onClick={() => handleEditAddition(addition)}>
                                    <PencilLine size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {additions.length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>No additions created yet</p>}
                </div>
            </div>
        </div>
    );
};
