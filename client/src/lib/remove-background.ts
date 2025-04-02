import { apiRequest } from "./queryClient";

export type RemoveBackgroundResult = {
  imageUrl: string | null;
  usedFreeTrial: boolean;
  error?: string;
};

export async function removeBackground(
  file: File,
  checkFreeTrial: boolean = false
): Promise<RemoveBackgroundResult> {
  try {
    const formData = new FormData();
    formData.append("image", file);
    
    if (checkFreeTrial) {
      formData.append("checkFreeTrial", "true");
    }
    
    const response = await fetch("/api/remove-background", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        imageUrl: null,
        usedFreeTrial: false,
        error: errorData.message || "Failed to process image",
      };
    }
    
    const data = await response.json();
    
    return {
      imageUrl: data.imageUrl,
      usedFreeTrial: data.usedFreeTrial || false
    };
  } catch (error) {
    console.error("Error removing background:", error);
    return {
      imageUrl: null,
      usedFreeTrial: false,
      error: "An unexpected error occurred"
    };
  }
}
