import { apiFetch } from './consolidatedApi';

export const userApi = {
  getProfile: async () => {
    const response = await apiFetch('/users/me', {
      method: 'GET'
    });
    
    if (response.ok) {
      // Normalize response data
      const user = response.data?.data || response.data?.user || response.data;
      return { ok: true, status: response.status, data: user };
    } else {
      return { ok: false, status: response.status, data: response.data };
    }
  },

  updateProfile: async (dto) => {
    const response = await apiFetch('/users/me', {
      method: 'PATCH',
      body: dto
    });
    
    if (response.ok) {
      return response.data;
    } else {
      throw new Error(response.data?.message || response.data?.error || 'Failed to update profile');
    }
  },

  uploadProfilePicture: async (file) => {
    console.log('🔍 uploadProfilePicture - file:', file);
    console.log('🔍 uploadProfilePicture - file type:', file?.type);
    console.log('🔍 uploadProfilePicture - file size:', file?.size);
    
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Resize image if too large (max 200KB)
    const resizeImage = (file, maxSizeKB = 200) => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Calculate new dimensions
          let { width, height } = img;
          const maxSize = 500; // Max dimension
          
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob && blob.size / 1024 <= maxSizeKB) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              // Try even smaller
              canvas.toBlob((smallBlob) => {
                resolve(new File([smallBlob], file.name, { type: 'image/jpeg' }));
              }, 'image/jpeg', 0.7);
            }
          }, 'image/jpeg', 0.8);
        };
        
        img.src = URL.createObjectURL(file);
      });
    };
    
    try {
      const resizedFile = await resizeImage(file);
      console.log('🔍 uploadProfilePicture - resized file size:', resizedFile.size);
      
      const formData = new FormData();
      formData.append('file', resizedFile);
      
      console.log('🔍 uploadProfilePicture - FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value.name, value.size, value.type);
      }
      
      // Use the correct file upload endpoint
      const response = await apiFetch('/users/profile-picture-upload', {
        method: 'PATCH',
        body: formData
      });
      
      console.log('🔍 uploadProfilePicture - response:', response);
      
      if (response.ok) {
        return response.data;
      } else {
        throw new Error(response.data?.message || response.data?.error || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('🔍 uploadProfilePicture - upload failed:', error);
      throw error;
    }
  },
};
