import React, { useState, useEffect, useRef } from "react";
import "../../CSS/DashboardPage.css";
import { handleAddToCart } from "../../Services/cart_service";
import { 
  getProduct3DModel, 
  getProductGlb,
  getProduct360Image,
  getProductImages,
  getProductVideo,
  getProductImage
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
import { 
  Close, 
  ViewInAr, 
  ThreeDRotation,
  Panorama,
  Image as ImageIcon,
  VideoLibrary,
  NavigateBefore,
  NavigateNext,
  PlayArrow
} from "@mui/icons-material";

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
  const [viewType, setViewType] = useState(null); // '3d', '360', 'gallery', 'video'
  const [panoramaUrl, setPanoramaUrl] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  
  // Interactive image viewer states (zoom and pan)
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePan, setImagePan] = useState({ x: 0, y: 0 });
  const [isImageDragging, setIsImageDragging] = useState(false);
  const [imageDragStart, setImageDragStart] = useState({ x: 0, y: 0 });
  // 3D transform states
  const [imageRotation, setImageRotation] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const modelViewerRef = useRef(null);
  const arModelViewerRef = useRef(null);
  const panoramaRef = useRef(null);
  const imageViewerRef = useRef(null);

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

  // Load product image for display
  useEffect(() => {
    const loadProductImage = async () => {
      setLoadingImage(true);
      try {
        // Try to fetch image from backend endpoint
        const imageUrl = await getProductImage(product.id);
        setProductImageUrl(imageUrl);
      } catch (err) {
        // Fallback to product.imageUrl if available
        if (product.imageUrl) {
          setProductImageUrl(product.imageUrl);
        } else {
          setProductImageUrl(null);
        }
      } finally {
        setLoadingImage(false);
      }
    };
    
    loadProductImage();
  }, [product.id, product.imageUrl]);

  // Fetch viewing options (3D model, 360 image, gallery, video) in priority order
  useEffect(() => {
    setLoadingModel(true);
    setArError(null);
    
    const loadViewingOptions = async () => {
      // Quick fallback: If product has imageUrl and no 3D model, use it immediately
      if (product.imageUrl && !product.hasImage3D) {
        setProductImages([product.imageUrl]);
        setViewType('gallery');
        setLoadingModel(false);
        return;
      }
      
      // Priority 1: Try 3D models (only if hasImage3D is true)
      if (product.hasImage3D) {
        const formats = ['glb', 'gltf', 'usdz', 'obj'];
        for (const format of formats) {
          try {
            const result = await getProduct3DModel(product.id, format);
            setModelUrl(result.url);
            setModelFormat(result.format);
            setViewType('3d');
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
          setModelFormat('glb');
          setViewType('3d');
          setLoadingModel(false);
          return;
        } catch (err) {
          console.log("3D model not available, trying alternatives...");
        }
      }
      
      // Priority 2: Try 360-degree image
      try {
        const url = await getProduct360Image(product.id);
        setPanoramaUrl(url);
        setViewType('360');
        setLoadingModel(false);
        return;
      } catch (err) {
        console.log("360 image not available, trying gallery...");
      }
      
      // Priority 3: Try multiple images gallery
      try {
        const images = await getProductImages(product.id);
        if (images && Array.isArray(images) && images.length > 0) {
          setProductImages(images);
          setViewType('gallery');
          setLoadingModel(false);
          return;
        }
      } catch (err) {
        console.log("Image gallery endpoint not available, trying fallback...");
      }
      
      // Priority 4: Try video
      try {
        const url = await getProductVideo(product.id);
        setVideoUrl(url);
        setViewType('video');
        setLoadingModel(false);
        return;
      } catch (err) {
        console.log("Video not available");
      }
      
      // Fallback: Try to fetch product image from backend endpoint
      try {
        const imageUrl = await getProductImage(product.id);
        setProductImages([imageUrl]);
        setViewType('gallery');
        setLoadingModel(false);
        return;
      } catch (err) {
        console.log("Product image endpoint not available, trying product.imageUrl...");
      }
      
      // Fallback: Use product imageUrl if available in response (always show something if image exists)
      if (product.imageUrl) {
        setProductImages([product.imageUrl]);
        setViewType('gallery');
        setLoadingModel(false);
        return;
      }
      
      // If product has multiple images in a different field, try that
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        setProductImages(product.images);
        setViewType('gallery');
        setLoadingModel(false);
        return;
      }
      
      // Check for image in other possible fields
      const possibleImageFields = ['image', 'productImage', 'thumbnail', 'photo'];
      for (const field of possibleImageFields) {
        if (product[field]) {
          setProductImages([product[field]]);
          setViewType('gallery');
          setLoadingModel(false);
          return;
        }
      }
      
      // No viewing options available - log for debugging
      console.log("No viewing options found for product:", product);
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
    
    // If no viewType, try to fetch image from backend
    if (!viewType) {
      setLoadingModel(true);
      getProductImage(product.id)
        .then((imageUrl) => {
          setProductImages([imageUrl]);
          setViewType('gallery');
          setLoadingModel(false);
          setShowARModal(true);
        })
        .catch((err) => {
          console.error("Failed to load product image:", err);
          toast.error("Failed to load product image");
          setLoadingModel(false);
        });
      return;
    }
    
    setShowARModal(true);
  };

  // Interactive image viewer handlers
  const resetImageView = () => {
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
    setImageRotation({ x: 0, y: 0 });
  };

  const handleImageWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setImageZoom(prev => Math.max(0.5, Math.min(5, prev + delta)));
  };

  const handleImageMouseDown = (e) => {
    if (imageZoom > 1) {
      setIsImageDragging(true);
      setImageDragStart({ x: e.clientX - imagePan.x, y: e.clientY - imagePan.y });
    }
  };

  const handleImageMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate 3D rotation based on mouse position (parallax effect)
    const maxRotation = 15; // degrees
    const rotationX = (mouseY / (rect.height / 2)) * maxRotation;
    const rotationY = (mouseX / (rect.width / 2)) * maxRotation;
    
    setMousePosition({ x: mouseX, y: mouseY });
    setImageRotation({ 
      x: rotationX * 0.3, // Reduce intensity for subtle effect
      y: rotationY * 0.3 
    });

    if (isImageDragging && imageZoom > 1) {
      setImagePan({
        x: e.clientX - imageDragStart.x,
        y: e.clientY - imageDragStart.y
      });
    }
  };

  const handleImageMouseUp = () => {
    setIsImageDragging(false);
  };

  const handleImageMouseLeave = () => {
    setIsImageDragging(false);
    // Reset rotation when mouse leaves
    setImageRotation({ x: 0, y: 0 });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    resetImageView();
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    resetImageView();
  };

  // 360 image drag handler
  const handlePanoramaMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handlePanoramaMouseMove = (e) => {
    if (!isDragging || !panoramaRef.current) return;
    const deltaX = e.clientX - startX;
    const rotation = currentRotation + deltaX * 0.5;
    setCurrentRotation(rotation);
    panoramaRef.current.style.transform = `rotateY(${rotation}deg)`;
  };

  const handlePanoramaMouseUp = () => {
    setIsDragging(false);
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

  // Keyboard navigation for gallery
  useEffect(() => {
    if (!showARModal || viewType !== 'gallery') return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
      }
      if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
      }
      if (e.key === 'Escape') {
        closeARModal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showARModal, viewType, productImages.length]);

  return (
    <div className="Card">
      <ToastContainer />
      
      {/* Product Image - Display directly like categories */}
      <div style={{ 
        width: "100%", 
        height: "200px", 
        marginBottom: "12px",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {loadingImage ? (
          <CircularProgress size={30} />
        ) : productImageUrl ? (
          <img 
            src={productImageUrl} 
            alt={product.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain"
            }}
          />
        ) : (
          <Box sx={{ color: "#999", fontSize: "0.9rem" }}>No image available</Box>
        )}
      </div>

      <h3 className="ProductName">{product.name}</h3>
      <p className="ProductDescription">{product.description}</p>
      <div className="ProductPrice">INR {product.price}</div>
      <div className="CategoryName">{product.categoryName}</div>

      {/* Interactive View Button (3D/AR/Gallery/Video) - Only show if available */}
      <div style={{ marginBottom: "10px" }}>
        {loadingModel ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
            <CircularProgress size={20} />
            <span style={{ fontSize: "0.9rem", color: "#666" }}>Loading viewer...</span>
          </Box>
        ) : arError ? (
          <Box sx={{ p: 1 }}>
            <span style={{ fontSize: "0.9rem", color: "#d32f2f" }}>{arError}</span>
          </Box>
        ) : viewType ? (
          <button 
            className="card-tag subtle" 
            onClick={openViewer}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              width: "100%",
              justifyContent: "center"
            }}
          >
            {viewType === '3d' && <ViewInAr style={{ fontSize: "18px" }} />}
            {viewType === '360' && <Panorama style={{ fontSize: "18px" }} />}
            {viewType === 'gallery' && <ImageIcon style={{ fontSize: "18px" }} />}
            {viewType === 'video' && <VideoLibrary style={{ fontSize: "18px" }} />}
            {viewType === '3d' && "View in AR / 3D"}
            {viewType === '360' && "View 360° Image"}
            {viewType === 'gallery' && "View Image Gallery"}
            {viewType === 'video' && "Watch Product Video"}
          </button>
        ) : null}
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

      {/* Viewer Modal - Supports 3D, 360, Gallery, Video */}
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
            {viewType === '3d' && <ThreeDRotation />}
            {viewType === '360' && <Panorama />}
            {viewType === 'gallery' && <ImageIcon />}
            {viewType === 'video' && <VideoLibrary />}
            <span>
              {product.name} - {
                viewType === '3d' ? 'AR / 3D View' :
                viewType === '360' ? '360° View' :
                viewType === 'gallery' ? 'Image Gallery' :
                viewType === 'video' ? 'Product Video' : 'View'
              }
            </span>
          </Box>
          <IconButton onClick={closeARModal} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, position: "relative", height: "100%", overflow: "hidden" }}>
          {/* 3D Model Viewer */}
          {viewType === '3d' && modelUrl && (
            <model-viewer
              ref={arModelViewerRef}
              src={modelUrl}
              alt={product.name}
              ar
              ar-modes={modelFormat === 'usdz' ? "quick-look" : "scene-viewer quick-look webxr"}
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

          {/* 360 Panorama Viewer */}
          {viewType === '360' && panoramaUrl && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#000",
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handlePanoramaMouseDown}
              onMouseMove={handlePanoramaMouseMove}
              onMouseUp={handlePanoramaMouseUp}
              onMouseLeave={handlePanoramaMouseUp}
            >
              <img
                ref={panoramaRef}
                src={panoramaUrl}
                alt={`${product.name} 360 view`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `rotateY(${currentRotation}deg)`,
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Drag to rotate • Scroll to zoom
              </Box>
            </Box>
          )}

          {/* Interactive 3D Image Gallery Viewer */}
          {viewType === 'gallery' && productImages.length > 0 && (
            <Box 
              sx={{ 
                width: "100%", 
                height: "100%", 
                position: "relative", 
                backgroundColor: "#000",
                overflow: "hidden",
                cursor: imageZoom > 1 ? (isImageDragging ? "grabbing" : "grab") : "default",
                perspective: "1000px", // 3D perspective
              }}
              onWheel={handleImageWheel}
              onMouseDown={handleImageMouseDown}
              onMouseMove={handleImageMouseMove}
              onMouseUp={handleImageMouseUp}
              onMouseLeave={handleImageMouseLeave}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `
                    translate(calc(-50% + ${imagePan.x}px), calc(-50% + ${imagePan.y}px)) 
                    scale(${imageZoom})
                    rotateX(${imageRotation.x}deg) 
                    rotateY(${imageRotation.y}deg)
                    translateZ(${imageZoom > 1 ? imageZoom * 20 : 0}px)
                  `,
                  transformStyle: "preserve-3d",
                  transition: isImageDragging ? "none" : "transform 0.2s ease-out",
                  willChange: "transform",
                }}
              >
                <img
                  ref={imageViewerRef}
                  src={productImages[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    userSelect: "none",
                    filter: `
                      drop-shadow(${imageZoom * 10}px ${imageZoom * 10}px ${imageZoom * 20}px rgba(0, 0, 0, 0.5))
                      brightness(${1 + (imageZoom - 1) * 0.1})
                    `,
                    backfaceVisibility: "hidden",
                  }}
                  draggable={false}
                />
              </Box>
              
              {/* 3D Background Effect */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `
                    radial-gradient(
                      circle at ${50 + (mousePosition.x / 20)}% ${50 + (mousePosition.y / 20)}%,
                      rgba(255, 255, 255, 0.05) 0%,
                      transparent 50%
                    )
                  `,
                  pointerEvents: "none",
                  transition: "background 0.3s ease-out",
                }}
              />
              
              {/* Zoom and Reset Controls */}
              <Box
                sx={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  zIndex: 10,
                }}
              >
                <IconButton
                  onClick={() => setImageZoom(prev => Math.min(5, prev + 0.2))}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  }}
                  size="small"
                >
                  <Box sx={{ fontSize: "18px", fontWeight: "bold" }}>+</Box>
                </IconButton>
                <IconButton
                  onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.2))}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  }}
                  size="small"
                >
                  <Box sx={{ fontSize: "18px", fontWeight: "bold" }}>−</Box>
                </IconButton>
                {imageZoom > 1 && (
                  <IconButton
                    onClick={resetImageView}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                    }}
                    size="small"
                    title="Reset view"
                  >
                    <Box sx={{ fontSize: "14px" }}>⌂</Box>
                  </IconButton>
                )}
              </Box>

              {productImages.length > 1 && (
                <>
                  <IconButton
                    onClick={() => {
                      prevImage();
                      resetImageView();
                    }}
                    sx={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                      zIndex: 10,
                    }}
                  >
                    <NavigateBefore />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      nextImage();
                      resetImageView();
                    }}
                    sx={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                      zIndex: 10,
                    }}
                  >
                    <NavigateNext />
                  </IconButton>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      zIndex: 10,
                    }}
                  >
                    {currentImageIndex + 1} / {productImages.length}
                  </Box>
                </>
              )}
              
              {/* Instructions */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  zIndex: 10,
                }}
              >
                Scroll to zoom • Drag to pan
              </Box>
            </Box>
          )}

          {/* Video Player */}
          {viewType === 'video' && videoUrl && (
            <Box sx={{ width: "100%", height: "100%", position: "relative", backgroundColor: "#000" }}>
              <video
                src={videoUrl}
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              >
                Your browser does not support the video tag.
              </video>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeARModal} variant="outlined">
            Close
          </Button>
          {viewType === '3d' && modelUrl && (
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
