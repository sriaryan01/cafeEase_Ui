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
  if (!glbFile) return;

  const formData = new FormData();
  formData.append("file", glbFile);

  try {
    await myAxios.post(`/product/uploadGlb/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    alert("3D model uploaded successfully!");
  } catch (error) {
    console.error("Error uploading GLB:", error);
    alert("Failed to upload 3D model.");
  }
};

/* ✅ NEW: Fetch product GLB model */
export const getProductGlb = async (productId) => {
  try {
    const response = await myAxios.get(`/product/glb/${productId}`, {
      responseType: "blob", // important: we want raw binary file
    });

    // Convert blob to an object URL for <model-viewer>
    const url = URL.createObjectURL(response.data);
    return url;
  } catch (error) {
    console.error("Error fetching GLB file:", error);
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
  if (!imageFile) return;

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
