import styles from "./CategoryStyles.module.css";

interface CategoryDivProps {
    category: string;
    selectedCategory: number;
    index: number;
    handleCategoryChange: (category: string) => void;
}

export const CategoryDiv = ({ category, selectedCategory, index, handleCategoryChange }: CategoryDivProps) => {
    
    return (
        <div
            className={styles.categoryDiv + " " + (selectedCategory === index ? styles.selectedCategoryDiv : "")}
            onClick={() => handleCategoryChange(category)}>
            <h4>{category}</h4>
        </div>
    );
};