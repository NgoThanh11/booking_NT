import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../../assets/styles/UserAdmin/UserUpdate.module.scss";
import {
  getUserById,
  updateUser,
} from "../../../api/UserAdmin";

export default function UserUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    username: "",
    passwordHash: "",
    fullName: "",
    role: "Customer",
    isActive: true,
  });

  // =========================
  // LẤY USER
  // =========================
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoadingData(true);

        if (!id) {
          toast.error("Không tìm thấy ID người dùng");
          navigate("/admin/User");
          return;
        }

        const response = await getUserById(Number(id));

        const user = response?.data || response;

        setForm({
          username: user.username || "",
          passwordHash: "",
          fullName: user.fullName || "",
          role: user.role || "Customer",
          isActive: user.isActive ?? true,
        });
      } catch (error: any) {
        console.error("Lỗi lấy thông tin user:", error);

        toast.error(
          error?.response?.data?.message ||
            "Không thể lấy thông tin người dùng"
        );

        navigate("/admin/User");
      } finally {
        setLoadingData(false);
      }
    };

    loadUser();
  }, [id, navigate]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!form.username.trim()) {
      toast.error("Vui lòng nhập username");
      return;
    }

    if (form.username.trim().length < 3) {
      toast.error("Username phải có ít nhất 3 ký tự");
      return;
    }

    if (!form.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }

    // Nếu nhập mật khẩu mới thì phải >= 6 ký tự
    if (
      form.passwordHash.trim() &&
      form.passwordHash.length < 6
    ) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);

      if (!id) {
        toast.error("Không tìm thấy ID người dùng");
        return;
      }

      const response = await updateUser(
        Number(id),
        {
          username: form.username.trim(),
          passwordHash:
            form.passwordHash.trim() || undefined,
          fullName: form.fullName.trim(),
          role: form.role as "Admin" | "Customer",
          isActive: form.isActive,
        }
      );

      if (response?.success !== false) {
        toast.success(
          response?.message ||
            "Cập nhật người dùng thành công"
        );

        setTimeout(() => {
          navigate("/admin/User");
        }, 800);
      } else {
        toast.error(
          response?.message ||
            "Cập nhật người dùng thất bại"
        );
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật user:", error);

      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật người dùng"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loadingData) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner}></div>
        <p>Đang tải thông tin người dùng...</p>
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
          <h1>Cập nhật người dùng</h1>
          <p>
            Chỉnh sửa thông tin tài khoản người dùng
          </p>
        </div>

        
      </div>

      {/* FORM */}
      <section className={styles.formCard}>
        {/* FORM HEADER */}
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <i className="bi bi-person-gear"></i>
          </div>

          <div>
            <h3>Thông tin tài khoản</h3>
            <p>
              Cập nhật thông tin người dùng
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          {/* USERNAME */}
          <div className={styles.formGroup}>
            <label>
              Username <span>*</span>
            </label>

            <div className={styles.inputWrapper}>
              <i className="bi bi-person"></i>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Nhập username"
              />
            </div>

            <small>
              Username dùng để đăng nhập hệ thống
            </small>
          </div>

          {/* PASSWORD */}
          <div className={styles.formGroup}>
            <label>
              Mật khẩu mới
            </label>

            <div className={styles.inputWrapper}>
              <i className="bi bi-lock"></i>

              <input
                type="password"
                name="passwordHash"
                value={form.passwordHash}
                onChange={handleChange}
                placeholder="Để trống nếu không muốn đổi mật khẩu"
              />
            </div>

            <small>
              Chỉ nhập khi muốn thay đổi mật khẩu
            </small>
          </div>

          {/* FULL NAME */}
          <div className={styles.formGroup}>
            <label>
              Họ và tên <span>*</span>
            </label>

            <div className={styles.inputWrapper}>
              <i className="bi bi-person-vcard"></i>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
              />
            </div>
          </div>

          {/* ROLE + STATUS */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>
                Vai trò <span>*</span>
              </label>

              <div className={styles.selectWrapper}>
                <i className="bi bi-shield-check"></i>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="Customer">
                    Customer
                  </option>

                  <option value="Admin">
                    Admin
                  </option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                Trạng thái <span>*</span>
              </label>

              <div className={styles.selectWrapper}>
                <i className="bi bi-toggle-on"></i>

                <select
                  name="isActive"
                  value={
                    form.isActive
                      ? "true"
                      : "false"
                  }
                  onChange={handleChange}
                >
                  <option value="true">
                    Đang hoạt động
                  </option>

                  <option value="false">
                    Đã khóa
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() =>
                navigate("/admin/user")
              }
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
                  <span
                    className={styles.buttonSpinner}
                  ></span>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg"></i>
                  Cập nhật
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}