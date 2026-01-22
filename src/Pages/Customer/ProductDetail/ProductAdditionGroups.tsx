import { useState } from 'react';
import type { AdditionGroup } from '../../../shared/types/product/ProductTypes';
import styles from './ProductAdditionGroups.module.css';

interface ProductAdditionGroupsProps {
    groups: AdditionGroup[];
    selectedAdditions: Record<number, number[]>;
    onToggle: (groupId: number, additionId: number, maxSelectable: number) => void;
}

export const ProductAdditionGroups = ({ groups, selectedAdditions, onToggle }: ProductAdditionGroupsProps) => {
    const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>(() => {
        // Optionally expand the first group by default
        const initial: Record<number, boolean> = {};
        if (groups.length > 0) initial[groups[0].id] = true;
        return initial;
    });

    const toggleGroup = (groupId: number) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    const getGroupSummary = (group: AdditionGroup) => {
        const selectedIds = selectedAdditions[group.id] || [];
        if (selectedIds.length === 0) return 'Optional';

        if (group.maxSelectable === 1) {
            const selectedAddition = group.additions.find(a => a.id === selectedIds[0]);
            return selectedAddition ? selectedAddition.name : 'Optional';
        }

        return `${selectedIds.length} selected`;
    };

    return (
        <div className={styles.section}>
            {groups.map((group) => {
                const isExpanded = expandedGroups[group.id];
                const summary = getGroupSummary(group);

                return (
                    <div key={group.id} className={`${styles.group} ${isExpanded ? styles.groupExpanded : ''}`}>
                        <div className={styles.header} onClick={() => toggleGroup(group.id)}>
                            <div className={styles.headerLeft}>
                                <h3 className={styles.groupName}>{group.name}</h3>
                                <span className={styles.maxSelectable}>
                                    {group.maxSelectable === 1 ? 'Select 1' : `Select up to ${group.maxSelectable}`}
                                </span>
                            </div>
                            <div className={styles.headerRight}>
                                {!isExpanded && <span className={styles.summary}>{summary}</span>}
                                <span className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}>
                                    ▼
                                </span>
                            </div>
                        </div>

                        {isExpanded && (
                            <div className={styles.list}>
                                {group.additions.map((addition) => {
                                    const isSelected = (selectedAdditions[group.id] || []).includes(addition.id);
                                    return (
                                        <div
                                            key={addition.id}
                                            className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
                                            onClick={() => onToggle(group.id, addition.id, group.maxSelectable)}
                                        >
                                            <div className={styles.itemInfo}>
                                                <span className={styles.itemName}>{addition.name}</span>
                                                {addition.price > 0 && (
                                                    <span className={styles.itemPrice}>+ {addition.price.toFixed(2)} EGP</span>
                                                )}
                                            </div>
                                            <div className={styles.indicator}>
                                                {group.maxSelectable === 1 ? (
                                                    <div className={`${styles.radio} ${isSelected ? styles.radioActive : ''}`} />
                                                ) : (
                                                    <div className={`${styles.checkbox} ${isSelected ? styles.checkboxActive : ''}`}>
                                                        {isSelected && '✓'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
