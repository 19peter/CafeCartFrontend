import { useState, useEffect } from 'react';
import { adminService, type Vendor } from '../../../../services/adminService';
import styles from '../AdminDashboard.module.css';
import { UserPlus, Mail, Phone, Calendar as CalendarIcon, Users, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadToS3 } from '../../../../services/S3Service';

export const VendorManagement = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVendor, setNewVendor] = useState({ name: '', email: '', phoneNumber: '', vaaPassword: '', vaaEmail: '' });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const data = await adminService.getVendors();
            setVendors(data);
        } catch (error) {
            console.error('Error loading vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedImage(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUploading(true);
            const payload = {
                ...newVendor,
                imageUrl: selectedImage?.name || '',
                contentType: selectedImage?.type || null,
            };

            const data = await adminService.addVendor(payload);

            if (selectedImage && data.uploadUrl) {
                await uploadToS3(data.uploadUrl, selectedImage);
            }

            setNewVendor({ name: '', email: '', phoneNumber: '', vaaPassword: '', vaaEmail: '' });
            setSelectedImage(null);
            setShowAddForm(false);
            loadVendors();
        } catch (error) {
            console.error('Error adding vendor:', error);
            alert('Failed to add vendor. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.managementSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.headerInfo}>
                    <Users className={styles.headerIcon} />
                    <div>
                        <h2>Vendor Management</h2>
                        <p>Manage and onboard coffee vendors</p>
                    </div>
                </div>
                <button
                    className={styles.addBtn}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    <UserPlus size={18} />
                    {showAddForm ? 'Cancel' : 'Add Vendor'}
                </button>
            </div>

            {showAddForm && (
                <form className={styles.addForm} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <input
                            type="text"
                            placeholder="Vendor Name"
                            value={newVendor.name}
                            onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={newVendor.email}
                            onChange={e => setNewVendor({ ...newVendor, email: e.target.value })}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={newVendor.phoneNumber}
                            onChange={e => setNewVendor({ ...newVendor, phoneNumber: e.target.value })}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={newVendor.vaaPassword}
                            onChange={e => setNewVendor({ ...newVendor, vaaPassword: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Vendor Access Email Address"
                            value={newVendor.vaaEmail}
                            onChange={e => setNewVendor({ ...newVendor, vaaEmail: e.target.value })}
                            required
                        />

                        <div className={styles.imageUploadArea}>
                            {selectedImage ? (
                                <div className={styles.imagePreviewWrapper}>
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Preview"
                                        className={styles.imagePreview}
                                    />
                                </div>
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <ImageIcon size={32} />
                                    <span>Click to upload vendor logo</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.fileInput}
                                onChange={handleImageSelect}
                            />
                        </div>
                        {uploading && <p className={styles.uploadingText}>Onboarding vendor and uploading image...</p>}
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={uploading}>
                        {uploading ? <Loader2 className={styles.spinner} size={18} /> : null}
                        {uploading ? 'Processing...' : 'Onboard Vendor'}
                    </button>
                </form>
            )}

            {loading ? (
                <p>Loading vendors...</p>
            ) : (
                <div className={styles.dataTableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Vendor</th>
                                <th>Contact Info</th>
                                <th>Status</th>
                                <th>Total Shops</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map(vendor => (
                                <tr key={vendor.id}>
                                    <td>
                                        <div className={styles.vendorNameWithImage}>
                                            {vendor.imageUrl ? (
                                                <img src={vendor.imageUrl} alt={vendor.name} className={styles.vendorTableImage} />
                                            ) : (
                                                <div className={styles.vendorTableImage} style={{ background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ImageIcon size={20} color="#94a3b8" />
                                                </div>
                                            )}
                                            <div className={styles.vendorNameColumn}>
                                                <strong>{vendor.name}</strong>
                                                <span>ID: #{vendor.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.contactInfo}>
                                            <span><Mail size={14} /> {vendor.email}</span>
                                            <span><Phone size={14} /> {vendor.phoneNumber}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={vendor.isActive ? styles.statusActive : styles.statusInactive}>
                                            {vendor.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>{vendor.totalShops} Shops</td>
                                    <td>
                                        <div className={styles.dateCell}>
                                            <CalendarIcon size={14} /> {new Date(vendor.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
