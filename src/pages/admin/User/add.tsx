import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../../assets/styles/UserAdmin/UserAdd.module.scss";

import { createUser } from "../../../api/UserAdmin";

export default function UserAdd() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    passwordHash: "",
    fullName: "",
    role: "Customer",
    isActive: true,
  });

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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // =========================
    // VALIDATE
    // =========================

    if (!form.username.trim()) {
      toast.error("Vui lòng nhập username");
      return;
    }

    if (form.username.trim().length < 3) {
      toast.error(
        "Username phải có ít nhất 3 ký tự"
      );
      return;
    }

    if (!form.passwordHash.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    if (form.passwordHash.length < 6) {
      toast.error(
        "Mật khẩu phải có ít nhất 6 ký tự"
      );
      return;
    }

    if (!form.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }

    try {
      setLoading(true);

      const response = await createUser({
        username: form.username.trim(),
        passwordHash: form.passwordHash,
        fullName: form.fullName.trim(),
        role: form.role as "Admin" | "Customer",
        isActive: form.isActive,
      });

      if (response?.success !== false) {
        toast.success(
          response?.message ||
            "Thêm người dùng thành công"
        );

        setTimeout(() => {
          navigate("/admin/User");
        }, 800);
      } else {
        toast.error(
          response?.message ||
            "Thêm người dùng thất bại"
        );
      }
    } catch (error: any) {
      console.error(
        "Lỗi thêm user:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi thêm người dùng"
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

      {/* HEADER */}

      <div className={styles.pageHeader}>
        <div>
          <h1>Thêm người dùng</h1>

          <p>
            Tạo tài khoản người dùng mới
          </p>
        </div>

       
      </div>

      {/* FORM */}

      <section className={styles.formCard}>

        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <i className="bi bi-person-plus"></i>
          </div>

          <div>
            <h3>Thông tin tài khoản</h3>

            <p>
              Nhập thông tin để tạo tài khoản
              mới
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
              Username
              <span>*</span>
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
              Mật khẩu
              <span>*</span>
            </label>

            <div className={styles.inputWrapper}>
              <i className="bi bi-lock"></i>

              <input
                type="password"
                name="passwordHash"
                value={form.passwordHash}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
              />
            </div>

            <small>
              Mật khẩu tối thiểu 6 ký tự
            </small>
          </div>

          {/* FULL NAME */}

          <div className={styles.formGroup}>
            <label>
              Họ và tên
              <span>*</span>
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

            {/* ROLE */}

            <div className={styles.formGroup}>
              <label>
                Vai trò
                <span>*</span>
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

            {/* STATUS */}

            <div className={styles.formGroup}>
              <label>
                Trạng thái
                <span>*</span>
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
                    className={
                      styles.spinner
                    }
                  ></span>

                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg"></i>

                  Thêm người dùng
                </>
              )}
            </button>

          </div>

        </form>
      </section>
    </div>
  );
}