import { useEffect, useState } from "react";
import styles from "./InventoryStyles.module.css";
import type { Product } from "../../../shared/types/product/ProductTypes";
import { getShopProducts, publishProduct, unpublishProduct } from "../../../services/shopProductService";
import { updateInventory } from "../../../services/inventoryService";
import { useNotification } from "../../../contexts/NotificationContext";


export const InventoryPage = () => {
  const { showError, showSuccess } = useNotification();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  /* ----------------------------- effects ------------------------------ */

  useEffect(() => {
    const init = async () => {
      const productsRes = await getShopProducts();
      setProducts(productsRes.data);
    };

    init();
  }, []);

  /* ----------------------------- handlers ----------------------------- */

  const filteredProducts = products?.filter((p) => {
    const q = search.toLowerCase();

    return (
      p.name.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q)
    );
  });

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditQuantity(product.quantity);
  };

  const resetForm = () => {
    setEditingProductId(null);
    setEditQuantity(0);
  };

  const saveInventory = async (vendorShopId: number, productId: number) => {
    if (!editingProductId) return;

    try {
      const res = await updateInventory({ vendorShopId, productId, quantity: editQuantity });
      if (res.status !== 200) throw new Error(res.message);

      const isUpdated = res.data;
      if (isUpdated) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProductId ? { ...p, quantity: editQuantity } : p))
        );
      }
      showSuccess("Inventory updated successfully");
      resetForm();
    } catch (err) {
      console.error("Inventory update failed:", err);
      showError("Failed to update inventory");
    }
  };

  const handlePublish = async (product: Product) => {
    try {
      const res = await publishProduct({ productId: product.productId });
      if (res.status !== 200) throw new Error(res.message);

      const isPublished = res;
      if (isPublished) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isAvailable: true } : p))
        );
      }
      showSuccess("Product published successfully");

    } catch (err) {
      console.error("Inventory update failed:", err);
      showError("Failed to publish product");
    }
  };

  const handleUnpublish = async (product: Product) => {
    try {
      const res = await unpublishProduct({ productId: product.productId });
      if (res.status !== 200) throw new Error(res.message);

      const isPublished = res;
      if (isPublished) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isAvailable: false } : p))
        );
      }
      showSuccess("Product unpublished successfully");

    } catch (err) {
      console.error("Inventory update failed:", err);
      showError("Failed to unpublish product");
    }
  };

  return (
    <div className={styles.inventoryContainer}>

      <div className={`${styles.inventoryPage} ${styles.inventoryPageFullDisplay}`}>
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

        <div className={styles.inventoryLayout}>
          {/* PRODUCTS GRID */}
          <div className={styles.productsGrid}>
            {filteredProducts?.map((p) => (
              <div key={p.id} className={styles.productCard}>
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className={styles.productImage}
                />

                <div className={styles.productBody}>
                  <div className={styles.productHeader}>
                    <h3>
                      {p.name}
                      <span className={styles.productDesc}>
                        {" "}
                        - {p.categoryName}
                      </span>
                    </h3>
                  </div>

                  <p className={styles.productQty}>
                    {p.isAvailable ? "Published" : "Not Published"}

                    {p.isStockTracked && (
                      <>
                        {" - "}Qty:
                        {editingProductId === p.id ? (
                          <span className={styles.inlineQtyEditor}>
                            <input
                              type="number"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(+e.target.value)}
                              className={styles.inlineInput}
                            />

                            <button
                              className={styles.inlineCancel}
                              onClick={resetForm}
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <span className={styles.qtyValue}>{p.quantity}</span>
                        )}
                      </>
                    )}
                  </p>


                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>
                      ${p.price}
                    </span>

                    <div>
                      {p.isAvailable && (
                        <button
                          className={styles.unpublishBtn}
                          onClick={() => handleUnpublish(p)}
                        >
                          Unpublish
                        </button>
                      )}

                      {!p.isAvailable && (
                        <button
                          className={styles.publishBtn}
                          onClick={() => handlePublish(p)}
                        >
                          Publish
                        </button>
                      )}

                      {p.isStockTracked && editingProductId !== p.id && (
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(p)}
                        >
                          Edit Stock
                        </button>
                      )}

                      {p.isStockTracked && editingProductId === p.id && (
                        <button
                          className={styles.editBtn}
                          onClick={() => saveInventory(p.vendorShopId, p.productId)}
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>

      {/*  */}

    </div>
  );
}


