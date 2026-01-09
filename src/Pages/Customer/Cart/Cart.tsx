import { useEffect, useState, useRef } from 'react';
import { Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import './Cart.css';
import { addOneToCart, getCart, removeItemFromCart, removeOneFromCart } from '../../../services/cartService';
import type { OrderSummary, CartSummary, OrderType, PaymentMethod, OrderTypeBase, OrderTypeBaseDelivery, OrderTypeBaseInHouse, OrderTypeBasePickup } from '../../../shared/types/cart/CartTypes';
import { useNotification } from '../../../contexts/NotificationContext';
import { createOrder } from '../../../services/ordersService';
import { generateIdempotencyKey } from '../../../utils/utils';
import { CustomerInfoCard } from '../../../Components/CustomerInfoCard/CustomerInfoCard';
import { savePreferredAddress } from '../../../services/customerService';


interface CartItemProps {
  children: React.ReactNode;
}


const CartItem: React.FC<CartItemProps> = ({ children }) => (
  <div className="cart-item">
    {children}
  </div>
);


const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    deliveryLocation,
    orderType,
    paymentMethod,
    removeFromCartContext,
    addQuantityContext,
    removeQuantityContext,
    setOrderTypeContext,
    setPaymentMethodContext,
    clearCartContext,
    saveItemsToContext,
    setShopName,
    getPaymentMethodsContext
  } = useCart();

  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, _] = useState(false);

  const [orderSummary, setOrderSummary] = useState<OrderSummary>();
  const [cartSummary, setCartSummary] = useState<CartSummary>();
  const [orderTypeInfo, setOrderTypeInfo] = useState<OrderTypeBase>();
  const [deliveryAreaId, setDeliveryAreaId] = useState<number>(1);

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupHour, setPickupHour] = useState('');   // 1–12
  const [pickupMinute, setPickupMinute] = useState('00');
  const [pickupPeriod, setPickupPeriod] = useState<'AM' | 'PM'>('AM');

  const idempotencyKey = useRef(generateIdempotencyKey());
  const { showError, showSuccess } = useNotification();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const fetchCart = async () => {
    const res = await getCart({ orderType, paymentMethod, latitude: deliveryLocation.lat, longitude: deliveryLocation.lng, deliveryAreaId: deliveryAreaId });
    if (res.status !== 200) {
      showError(res.message);
      return;
    }
    if (orderType === 'DELIVERY') {
      let orderTypeInfo = res.data.orderSummary.orderTypeBase as OrderTypeBaseDelivery;
      setOrderTypeInfo(orderTypeInfo);
    } else if (orderType === 'PICKUP') {
      let orderTypeInfo = res.data.orderSummary.orderTypeBase as OrderTypeBasePickup;
      setOrderTypeInfo(orderTypeInfo);
    } else {
      let orderTypeInfo = res.data.orderSummary.orderTypeBase as OrderTypeBaseInHouse;
      setOrderTypeInfo(orderTypeInfo);
    }

    setCartSummary(res.data.cartSummary);
    setOrderSummary(res.data.orderSummary);
    saveItemsToContext(res.data.orderSummary?.items || []);
    setPaymentMethodContext(res.data.cartSummary?.allowedPaymentMethods[0]);
    setShopName(res.data.orderSummary?.shopName || '');

  };


  const currencyFormatter = new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
  });

  function formatCurrency(value: number) {
    if (value == null || Number.isNaN(value)) return currencyFormatter.format(0);
    return currencyFormatter.format(value);
  }


  const handleOrderTypeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrderType = event.target.value as OrderType;
    await setOrderTypeContext(newOrderType);
    setLocationError(null);
  };

  const handlePaymentMethodChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPaymentMethod = event.target.value as PaymentMethod;
    setPaymentMethodContext(newPaymentMethod);
    setLocationError(null);
  };

  const handleAddOneToCart = async (id: number, shopId: number, cartItemId: number) => {
    const res = await addOneToCart({ productId: id, shopId });
    if (res.status !== 200) {
      showError(res.message);
      return;
    }
    addQuantityContext(cartItemId);
    fetchCart();
  };

  const handleRemoveOneFromCart = async (id: number) => {
    const res = await removeOneFromCart({ cartItemId: id });
    if (res.status !== 200) {
      showError(res.message);
      return;
    }
    removeQuantityContext(id);
    fetchCart();
  };

  const handleRemoveItemFromCart = async (id: number) => {
    const res = await removeItemFromCart({ cartItemId: id });
    if (res.status !== 200) {
      showError(res.message);
      return;
    }
    removeFromCartContext(id);
    fetchCart();
  };

  const to24HourTime = () => {
    if (!pickupHour) return null;

    let hour = Number(pickupHour);

    if (pickupPeriod === 'PM' && hour !== 12) hour += 12;
    if (pickupPeriod === 'AM' && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, '0')}:${pickupMinute}`;
  };

  const handleCreateOrder = async () => {
    if (!deliveryAddress && orderType === 'DELIVERY') {
      showError('Please enter a delivery address');
      return;
    }

    if (!pickupHour && orderType === 'PICKUP') {
      showError('Please select a pickup time');
      return;
    }
    const res = await createOrder(
      {
        orderType,
        paymentMethod,
        latitude: deliveryLocation.lat,
        longitude: deliveryLocation.lng,
        address: deliveryAddress,
        pickupTime: to24HourTime() || '',
        deliveryAreaId,
        idempotencyKey: idempotencyKey.current,
      }
    );
    if (res.status !== 200) {
      showError(res.message);
      return;
    }
    clearCartContext();
    showSuccess('Order created successfully');
    navigate('/order-success');
  };

  const handleSavePreferredAddress = async (address: string) => {
    if (!address.trim()) return;

    let res = await savePreferredAddress(address);

    if (res.status !== 200) {
      showError(res.message);
      return;
    }

    showSuccess('Address saved successfully');
  };



  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }



  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    }

    fetchCart();
  }, [orderType, paymentMethod, deliveryAreaId]);


  return (

    <div className="checkout-layout">
      {/* LEFT */}
      {windowWidth > 900 && (
        <CustomerInfoCard
          orderType={orderType}
          setDeliveryAddress={setDeliveryAddress}
          onSaveAddress={handleSavePreferredAddress}
        />
      )}

      {/* RIGHT */}
      <div className="cart-wrapper">
        <div className="cart-container">
          {cartSummary && !cartSummary.online && <h3 className="cart-shop-closed">Shop Is Closed</h3>}
          <h1 className="cart-title">Your <span className="cart-shop-name">{orderSummary?.shopName}</span> Order</h1>

          {/* Order Type Selection */}
          {items.length > 0 && (
            <div className="form-group">
              <label htmlFor="order-type">Order Type</label>
              <select
                id="order-type"
                value={orderType}
                onChange={(e) => handleOrderTypeChange(e as any)}
                className="form-control"
              >
                <option value="IN_HOUSE">In House</option>
                <option value="PICKUP">Pickup</option>
                {cartSummary?.deliveryAvailable && <option value="DELIVERY">Delivery</option>}
              </select>
              {locationError && (
                <div className="error-message">
                  {locationError}
                </div>
              )}
            </div>
          )}

          {/* DELIVERY ADDRESS */}
          {items.length > 0 && orderType === 'DELIVERY' && (
            <div className="delivery-section" >

              {/* Delivery Area Selection */}
              {(orderTypeInfo as OrderTypeBaseDelivery).availableDeliveryAreas?.length > 0 && (
                <div className="form-group">
                  <label htmlFor="delivery-area">Delivery Area</label>
                  <select
                    id="delivery-area"
                    className="form-control"
                    value={deliveryAreaId}
                    onChange={(e) => setDeliveryAreaId(Number(e.target.value))}
                  >
                    <option value="">Select Delivery Area</option>
                    {(orderTypeInfo as OrderTypeBaseDelivery).availableDeliveryAreas?.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.area} - ${area.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}



            </div>
          )}


          {items.length > 0 && orderType === 'PICKUP' && (
            <div className="form-group" key={orderType} >
              <label>Pickup Time</label>

              <div className="pickup-time-row">
                {/* HOUR */}
                <select
                  className="form-control"
                  value={pickupHour}
                  onChange={(e) => setPickupHour(e.target.value)}
                >
                  <option value="">HH</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                {/* MINUTE */}
                <select
                  className="form-control"
                  value={pickupMinute}
                  onChange={(e) => setPickupMinute(e.target.value)}
                >
                  {['00', '15', '30', '45'].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* AM / PM */}
                <select
                  className="form-control"
                  value={pickupPeriod}
                  onChange={(e) => setPickupPeriod(e.target.value as 'AM' | 'PM')}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="cart-items">
            {items.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              items.map((item) => (

                <CartItem key={item.id}>
                  <div className="item-details">
                    <h3 className="item-name">{item.productName}</h3>
                    <p className="item-price">${item.unitPrice.toFixed(2)} each</p>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => handleRemoveOneFromCart(item.id)}
                      className="quantity-btn"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleAddOneToCart(
                        item.productId,
                        cartSummary!.shopId,
                        item.id)}

                      className="quantity-btn"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <span className="item-total">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => handleRemoveItemFromCart(item.id)}
                      className="remove-btn"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>
                </CartItem>
              ))
            )}
          </div>

          {items.length > 0 && (
            <>
              {/* Payment Method */}
              <div className="form-group">
                <label htmlFor="payment-method">Payment Method</label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePaymentMethodChange(e)}
                  className="form-control"
                >
                  {cartSummary?.allowedPaymentMethods.includes('CASH') && <option value="CASH">Cash on Delivery</option>}
                  {cartSummary?.allowedPaymentMethods.includes('INSTAPAY') && <option value="INSTAPAY">Instapay</option>}
                  {cartSummary?.allowedPaymentMethods.includes('CREDIT_CARD') && <option value="CREDIT_CARD">Online Payment</option>}
                </select>

                {getPaymentMethodsContext() === "INSTAPAY" &&
                  <p className="payment-help-text">The Shop will send you a payment link to complete the payment</p>
                }

                {cartSummary?.phoneNumber && (
                  <div className="shop-contact-info">
                    <span className="contact-label">Need help? Call the shop:</span>
                    <a href={`tel:${cartSummary.phoneNumber}`} className="phone-link">
                      <Phone size={16} />
                      {cartSummary.phoneNumber}
                    </a>
                  </div>
                )}

              </div>

              {windowWidth <= 900 && (
                <CustomerInfoCard
                  orderType={orderType}
                  setDeliveryAddress={setDeliveryAddress}
                  onSaveAddress={handleSavePreferredAddress}
                />
              )}

              {/* Order Summary */}
              <div className="order-summary">
                <h2 className="summary-title">Order Summary</h2>

                {orderSummary ? (
                  <>

                    <div className="summary-row">
                      <span>Subtotal <span style={{ color: 'gray', fontSize: '10px' }}>Incl VAT</span> </span>
                      <span>{formatCurrency(orderSummary.subTotal)}</span>
                    </div>

                    {orderTypeInfo?.orderType === 'DELIVERY' && (
                      <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>{formatCurrency((orderTypeInfo as OrderTypeBaseDelivery).price)}</span>
                      </div>
                    )}

                    {orderSummary.transactionFee != null && orderSummary.transactionFee != 0 && (
                      <div className="summary-row">
                        <span>Transaction Fee</span>
                        <span>{formatCurrency(orderSummary.transactionFee)}</span>
                      </div>
                    )}

                    <div className="divider" />
                    <div className="summary-total">
                      <span>Total</span>
                      <span>{formatCurrency(orderSummary.total)}</span>
                    </div>

                    <button
                      className={`submit-btn 
                    ${isLoading || items.length === 0 ? 'disabled' : ''}
                    ${!cartSummary?.online ? 'offline' : ''}`}
                      onClick={() => handleCreateOrder()}
                      disabled={!cartSummary?.online || isLoading || items.length === 0}
                      title={!cartSummary?.online ? 'Shop Is Closed' : ''}
                    >
                      {isLoading
                        ? 'Processing...'
                        : paymentMethod === 'CREDIT_CARD'
                          ? 'Proceed to Payment'
                          : 'Place Order'}
                    </button>

                  </>
                ) : (
                  <p className="empty-summary">No items in cart</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>

  );
};

export default Cart;
