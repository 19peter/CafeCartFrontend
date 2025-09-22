import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type OrderType = 'in-house' | 'take-away' | 'delivery';
type PaymentMethod = 'cash' | 'online';

interface CartContextType {
  items: CartItem[];
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  deliveryLocation: { lat: number; lng: number } | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setOrderType: (type: OrderType) => Promise<void>;
  setPaymentMethod: (method: PaymentMethod) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getDeliveryFee: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE = 5; // Example delivery fee

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderTypeState] = useState<OrderType>('take-away');
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod>('cash');
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number; lng: number } | null>(null);
  // We don't need isAuthenticated here as we'll handle auth in the Cart component

  // Load cart from database on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Implement your logic to fetch cart from database here
    }
  }, []);

  // Save cart to database when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Implement your logic to save cart to database here
    }
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const setOrderType = async (type: OrderType) => {
    if (type === 'delivery' && !deliveryLocation) {
      try {
        const position = await getCurrentPosition();
        setDeliveryLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        throw new Error('Could not get your location. Please enable location services or choose another order type.');
      }
    }
    setOrderTypeState(type);
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethodState(method);
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    return orderType === 'delivery' ? DELIVERY_FEE : 0;
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        paymentMethod,
        deliveryLocation,
        addToCart,
        removeFromCart,
        updateQuantity,
        setOrderType,
        setPaymentMethod,
        clearCart,
        getCartTotal,
        getDeliveryFee,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
