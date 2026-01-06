import React, { useState, useEffect, useRef } from "react";
import "../../CSS/DashboardPage.css";
import { handleAddToCart } from "../../Services/cart_service";
import { getProductGlb } from "../../Services/product_service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@google/model-viewer";

const Menu = ({ product, cartItemsIdToQuantityMap }) => {
  const [quantity, setQuantity] = useState(1);
  const [glbUrl, setGlbUrl] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const modelViewerRef = useRef(null);

  const addToast = () => {
    toast.success("Item added to cart.....", {
      position: "bottom-left",
      autoClose: 800,
      closeOnClick: true,
      theme: "dark",
    });
  };

  useEffect(() => {
    const productQuantity = cartItemsIdToQuantityMap.get(product.id);
    setQuantity(productQuantity !== undefined ? productQuantity : 1);
  }, [cartItemsIdToQuantityMap, product.id]);

  // Fetch GLB file if product has 3D model
  useEffect(() => {
    if (product.hasImage3D) {
      getProductGlb(product.id)
        .then((url) => setGlbUrl(url))
        .catch((err) => console.error("Error loading GLB:", err));
    }
  }, [product]);

  const openARor3D = () => {
    if (modelViewerRef.current && modelViewerRef.current.canActivateAR) {
      // ✅ Launch native AR (Android/iOS)
      modelViewerRef.current.activateAR();
    } else {
      // ❌ No AR support → show 3D viewer inside card
      setShow3D(true);
    }
  };

  return (
    <div className="Card">
      <ToastContainer />
      <h3 className="ProductName">{product.name}</h3>
      <p className="ProductDescription">{product.description}</p>
      <div className="ProductPrice">INR {product.price}</div>
      <div className="CategoryName">{product.categoryName}</div>

      {/* ✅ AR / 3D Section */}
      {product.hasImage3D && glbUrl && (
        <>
          {/* Hidden model-viewer for AR check/launch */}
          <model-viewer
            ref={modelViewerRef}
            src={glbUrl}
            alt={product.name}
            ar
            ar-modes="scene-viewer quick-look webxr"
            style={{ display: "none" }}
          ></model-viewer>

          <button className="card-tag subtle" onClick={openARor3D}>
            {show3D ? "View in 3D" : "Open in AR View"}
          </button>

          {/* Show 3D viewer inline only if AR not supported and button clicked */}
          {show3D && (
            <model-viewer
              src={glbUrl}
              alt={product.name}
              camera-controls
              auto-rotate
              shadow-intensity="1"
              style={{ width: "100%", height: "300px", marginTop: "10px" }}
            ></model-viewer>
          )}
        </>
      )}

      <div className="addCartOptions">
        <input
          type="number"
          id="quantity"
          className="ProductQuantity"
          name="quantity"
          placeholder="Quantity"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button
          className="card-tag subtle"
          onClick={() => {
            handleAddToCart(product.id, quantity);
            addToast();
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Menu;
