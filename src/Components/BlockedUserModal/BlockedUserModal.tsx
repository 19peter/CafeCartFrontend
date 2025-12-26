import React from "react";
import ReactDOM from "react-dom";
import styles from "./BlockedUserModal.module.css";
import type { BasicCustomerInfo } from "../../shared/types/customer/CustomerTypes";


interface Props {
  open: boolean;
  onClose: () => void;
  blockedCustomers: BasicCustomerInfo[];
  onUnblock: (customerId: number) => void;
}

const BlockedCustomersModal: React.FC<Props> = ({
  open,
  onClose,
  blockedCustomers,
  onUnblock,
}) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2>Blocked Customers</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </header>

        <div className={styles.content}>
          {blockedCustomers.length === 0 ? (
            <p className={styles.empty}>No blocked customers 🎉</p>
          ) : (
            blockedCustomers.map((customer) => (
              <div key={customer.id} className={styles.customerRow}>
                <div>
                  <strong>{customer.firstName + " " + customer.lastName}</strong>
                  {customer.phone && (
                    <span className={styles.email}>{customer.phone}</span>
                  )}
                </div>

                <button
                  className={styles.unblockBtn}
                  onClick={() => onUnblock(customer.id)}
                >
                  Unblock
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BlockedCustomersModal;
