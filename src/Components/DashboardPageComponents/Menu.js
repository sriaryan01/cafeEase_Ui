import React, { useState, useEffect, useRef } from "react";
import "../../CSS/DashboardPage.css";
import { handleAddToCart } from "../../Services/cart_service";
import {
  getProduct3DModel,
  getProductGlb,
  getProductImage,
} from "../../Services/product_service";
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
  const [productImageUrl, setProductImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  // Interactive viewing options (3D, AR, etc.)
  const [modelUrl, setModelUrl] = useState(null);
  const [modelFormat, setModelFormat] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const [showARModal, setShowARModal] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [arError, setArError] = useState(null);

  // Alternative viewing options
  const [viewType, setViewType] = useState(null); // '3d' or null

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

  // Helper function to convert base64 string to data URL
  const convertBase64ToDataUrl = (base64String) => {
    if (!base64String || base64String === null) return null;

    // If it's already a data URL, return as is
    if (base64String.startsWith("data:image/")) {
      return base64String;
    }

    // Detect image type from base64 signature
    let mimeType = "image/png";
    if (base64String.startsWith("/9j/")) {
      mimeType = "image/jpeg";
    } else if (base64String.startsWith("R0lGODlh")) {
      mimeType = "image/gif";
    } else if (base64String.startsWith("iVBORw0KGgo")) {
      mimeType = "image/png";
    }

    return `data:${mimeType};base64,${base64String}`;
  };

  useEffect(() => {
    const productQuantity = cartItemsIdToQuantityMap.get(product.id);
    setQuantity(productQuantity !== undefined ? productQuantity : 1);
  }, [cartItemsIdToQuantityMap, product.id]);

  // Load product image for display
  useEffect(() => {
    const loadProductImage = () => {
      setLoadingImage(true);

      // Use image field directly from product response (base64 encoded)
      // The backend now always includes the 'image' field in the response
      if (product.image && product.image !== null) {
        const imageUrl = convertBase64ToDataUrl(product.image);
        if (imageUrl) {
          setProductImageUrl(imageUrl);
          setLoadingImage(false);
          return;
        }
      }

      // If image is null or empty, no image available
      // Don't make API call since image field is always in the response
      setProductImageUrl(null);
      setLoadingImage(false);
    };

    loadProductImage();
  }, [product.id, product.image]);

  // Fetch viewing options (3D model only)
  useEffect(() => {
    setLoadingModel(true);
    setArError(null);

    const loadViewingOptions = async () => {
      // Only try 3D models if hasImage3D is true
      if (product.hasImage3D) {
        const formats = ["glb", "gltf", "usdz", "obj"];
        for (const format of formats) {
          try {
            const result = await getProduct3DModel(product.id, format);
            setModelUrl(result.url);
            setModelFormat(result.format);
            setViewType("3d");
            setLoadingModel(false);
            return;
          } catch (err) {
            continue;
          }
        }
        // Try legacy GLB endpoint
        try {
          const url = await getProductGlb(product.id);
          setModelUrl(url);
          setModelFormat("glb");
          setViewType("3d");
          setLoadingModel(false);
          return;
        } catch (err) {
          console.log("3D model not available");
        }
      }

      // No 3D model available
      setViewType(null);
      setLoadingModel(false);
    };

    loadViewingOptions();
  }, [product]);

  const openViewer = () => {
    if (loadingModel) {
      toast.error("Content is still loading. Please wait...");
      return;
    }

    // Only open viewer if 3D model is available
    if (viewType === "3d") {
      setShowARModal(true);
    } else {
      toast.error("Interactive view not available");
    }
  };

  const handleARLaunch = () => {
    if (arModelViewerRef.current) {
      if (arModelViewerRef.current.canActivateAR) {
        // Launch native AR (Android/iOS)
        arModelViewerRef.current.activateAR();
      } else {
        toast.info(
          "AR is not supported on this device. Showing 3D view instead."
        );
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

      {/* Product Image - Display directly like categories */}
      <div
        style={{
          width: "100%",
          height: "250px",
          marginBottom: "12px",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {loadingImage ? (
          <CircularProgress size={30} />
        ) : productImageUrl ? (
          <img
            src={productImageUrl}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        ) : (
          <Box sx={{ color: "#999", fontSize: "0.9rem" }}>
            No image available
          </Box>
        )}
      </div>

      <h3 className="ProductName">{product.name}</h3>
      <p className="ProductDescription">{product.description}</p>
      <div className="ProductPrice">INR {product.price}</div>
      <div className="CategoryName">{product.categoryName}</div>

      {/* Interactive View Button - Only show if 3D model available */}
      <div style={{ marginBottom: "10px" }}>
        {loadingModel ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
            <CircularProgress size={20} />
            <span style={{ fontSize: "0.9rem", color: "#666" }}>
              Loading viewer...
            </span>
          </Box>
        ) : arError ? (
          <Box sx={{ p: 1 }}>
            <span style={{ fontSize: "0.9rem", color: "#d32f2f" }}>
              {arError}
            </span>
          </Box>
        ) : viewType === "3d" ? (
          <button
            className="card-tag subtle"
            onClick={openViewer}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <ViewInAr style={{ fontSize: "18px" }} />
            View in AR / 3D
          </button>
        ) : (
          <Box sx={{ p: 1, textAlign: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "#666" }}>
              Interactive view not available
            </span>
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

      {/* Viewer Modal - Supports 3D only */}
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
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {viewType === "3d" && <ThreeDRotation />}
            <span>{product.name} - AR / 3D View</span>
          </Box>
          <IconButton onClick={closeARModal} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* 3D Model Viewer */}
          {viewType === "3d" && modelUrl && (
            <model-viewer
              ref={arModelViewerRef}
              src={modelUrl}
              alt={product.name}
              ar
              ar-modes={
                modelFormat === "usdz"
                  ? "quick-look"
                  : "scene-viewer quick-look webxr"
              }
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeARModal} variant="outlined">
            Close
          </Button>
          {viewType === "3d" && modelUrl && (
            <Button
              onClick={handleARLaunch}
              variant="contained"
              startIcon={<ViewInAr />}
              sx={{
                backgroundColor: "#fe9e0d",
                "&:hover": { backgroundColor: "#e88d0c" },
              }}
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
