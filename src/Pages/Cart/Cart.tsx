import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import './Cart.css';

type OrderType = 'in-house' | 'take-away' | 'delivery';
type PaymentMethod = 'cash' | 'online';

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
    orderType,
    paymentMethod,
    removeFromCart,
    updateQuantity,
    setOrderType,
    setPaymentMethod,
    getCartTotal,
    getDeliveryFee,
  } = useCart();

  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [isAuthenticated, navigate]);

  const handleOrderTypeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrderType = event.target.value as OrderType;
    try {
      await setOrderType(newOrderType);
      setLocationError(null);
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'Failed to set location');
    }
  };

  const handleQuantityChange = (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeFromCart(id);
    }
  };

  const handleSubmitOrder = () => {
    setIsLoading(true);
    // Here you would typically send the order to your backend
    console.log('Submitting order', {
      items,
      orderType,
      paymentMethod,
      subtotal: getCartTotal(),
      deliveryFee: getDeliveryFee(),
      total: getCartTotal() + getDeliveryFee(),
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to order confirmation or payment page
      if (paymentMethod === 'online') {
        // Redirect to payment gateway
        console.log('Redirecting to payment gateway...');
      } else {
        // Show order confirmation
        console.log('Order placed successfully!');
        // Clear cart and navigate to order confirmation
        // clearCart();
        // navigate('/order-confirmation');
      }
    }, 1000);
  };

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  const subtotal = getCartTotal();
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Order</h1>

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
            <option value="in-house">In House</option>
            <option value="take-away">Take Away</option>
            <option value="delivery">Delivery</option>
          </select>
          {locationError && (
            <div className="error-message">
              {locationError}
            </div>
          )}
        </div>
      )}

      {/* Cart Items */}
      <div className="cart-items">
        {items.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          items.map((item) => (
            <>
            
            <CartItem key={item.id}>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">${item.price.toFixed(2)} each</p>
              </div>
              <div className="item-actions">
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                  className="quantity-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                  className="quantity-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            </CartItem>
            </>
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="form-control"
            >
              <option value="cash">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button
              className={`submit-btn ${isLoading || items.length === 0 ? 'disabled' : ''}`}
              onClick={handleSubmitOrder}
              disabled={isLoading || items.length === 0}
            >
              {isLoading 
                ? 'Processing...' 
                : paymentMethod === 'online' 
                  ? 'Proceed to Payment' 
                  : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
