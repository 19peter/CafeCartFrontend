import { CategoryDiv } from "./CategoryDiv";
import styles from "./CategoryStyles.module.css";
import { useState } from "react";

interface CategoryDisplayProps {
    categories: { id: number; name: string }[];
    handleCategoryChange: (category: string) => void;
}

export const CategoriesDisplay = ({ categories, handleCategoryChange }: CategoryDisplayProps) => {
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    
    return (
        <div className={styles.categoriesDisplay}>
            {categories.map((category, index) => (
                <CategoryDiv
                    selectedCategory={selectedCategory}
                    index={index}
                    key={category.id}
                    category={category.name}
                    handleCategoryChange={(category) => {
                        setSelectedCategory(index);
                        handleCategoryChange(category);
                    }} />
            ))}
        </div>
    );
};