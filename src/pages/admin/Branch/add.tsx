import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../../assets/styles/BranchAdmin/BranchAdd.module.scss";
import { createBranch } from "../../../api/BranchApi";

export default function BranchAdd() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    branchName: "",
    branchAddress: "",
    branchPhone: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.branchName.trim()) {
      toast.error("Vui lòng nhập tên chi nhánh");
      return;
    }

    if (!formData.branchAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ chi nhánh");
      return;
    }

    if (!formData.branchPhone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      setLoading(true);

      const response = await createBranch({
        branchName: formData.branchName.trim(),
        branchAddress: formData.branchAddress.trim(),
        branchPhone: formData.branchPhone.trim(),
      });

      if (response?.success) {
        toast.success(response.message || "Thêm chi nhánh thành công");
        setFormData({
          branchName: "",
          branchAddress: "",
          branchPhone: "",
        });
        setTimeout(() => {
          navigate("/admin/branch");
        }, 800);
      } else {
        toast.error(response?.message || "Thêm chi nhánh thất bại");
      }
    } catch (error: any) {
      console.error("Lỗi thêm chi nhánh:", error);

      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi thêm chi nhánh",
      );
    } finally {
      setLoading(false);
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

      {/* =========================
          HEADER
      ========================= */}
      <div className={styles.pageHeader}>
        <div>
          <h1>Thêm chi nhánh</h1>

          <p>Tạo mới thông tin chi nhánh Barber Smile11</p>
        </div>
      </div>

      {/* =========================
          FORM
      ========================= */}
      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <i className="bi bi-shop"></i>
          </div>

          <div>
            <h3>Thông tin chi nhánh</h3>
            <p>Nhập đầy đủ thông tin của chi nhánh mới</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* TÊN */}
            <div className={styles.formGroup}>
              <label>
                Tên chi nhánh <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-building"></i>

                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  placeholder="Nhập tên chi nhánh"
                />
              </div>
            </div>

            {/* PHONE */}
            <div className={styles.formGroup}>
              <label>
                Số điện thoại <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-telephone"></i>

                <input
                  type="tel"
                  name="branchPhone"
                  value={formData.branchPhone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className={styles.formGroupFull}>
              <label>
                Địa chỉ <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-geo-alt"></i>

                <input
                  type="text"
                  name="branchAddress"
                  value={formData.branchAddress}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ chi nhánh"
                />
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/admin/branch")}
              disabled={loading}
            >
              Quay lại
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg"></i>
                  Thêm chi nhánh
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
