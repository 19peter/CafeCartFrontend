import styles from "./CategoryStyles.module.css";

interface CategoryDivProps {
    category: string;
    selectedCategory: number;
    index: number;
    handleCategoryChange: (category: string) => void;
}

export const CategoryDiv = ({ category, selectedCategory, index, handleCategoryChange }: CategoryDivProps) => {
    const isSelected = selectedCategory === index;

    return (
        <button
            className={`${styles.categoryDiv} ${isSelected ? styles.selectedCategoryDiv : ""}`}
            onClick={() => handleCategoryChange(category)}
            type="button"
        >
            <h4>{category}</h4>
            {isSelected && <div className={styles.indicator} />}
        </button>
    );
};