import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { OrderItem, OrderType, PaymentMethod } from '../shared/types/cart/CartTypes';
import { getShopName } from '../services/cartService';


interface CartContextType {
  items: OrderItem[];
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  deliveryLocation: { lat: number; lng: number };
  addToCartContext: (item: Omit<OrderItem, 'quantity'>) => void;
  removeFromCartContext: (itemId: number) => void;
  addQuantityContext: (itemId: number) => void;
  removeQuantityContext: (itemId: number) => void;
  setOrderTypeContext: (type: OrderType) => Promise<void>;
  setPaymentMethodContext: (method: PaymentMethod) => void;
  clearCartContext: () => void;
  getCartTotalContext: () => number;
  getDeliveryFeeContext: () => number;
  saveItemsToContext: (items: OrderItem[]) => void;
  shopName: string;
  setShopName: (name: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE = 5; // Example delivery fee

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [orderType, setOrderTypeState] = useState<OrderType>('PICKUP');
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod>('CASH');
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [shopName, setShopName] = useState<string>('');
  // We don't need isAuthenticated here as we'll handle auth in the Cart component

  // Load cart from database on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Implement your logic to fetch cart from database here
      getShopName().then(res => {
        if (res.status === 200) {
          setShopName(res.data.shop);
        } else {
          setShopName('Empty Cart');
        }
      });
    }
  }, []);

  // Save cart to database when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // getShopName().then(res => {
      //   if (res.status === 200) {
      //     setShopName(res.data.shop);
      //   } else {
      //     setShopName('Empty Cart');
      //   }
      // });
    }
  }, [items]);

  const saveItemsToContext = (items: OrderItem[]) => {
    setItems(items);
  };

  const addToCartContext = (item: Omit<OrderItem, 'quantity'>) => {
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

  const removeFromCartContext = (itemId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const addQuantityContext = (itemId: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === Number(itemId) ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const removeQuantityContext = (itemId: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === Number(itemId) ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const setOrderTypeContext = async (type: OrderType) => {
  
    setOrderTypeState(type);
  };

  const setPaymentMethodContext = (method: PaymentMethod) => {
    setPaymentMethodState(method);
  };

  const clearCartContext = () => {
    setItems([]);
  };

  const getCartTotalContext = () => {
    return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  };

  const getDeliveryFeeContext = () => {
    return orderType === 'DELIVERY' ? DELIVERY_FEE : 0;
  };

  const getCurrentPositionContext = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
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
        addToCartContext,
        removeFromCartContext,
        addQuantityContext,
        removeQuantityContext,
        setOrderTypeContext,
        setPaymentMethodContext,
        clearCartContext,
        getCartTotalContext,
        getDeliveryFeeContext,
        saveItemsToContext,
        shopName,
        setShopName,
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
