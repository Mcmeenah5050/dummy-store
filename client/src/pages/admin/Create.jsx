import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useStore";
import { useForm } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
import { toast } from "sonner";
import { createProduct } from "../../api/api";

export default function Create() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState(null);
  const { user, accessToken, setData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data: authUser } = user || {};
  const redirect = location.state?.from || "/";

  //redirect user if not admin

  useEffect(() => {
    if (!authUser.role.includes("admin")) {
      navigate(redirect, { replace: true });
    }
  }, [authUser.role, navigate, redirect]);

  const cats = [
    {
      name: "Beauty",
    },
    {
      name: "Tech",
    },
    {
      name: "Home",
    },
    {
      name: "Fashion",
    },
  ];

  const handleImage = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast.error("You can only upload up to 5 images");
      return;
    }
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be no more than 5MB");
        return false;
      }
      return true;
    });
    //clear previous images before adding new ones
    setSelectedImages([]);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages((prev) => {
          const newFiles = [...prev, { file, preview: reader.result }];
          return newFiles;
        });
      };
      reader.onerror = () => {
        console.error("Error reading file", file.name);
        toast.error("Error reading file");
      };
      reader.readAsDataURL(file);
    });
  };

  const onFormSubmit = async (data) => {
    const formData = {
      ...data,
      images: selectedImages.map(({ preview }) => preview),
    };
    try {
      const res = await createProduct(formData, accessToken);
      if (res.status === 201) {
        toast.success(res.data.message);
        setData((prev) => [res.data.product, ...prev]);
        navigate("/allproducts");
      }
    } catch (error) {
      console.log(error);
      setError(
        error?.response?.data?.message ||
          error?.response.data?.error ||
          error?.message
      );
    }
  };

  if (error) return <p className="text-sm text-center">{error}</p>;

  return (
    <div className="max-w-[1024px] mt-[3rem] mx-auto py-6 px-4">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <h1 className="text-3xl mb-4">Create your product</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="form-control w-full">
              <label htmlFor="title">Title</label>
              <input
                className="input input-bordered rounded-none"
                type="text"
                placeholder="Enter product title"
                name="title"
                id="title"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">Title is required</p>
              )}
            </div>
            <div className="form-control w-full my-4">
              <label htmlFor="description">Description</label>
              <textarea
                className="input input-bordered rounded-none textarea-lg"
                type="text"
                placeholder="Enter product description"
                name="description"
                id="description"
                {...register("description", { required: true })}
              ></textarea>

              {errors.description && (
                <p className="text-red-500 text-sm">Description is required</p>
              )}
            </div>
            <div className="form-control w-full">
              <label htmlFor="price">Price</label>
              <input
                className="input input-bordered rounded-none"
                type="number"
                placeholder="0000"
                {...register("price", { required: true })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">Price is required</p>
              )}
            </div>
            <div className="form-control w-full my-4">
              <label htmlFor="brand">Brand</label>
              <input
                className="input input-bordered rounded-none"
                type="text"
                placeholder="brand name"
                {...register("brand")}
              />
            </div>
          </div>
          <div>
            <div>
              <label>Select Category</label>
              <select
                className="select select-bordered w-full rounded-none"
                {...register("category", { required: true })}
              >
                {cats.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">Please select a category</p>
              )}
            </div>
            <div className="form-control w-full my-4 relative">
              <label
                htmlFor="images"
                className="h-[300px] border-2 border-dashed flex items-center justify-center overflow-auto p-2 cursor-pointer"
              >
                {selectedImages.length === 0 ? (
                  <div className="text-center">
                    <BiPlus className="mx-auto mb-2" />
                    <p>Upload photos</p>
                    <p className="text-xs text-gray-500">
                      Upload up to 5 photos
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 w-full relative z-20">
                    {selectedImages.map(({ preview }, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`preview-${index}`}
                          className="w-full h-[150px] rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                          className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </label>
              <input
                className="w-full h-full absolute top-0 inset-y-0 opacity-0 cursor-pointer"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImage}
              />
            </div>
          </div>
          <div>
            <button
              className="btn btn-success text-white w-full mt-6 "
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Creating product..." : " Create product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
