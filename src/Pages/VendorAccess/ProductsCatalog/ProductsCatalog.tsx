import { useEffect, useState } from "react";
import styles from "./ProductCatalog.module.css";
import {
  Package,
  Tag,
  DollarSign,
  Image as ImageIcon,
  CheckCircle,
  PlusCircle,
  PencilLine,
  Loader2,
  AlertTriangle,
  X
} from "lucide-react";
import type { Product } from "../../../shared/types/product/ProductTypes";
import { getVendorProducts } from "../../../services/productService";
import { createProduct, getAllCategories, updateProduct } from "../../../services/productService";
import { uploadToS3 } from "../../../services/S3Service";
import { useNotification } from "../../../contexts/NotificationContext";

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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();

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
      setUploading(true);
      setUploadError(null);
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

      const mapped = mapApiProduct(res.data);

      setProducts((prev) =>
        editingId
          ? prev.map((p) => (p.id === editingId ? mapped : p))
          : [...prev, mapped]
      );

      const uploadUrl = res.data.uploadUrl;
      const productName = form.name;
      const operation = editingId ? 'updated' : 'created';

      showSuccess(`Product "${productName}" ${operation} successfully!`);
      resetForm();

      if (selectedImage && uploadUrl) {
        try {
          await uploadToS3(uploadUrl, selectedImage);
          showSuccess(`Image for "${productName}" uploaded successfully!`);
        } catch (uploadErr) {
          const errMsg = `Product saved, but failed to upload image for "${productName}".`;
          showError(errMsg);
          setUploadError(errMsg);
        }
      }
    } catch (err: any) {
      console.error("Product save failed:", err);
      showError(err.message || "Failed to save product");
    } finally {
      setUploading(false);
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
        {uploadError && (
          <div className={styles.persistentError}>
            <div className={styles.errorContent}>
              <AlertTriangle size={20} />
              <span>{uploadError}</span>
            </div>
            <button onClick={() => setUploadError(null)} className={styles.closeError}>
              <X size={16} />
            </button>
          </div>
        )}
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
        <div className={styles.productForm}>
          <h2>
            {editingId ? <PencilLine size={24} /> : <PlusCircle size={24} />}
            {editingId ? "Edit Product" : "New Item"}
          </h2>

          <div className={styles.formSection}>
            {/* Name Input */}
            <div className={styles.inputGroup}>
              <label>Product Name</label>
              <div className={styles.inputWrapper}>
                <Package className={styles.inputIcon} size={18} />
                <input
                  name="name"
                  placeholder="e.g. Arabica Roast"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Category selection */}
            <div className={styles.inputGroup}>
              <label>Category</label>
              <div className={styles.inputWrapper}>
                <Tag className={styles.inputIcon} size={18} />
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
              </div>
            </div>

            {/* Price Input */}
            <div className={styles.inputGroup}>
              <label>Price (EGP)</label>
              <div className={styles.inputWrapper}>
                <DollarSign className={styles.inputIcon} size={18} />
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Image Upload Area */}
            <div className={styles.inputGroup}>
              <label>Product Image</label>
              <div className={styles.imageUploadArea}>
                {form.image || selectedImage ? (
                  <div className={styles.imagePreviewWrapper}>
                    <img
                      src={selectedImage ? URL.createObjectURL(selectedImage) : form.image}
                      alt="Preview"
                      className={styles.imagePreview}
                    />
                  </div>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <ImageIcon size={32} />
                    <span>Click to upload image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleImageSelect}
                />
              </div>
              {uploading && (
                <div className={styles.uploadingOverlay}>
                  <Loader2 className={styles.spinner} size={24} />
                  <span>Uploading item image...</span>
                </div>
              )}
            </div>

            {/* Stock Toggle */}
            <div className={styles.switchContainer}>
              <div className={styles.switchLabel}>
                <CheckCircle size={18} color={form.isStockTracked ? "var(--color-primary)" : "#94a3b8"} />
                <span>Track Stock</span>
              </div>
              <input
                type="checkbox"
                name="isStockTracked"
                checked={form.isStockTracked}
                onChange={handleChange}
                style={{ width: 'auto', padding: 0 }}
              />
            </div>

            {/* Description */}
            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Give your product a tempting description..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.submitBtn} onClick={saveProduct} disabled={uploading}>
                {uploading ? <Loader2 className={styles.spinner} size={18} /> : (editingId ? <PencilLine size={18} /> : <PlusCircle size={18} />)}
                {uploading ? "Processing..." : (editingId ? "Save Changes" : "Create Product")}
              </button>

              {editingId && (
                <button className={styles.cancelBtn} onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default ProductsCatalog;

