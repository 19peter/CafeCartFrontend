import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import './OrderSuccess.css';

export const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="successCard">
                <div className="iconWrapper">
                    <CheckCircle size={48} />
                </div>

                <h1 className="title">Order Placed Successfully!</h1>

                <p className="description">
                    Thank you for choosing CafeCart. Your order has been sent to the shop and is being processed.
                </p>

                <div className="infoBox">
                    <p className="infoText">
                        The shop may contact you via phone to confirm your order details or delivery time.
                    </p>
                </div>

                <div className="buttonGroup">
                    <button
                        className="primaryBtn"
                        onClick={() => navigate('/orders')}
                    >
                        View My Orders <ShoppingBag size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                    </button>

                    <button
                        className="secondaryBtn"
                        onClick={() => navigate('/')}
                    >
                        Back to Home <Home size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
