import { useEffect, useState } from "react";
import type { OrderType } from "../../shared/types/cart/CartTypes";
import styles from './CustomerInfoCard.module.css';
import { useNotification } from "../../contexts/NotificationContext";
import { updateCustomerPhone } from "../../services/customerService";
import { getCustomerInfo } from "../../services/customerService";

type CustomerInfoCardProps = {
    orderType: OrderType;
    setDeliveryAddress: (v: string) => void;
    onSaveAddress: (address: string) => void;
};
export const CustomerInfoCard = ({
    orderType,
    setDeliveryAddress,
    onSaveAddress
}: CustomerInfoCardProps) => {
   
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: ''
    });
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneDraft, setPhoneDraft] = useState('');
    const [isSavingPhone, setIsSavingPhone] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressDraft, setAddressDraft] = useState('');
    const [isSavingAddress, _] = useState(false);
 
    const { showError, showSuccess } = useNotification();

    const handleUpdatePhone = async () => {
        setIsSavingPhone(true);
        const res = await updateCustomerPhone({ phone: phoneDraft });
        if (res.status !== 200) {
            showError(res.message);
            setIsSavingPhone(false);
            return;
        }
        
        // Update local state with new phone number
        setUserInfo(prev => ({ ...prev, phoneNumber: phoneDraft }));
        setIsEditingPhone(false);
        setIsSavingPhone(false);
        showSuccess('Phone number updated successfully');
    };

    const fetchUserInfo = async () => {
        const res = await getCustomerInfo();
        if (res.status !== 200) {
            showError(res.message);
            return;
        }
        setUserInfo(res.data);
        setPhoneDraft(res.data.phoneNumber);
        setAddressDraft(res.data.address || '');
        setDeliveryAddress(res.data.address);
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    // Sync drafts when userInfo changes
    useEffect(() => {
        setPhoneDraft(userInfo.phoneNumber);
        setAddressDraft(userInfo.address || '');
    }, [userInfo]);

    return (
        <div className={styles.customerCard}>
            <h3>Your Details</h3>

            <div className={styles.infoRow}>
                <label>First Name</label>
                <input value={userInfo.firstName} disabled />
            </div>

            <div className={styles.infoRow}>
                <label>Last Name</label>
                <input value={userInfo.lastName} disabled />
            </div>

            <div className={styles.infoRow}>
                <label>Phone Number</label>

                {!isEditingPhone ? (
                    <div className={styles.inlineRow}>
                        <input value={userInfo.phoneNumber} disabled />
                        <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={() => setIsEditingPhone(true)}
                        >
                            Edit
                        </button>
                    </div>
                ) : (
                    <div className={styles.inlineRow}>
                        <input
                            value={phoneDraft}
                            onChange={(e) => setPhoneDraft(e.target.value)}
                        />

                        <button
                            className={styles.secondaryBtn}
                            disabled={isSavingPhone}
                            onClick={handleUpdatePhone}
                        >
                            Save
                        </button>

                        <button
                            className={styles.linkBtn}
                            onClick={() => {
                                setPhoneDraft(userInfo.phoneNumber);
                                setIsEditingPhone(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Friendly confirmation note */}
            <p className={styles.infoNote}>
                📞 The shop may call you to confirm your order.
            </p>

            {/* DELIVERY ONLY */}
            {orderType === 'DELIVERY' && (
                <div className={styles.infoRow}>
                    <label>Delivery Address</label>

                    {!isEditingAddress ? (
                        <div className={styles.inlineRow}>
                            <textarea
                                rows={3}
                                value={userInfo.address || 'No address saved'}
                                disabled
                                style={{ resize: 'none' }}
                            />

                            <button
                                type="button"
                                className={styles.linkBtn}
                                onClick={() => setIsEditingAddress(true)}
                            >
                                Edit
                            </button>
                        </div>
                    ) : (
                        <div className={styles.inlineRow}>
                            <textarea
                                rows={3}
                                value={addressDraft}
                                onChange={(e) => setAddressDraft(e.target.value)}
                                style={{ resize: 'none' }}
                            />

                            <button
                                className={styles.secondaryBtn}
                                disabled={isSavingAddress || !addressDraft?.trim()}
                                onClick={() => {
                                    setUserInfo(prev => ({ ...prev, address: addressDraft }));
                                    setDeliveryAddress(addressDraft);
                                    onSaveAddress(addressDraft);
                                    setIsEditingAddress(false);
                                }}
                            >
                                Save
                            </button>

                            <button
                                className={styles.linkBtn}
                                onClick={() => {
                                    setAddressDraft(userInfo.address || '');
                                    setIsEditingAddress(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};