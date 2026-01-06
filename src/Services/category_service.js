import { myAxios } from "./helper";

export const fetchCategories = async () => {
  try {
    const response = await myAxios.get("/category");
    const data = response.data.data; // Accessing the array of categories
    return data;
  } catch (error) {
    console.error("Error fetching category list:", error);
    throw error;
  }
};

// Add new category - sends name and image together
export const addCategory = async (categoryName, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("name", categoryName);
    if (imageFile) {
      formData.append("file", imageFile);
    }

    const response = await myAxios.post("/category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Update category - sends name and optionally image, id is path variable
export const updateCategory = async (categoryId, categoryName, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("name", categoryName);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await myAxios.put(`/category/${categoryId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (id) => {
  try {
    const response = await myAxios.post("/category/delete/" + id);
    const data = response.message;
    return data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Change category status
export const changeCategoryStatus = async (category) => {
  try {
    const response = await myAxios.post("/category/updateStatus", category);
    const data = response.message;
    return data;
  } catch (error) {
    console.error("Error updating category status:", error);
    throw error;
  }
};

// Search categories
export const searchCategories = async (query) => {
  try {
    const response = await myAxios.get(
      `/category/search?query=${encodeURIComponent(query)}`
    );
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error("Error searching categories:", error);
    throw error;
  }
};

// Upload category image
export const uploadCategoryImage = async (categoryId, imageFile) => {
  if (!imageFile) return;

  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await myAxios.post(
      `/category/uploadImage/${categoryId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading category image:", error);
    throw error;
  }
};

// Bulk delete categories
export const bulkDeleteCategories = async (categoryIds) => {
  try {
    const response = await myAxios.post("/category/bulkDelete", {
      ids: categoryIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting categories:", error);
    throw error;
  }
};

// Bulk update category status
export const bulkUpdateCategoryStatus = async (categoryIds, status) => {
  try {
    const response = await myAxios.post("/category/bulkUpdateStatus", {
      ids: categoryIds,
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error bulk updating category status:", error);
    throw error;
  }
};
