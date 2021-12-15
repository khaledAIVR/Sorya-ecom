import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { userRequest } from "../requestMethods";
import { Link } from "react-router-dom";
const Success = () => {
  const location = useLocation();
  //in Cart.jsx I sent data and cart. Please check that page for the changes.(in video it's only data)
  const data = location.state.stripeData;
  const cart = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orderId, setOrderId] = useState(null);

  const TOKEN = currentUser?.accessToken;

  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await userRequest.post(
          "/orders",
          {
            userId: currentUser._id,
            products: cart.products.map((item) => ({
              productId: item._id,
              quantity: item.quantity,
            })),
            amount: cart.total,
            address: data.billing_details.address,
          },
          { headers: { token: `Bearer ${TOKEN}` } }
        );
        setOrderId(res.data._id);
      } catch {}
    };
    data && createOrder();
  }, [cart, data, currentUser]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {orderId ? (
        <h2 style={{ color: "green" }}>
          {" "}
          {`Order has been created successfully. Your order number is ${orderId}`}
        </h2>
      ) : (
        <h2 style={{ color: "red" }}> {`Unsuccessful`}</h2>
      )}

      <Link style={{ textDecoration: "none" }} to="/">
        <button style={{ padding: 10, marginTop: 20 }}>Go to Homepage</button>
      </Link>
    </div>
  );
};

export default Success;
