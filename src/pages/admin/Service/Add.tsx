import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../../assets/styles/ServiceAminAdd.module.scss";

import { CreateService, GetServiceImages } from "../../../api/ServiceApi";

interface ServiceForm {
  name: string;
  description: string;
  price: string;
  durationMinutes: string;
  url: string;
  status: boolean;
}

export default function ServiceAdd() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ServiceForm>({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
    url: "",
    status: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoadingImages(true);

        const response = await GetServiceImages();

        if (response?.success) {
          setImages(response.data || []);
        } else {
          toast.error(response?.message || "Không lấy được danh sách hình ảnh");
        }
      } catch (error) {
        console.error("Lỗi lấy hình ảnh:", error);

        toast.error("Không thể lấy danh sách hình ảnh");
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    return `http://localhost:5021${url}`;
  };

  const handleSelectImage = (image: string) => {
    setForm((prev) => ({
      ...prev,
      url: image,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên dịch vụ");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      toast.error("Vui lòng nhập giá dịch vụ hợp lệ");
      return;
    }

    if (!form.durationMinutes || Number(form.durationMinutes) <= 0) {
      toast.error("Vui lòng nhập thời gian dịch vụ");
      return;
    }

    if (!form.url) {
      toast.error("Vui lòng chọn hình ảnh");
      return;
    }

    try {
      setLoadingSubmit(true);

      const response = await CreateService({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes),
        url: form.url,
        status: form.status,
      });

      if (!response?.success) {
        toast.error(response?.message || "Thêm dịch vụ thất bại");

        return;
      }

      toast.success(response?.message || "Thêm dịch vụ thành công");

      setTimeout(() => {
        navigate("/admin/Service");
      }, 700);
    } catch (error) {
      console.error("Lỗi thêm dịch vụ:", error);

      toast.error("Có lỗi xảy ra khi thêm dịch vụ");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className={styles.page}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />

      <div className={styles.header}>
        <div>
          <h1>Thêm dịch vụ</h1>
          <p>Tạo dịch vụ mới cho hệ thống</p>
        </div>

        
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* THÔNG TIN */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <i className="bi bi-info-circle"></i>
            <span>Thông tin dịch vụ</span>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>
                Tên dịch vụ <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ví dụ: Cắt tóc nam"
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                Giá <span>*</span>
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Ví dụ: 100000"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                Thời gian <span>*</span>
              </label>

              <input
                type="number"
                name="durationMinutes"
                value={form.durationMinutes}
                onChange={handleChange}
                placeholder="Ví dụ: 30"
                min="1"
              />

              <small>Đơn vị: phút</small>
            </div>

            <div className={styles.formGroup}>
              <label>Trạng thái</label>

              <select
                name="status"
                value={form.status ? "true" : "false"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value === "true",
                  }))
                }
              >
                <option value="true">Đang hoạt động</option>

                <option value="false">Ngừng hoạt động</option>
              </select>
            </div>

            <div className={styles.formGroupFull}>
              <label>
                Mô tả <span>*</span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Nhập mô tả dịch vụ..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* CHỌN ẢNH */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <i className="bi bi-images"></i>
            <span>Chọn hình ảnh dịch vụ</span>
          </div>

          <div className={styles.imageSection}>
            {loadingImages ? (
              <div className={styles.loading}>
                <i className="bi bi-arrow-repeat"></i>
                Đang tải hình ảnh...
              </div>
            ) : images.length === 0 ? (
              <div className={styles.empty}>
                <i className="bi bi-image"></i>
                <p>Lỗi lấy dữ liệu hình ảnh</p>
              </div>
            ) : (
              <div className={styles.imageGrid}>
                {images.map((image) => {
                  const selected = form.url === image;

                  return (
                    <button
                      type="button"
                      key={image}
                      className={`${styles.imageItem} ${
                        selected ? styles.selected : ""
                      }`}
                      onClick={() => handleSelectImage(image)}
                    >
                      <img src={getImageUrl(image)} alt="Service" />

                      {selected && (
                        <div className={styles.selectedIcon}>
                          <i className="bi bi-check-lg"></i>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {form.url && (
              <div className={styles.selectedImage}>
                <div className={styles.selectedTitle}>
                  <i className="bi bi-check-circle-fill"></i>
                  Hình ảnh đang chọn
                </div>

                <div className={styles.preview}>
                  <img src={getImageUrl(form.url)} alt="Preview" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BUTTON */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate("/admin/service")}
          >
            Quay lại
          </button>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <>
                <i className="bi bi-arrow-repeat"></i>
                Đang lưu...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg"></i>
                Thêm dịch vụ
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
