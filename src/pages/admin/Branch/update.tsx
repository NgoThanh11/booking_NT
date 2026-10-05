import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../../assets/styles/BranchAdd.module.scss";
import { getBranchById, updateBranch } from "../../../api/BranchApi";

interface FormData {
  branchName: string;
  branchAddress: string;
  branchPhone: string;
}

export default function BranchUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<FormData>({
    branchName: "",
    branchAddress: "",
    branchPhone: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  // LẤY THÔNG TIN CHI NHÁNH
  const loadBranch = async () => {
    try {
      setLoadingData(true);

      if (!id) {
        toast.error("Không tìm thấy ID chi nhánh");
        return;
      }

      const response = await getBranchById(Number(id));

      console.log("Branch detail:", response);

      // Trường hợp API trả trực tiếp object
      const branch = response?.data || response;

      setFormData({
        branchName: branch.branchName || "",
        branchAddress: branch.branchAddress || "",
        branchPhone: branch.branchPhone || "",
      });
    } catch (error: any) {
      console.error("Lỗi lấy thông tin chi nhánh:", error);

      toast.error(
        error?.response?.data?.message || "Không thể tải thông tin chi nhánh",
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadBranch();
  }, [id]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error("Không tìm thấy ID chi nhánh");
      return;
    }

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

      const response = await updateBranch(Number(id), {
        branchName: formData.branchName.trim(),
        branchAddress: formData.branchAddress.trim(),
        branchPhone: formData.branchPhone.trim(),
      });

      console.log("Update branch response:", response);

      if (response?.success) {
        toast.success(response?.message || "Cập nhật chi nhánh thành công");

        setTimeout(() => {
          navigate(`/admin/branch/`);
        }, 800);
      } else {
        toast.error(response?.message || "Cập nhật chi nhánh thất bại");
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật chi nhánh:", error);

      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật chi nhánh",
      );
    } finally {
      setLoading(false);
    }
  };

  // LOADING
  if (loadingData) {
    return (
      <div className={styles.page}>
        <Toaster position="top-right" />

        <div className={styles.formCard}>
          <div className={styles.loading}>
            <span className={styles.spinner}></span>
            Đang tải thông tin chi nhánh...
          </div>
        </div>
      </div>
    );
  }

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

      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <h1>Chỉnh sửa chi nhánh</h1>

          <p>Cập nhật thông tin chi nhánh Barber Smile11</p>
        </div>
      </div>

      {/* FORM */}
      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <i className="bi bi-pencil-square"></i>
          </div>

          <div>
            <h3>Thông tin chi nhánh</h3>

            <p>Chỉnh sửa thông tin của chi nhánh</p>
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
              onClick={() => navigate(`/admin/branch`)}
              disabled={loading}
            >
              <i className="bi bi-arrow-left"></i>
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
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg"></i>
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
