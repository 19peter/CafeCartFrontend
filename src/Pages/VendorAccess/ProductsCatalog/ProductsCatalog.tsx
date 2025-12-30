import { useEffect, useState } from "react";
import styles from "./ProductCatalog.module.css";
import type { Product } from "../../../shared/types/product/ProductTypes";
import { getVendorProducts } from "../../../services/productService";
import { createProduct, getAllCategories, updateProduct } from "../../../services/productService";
import { uploadToS3 } from "../../../services/S3Service";

const EMPTY_FORM = {
  name: "",
  price: 0,
  image: "",
  description: "",
  categoryId: 0,
  isAvailable: false,
  isStockTracked: false,
  contentType: "",
};

const EMPTY_AUX_DATA = {
  id: 0,
  vendorShopId: 0,
  productId: 0,
  categoryName: "",
};

export const ProductsCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [auxData, setAuxData] = useState<typeof EMPTY_AUX_DATA>(EMPTY_AUX_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  /* ----------------------------- helpers ----------------------------- */

  const getCategoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name ?? "";

  const mapApiProduct = (data: any): Product => ({
    id: data.id,
    name: data.name,
    price: +data.price,
    quantity: +data.quantity,
    imageUrl: data.imageUrl,
    description: data.description,
    categoryId: +data.categoryId,
    isAvailable: data.available,
    isStockTracked: data.stockTracked,
    vendorShopId: data.vendorShopId,
    productId: data.id,
    categoryName: getCategoryName(data.categoryId),
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    console.log(file);
  };


  /* ----------------------------- effects ------------------------------ */

  useEffect(() => {
    const init = async () => {
      const [productsRes, categoriesRes] = await Promise.all([
        getVendorProducts(),
        getAllCategories(),
      ]);
      console.log(productsRes);
      setProducts(productsRes.data);
      setCategories(categoriesRes);
    };

    init();
  }, []);

  const filteredProducts = products?.filter((p) => {
    const q = search.toLowerCase();

    return (
      p.name.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q)
    );
  });

  /* ----------------------------- handlers ----------------------------- */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const saveProduct = async () => {
    if (!form.name || !form.price) return;

    try {
      const payload = {
        name: form.name,
        price: +form.price,
        imageUrl: selectedImage?.name || " ",
        description: form.description,
        categoryId: +form.categoryId,
        isAvailable: form.isAvailable,
        isStockTracked: form.isStockTracked,
        contentType: selectedImage?.type || null,
      };

      const res = editingId
        ? await updateProduct({ ...payload, id: auxData.productId })
        : await createProduct(payload);
      if (res.status !== 200) throw new Error(res.message);

      if (selectedImage) {
        const uploadUrl = res.data.uploadUrl;
        uploadToS3(uploadUrl, selectedImage);

        setUploading(false);
      }

      const mapped = mapApiProduct(res.data);

      setProducts((prev) =>
        editingId
          ? prev.map((p) => (p.id === editingId ? mapped : p))
          : [...prev, mapped]
      );

      resetForm();
    } catch (err) {
      console.error("Product save failed:", err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      description: product.description,
      categoryId: product.categoryId,
      isAvailable: product.isAvailable,
      isStockTracked: product.isStockTracked,
      contentType: ""
    });

    setAuxData({
      id: product.id,
      vendorShopId: product.vendorShopId,
      productId: product.id,
      categoryName: product.categoryName,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setAuxData(EMPTY_AUX_DATA);
  };


  return (

    <div className={styles.inventoryContainer}>

      <div className={styles.inventoryPage}>
        <h1 className={styles.inventoryTitle}>Inventory</h1>
        <div className={styles.inventoryToolbar}>
          <input
            type="text"
            placeholder="Search products or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        {/* PRODUCTS GRID */}

        {filteredProducts.length === 0 && (
          <div className={styles.emptyState}>
            <p>No products found</p>
            <span>Try adjusting your search</span>
          </div>
        )}

        <div className={styles.productsGrid}>
          {filteredProducts?.map((p: Product) => (

            <div key={p.id} className={styles.productCard}>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className={styles.productImage} />
              ) : (
                <div className={styles.imagePlaceholder}>No Image</div>
              )}

              <div className={styles.productBody}>
                <div className={styles.productHeader}>
                  <h3 className={styles.productName}>{p.name}</h3>
                  <span className={styles.productCategory}>{p.categoryName}</span>
                </div>

                <p className={styles.productDesc}>{p.description}</p>

                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>${p.price}</span>


                  <button className={styles.editBtn} onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.productFormContainer}>
        {/* ADD / EDIT FORM */}
        <div className={styles.productForm}>
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

          <div className={styles.formGrid}>
            <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <label htmlFor="price">Price</label>
            <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} />

            <label htmlFor="image">Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
            />

            {uploading && <p>Uploading image...</p>}

            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                style={{ width: 120, marginTop: 10, borderRadius: 6 }}
              />
            )}


            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isStockTracked"
                checked={form.isStockTracked}
                onChange={handleChange}
              />
              Track Stock
            </label>
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            style={{ width: "80%", resize: "none" }}
            onChange={handleChange}
          />

          <button className={styles.submitBtn} onClick={saveProduct}>
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}


