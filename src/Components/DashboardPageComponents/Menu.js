import React, { useState, useEffect, useRef } from "react";
import "../../CSS/DashboardPage.css";
import { handleAddToCart } from "../../Services/cart_service";
import { getProductGlb } from "../../Services/product_service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@google/model-viewer";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { Close, ViewInAr, ThreeDRotation } from "@mui/icons-material";

const Menu = ({ product, cartItemsIdToQuantityMap }) => {
  const [quantity, setQuantity] = useState(1);
  const [glbUrl, setGlbUrl] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const [showARModal, setShowARModal] = useState(false);
  const [loadingGLB, setLoadingGLB] = useState(false);
  const [arError, setArError] = useState(null);
  const modelViewerRef = useRef(null);
  const arModelViewerRef = useRef(null);

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
      setLoadingGLB(true);
      setArError(null);
      getProductGlb(product.id)
        .then((url) => {
          setGlbUrl(url);
          setLoadingGLB(false);
        })
        .catch((err) => {
          console.error("Error loading GLB:", err);
          setArError("Failed to load 3D model");
          setLoadingGLB(false);
          toast.error("Failed to load AR model");
        });
    }
  }, [product]);

  const openAR = () => {
    if (!glbUrl) {
      toast.error("3D model is still loading. Please wait...");
      return;
    }
    setShowARModal(true);
  };

  const handleARLaunch = () => {
    if (arModelViewerRef.current) {
      if (arModelViewerRef.current.canActivateAR) {
        // Launch native AR (Android/iOS)
        arModelViewerRef.current.activateAR();
      } else {
        toast.info("AR is not supported on this device. Showing 3D view instead.");
      }
    }
  };

  const closeARModal = () => {
    setShowARModal(false);
    setShow3D(false);
  };

  return (
    <div className="Card">
      <ToastContainer />
      <h3 className="ProductName">{product.name}</h3>
      <p className="ProductDescription">{product.description}</p>
      <div className="ProductPrice">INR {product.price}</div>
      <div className="CategoryName">{product.categoryName}</div>

      {/* AR / 3D Section */}
      <div style={{ marginBottom: "10px" }}>
        {product.hasImage3D ? (
          <>
            {loadingGLB ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
                <CircularProgress size={20} />
                <span style={{ fontSize: "0.9rem", color: "#666" }}>Loading 3D model...</span>
              </Box>
            ) : arError ? (
              <Box sx={{ p: 1 }}>
                <span style={{ fontSize: "0.9rem", color: "#d32f2f" }}>{arError}</span>
              </Box>
            ) : glbUrl ? (
              <button 
                className="card-tag subtle" 
                onClick={openAR}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  width: "100%",
                  justifyContent: "center"
                }}
              >
                <ViewInAr style={{ fontSize: "18px" }} />
                View in AR / 3D
              </button>
            ) : null}
          </>
        ) : (
          <Box 
            sx={{ 
              p: 1, 
              textAlign: "center",
              fontSize: "0.9rem", 
              color: "#999",
              fontStyle: "italic"
            }}
          >
            AR view not available
          </Box>
        )}
      </div>

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

      {/* AR/3D Modal */}
      <Dialog
        open={showARModal}
        onClose={closeARModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            height: "90vh",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ThreeDRotation />
            <span>{product.name} - AR / 3D View</span>
          </Box>
          <IconButton onClick={closeARModal} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, position: "relative", height: "100%" }}>
          {glbUrl && (
            <>
              {/* AR-enabled model-viewer */}
              <model-viewer
                ref={arModelViewerRef}
                src={glbUrl}
                alt={product.name}
                ar
                ar-modes="scene-viewer quick-look webxr"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="1"
                environment-image="neutral"
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "500px",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {/* AR Button Slot */}
                <button
                  slot="ar-button"
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "12px 24px",
                    backgroundColor: "#fe9e0d",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    zIndex: 10,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                  }}
                  onClick={handleARLaunch}
                >
                  <ViewInAr />
                  View in AR
                </button>
              </model-viewer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeARModal} variant="outlined">
            Close
          </Button>
          {glbUrl && (
            <Button
              onClick={handleARLaunch}
              variant="contained"
              startIcon={<ViewInAr />}
              sx={{ backgroundColor: "#fe9e0d", "&:hover": { backgroundColor: "#e88d0c" } }}
            >
              Launch AR
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Menu;
