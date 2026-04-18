import { myAxios } from "./helper";

export const productList = async () => {
  try {
    const response = await myAxios.get("/product");
    const data = response.data.data; // Accessing the array of products
    return data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};

export const productListByCategory = async (categoryId) => {
  try {
    const response = await myAxios.get("/product/getByCategory/" + categoryId);
    const data = response.data.data; // Accessing the array of products
    return data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};

export const addProduct = async (product) => {
  try {
    const response = await myAxios.post("/product/add", product);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error Adding product:", error);
    throw error;
  }
};

export const updateProduct = async (product) => {
  try {
    const response = await myAxios.post("/product/update", product);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error Updating product list:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await myAxios.post("/product/delete/" + id);
    const data = response.message;
    return data;
  } catch (error) {
    console.error("Error Updating product list:", error);
    throw error;
  }
};

export const adminProductList = async () => {
  try {
    const response = await myAxios.get("/product/admin");
    const data = response.data.data; // Accessing the array of products
    return data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};

export const changeStatus = async (product) => {
  try {
    const response = await myAxios.post("/product/updateStatus", product);
    const data = response.message;
    return data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};

export const uploadGlbFile = async (productId, glbFile) => {
  if (!glbFile) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", glbFile);

  try {
    const response = await myAxios.post(`/product/uploadGlb/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading GLB:", error);
    throw new Error("Failed to upload GLB file");
  }
};

/* ✅ Fetch product 3D model (GLB/GLTF/USDZ/OBJ) */
export const getProduct3DModel = async (productId, format = 'glb') => {
  try {
    // Try different format endpoints
    const endpoints = {
      glb: `/product/glb/${productId}`,
      gltf: `/product/gltf/${productId}`,
      usdz: `/product/usdz/${productId}`,
      obj: `/product/obj/${productId}`,
    };

    const endpoint = endpoints[format.toLowerCase()] || endpoints.glb;
    
    const response = await myAxios.get(endpoint, {
      responseType: "blob",
    });

    // Convert blob to an object URL for <model-viewer>
    const url = URL.createObjectURL(response.data);
    return { url, format: format.toLowerCase() };
  } catch (error) {
    console.error(`Error fetching ${format} file:`, error);
    throw error;
  }
};

/* ✅ Legacy: Fetch product GLB model (for backward compatibility) */
export const getProductGlb = async (productId) => {
  try {
    const result = await getProduct3DModel(productId, 'glb');
    return result.url;
  } catch (error) {
    // Try other formats as fallback
    const formats = ['gltf', 'usdz', 'obj'];
    for (const format of formats) {
      try {
        const result = await getProduct3DModel(productId, format);
        return result.url;
      } catch (e) {
        continue;
      }
    }
    throw error;
  }
};


/* ✅ Fetch multiple product images */
export const getProductImages = async (productId) => {
  try {
    const response = await myAxios.get(`/product/images/${productId}`);
    // Assuming response returns array of image URLs
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching product images:", error);
    throw error;
  }
};


// Search products by name or description
export const searchProducts = async (query) => {
  try {
    const response = await myAxios.get(`/product/search?query=${encodeURIComponent(query)}`);
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Upload product image
export const uploadProductImage = async (productId, imageFile) => {
  if (!imageFile) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await myAxios.post(`/product/uploadImage/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading product image:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to upload image");
  }
};

/* ✅ Fetch product image */
export const getProductImage = async (productId) => {
  try {
    const response = await myAxios.get(`/product/image/${productId}`, {
      responseType: "blob",
    });
    // Convert blob to an object URL for display
    const url = URL.createObjectURL(response.data);
    return url;
  } catch (error) {
    console.error("Error fetching product image:", error);
    throw error;
  }
};

// Bulk delete products
export const bulkDeleteProducts = async (productIds) => {
  try {
    const response = await myAxios.post("/product/bulkDelete", { ids: productIds });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting products:", error);
    throw error;
  }
};

// Bulk update product status
export const bulkUpdateStatus = async (productIds, status) => {
  try {
    const response = await myAxios.post("/product/bulkUpdateStatus", { 
      ids: productIds, 
      status: status 
    });
    return response.data;
  } catch (error) {
    console.error("Error bulk updating product status:", error);
    throw error;
  }
};

// Upload QR code
export const uploadQrCode = async (productId, qrFile) => {
  if (!qrFile) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", qrFile);

  try {
    const response = await myAxios.post(`/product/uploadQr/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading QR code:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to upload QR code");
  }
};

/* ✅ Fetch product QR code */
export const getProductQrCode = async (productId) => {
  try {
    const response = await myAxios.get(`/product/qr/${productId}`, {
      responseType: "blob",
    });
    // Convert blob to an object URL for display
    const url = URL.createObjectURL(response.data);
    return url;
  } catch (error) {
    console.error("Error fetching product QR code:", error);
    throw error;
  }
};
