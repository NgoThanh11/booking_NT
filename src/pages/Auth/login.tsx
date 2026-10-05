import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../assets/styles/Login.module.scss";
import { loginApi } from "../../api/LoginApi";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập");
      return;
    }

    if (!password.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const response = await loginApi({
        username: username.trim(),
        password,
      });

      if (response?.success) {
        const { token, userId, username, fullName, role } = response.data;

        // Lưu JWT
        localStorage.setItem("accessToken", token);

        // Lưu thông tin user
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId,
            username,
            fullName,
            role,
          }),
        );

        toast.success("Đăng nhập thành công");

        setTimeout(() => {
          navigate("/admin");
        }, 500);
      } else {
        toast.error(response.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Tên đăng nhập hoặc mật khẩu không đúng";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />
      <div className={styles.loginContainer}>
        {/* LEFT */}
        <div className={styles.loginLeft}>
          <div className={styles.logo}>
            <span>✂</span>
          </div>

          <h1>Barber Booking</h1>

          <p>
            Hệ thống quản lý đặt lịch
            <br />
            dành cho quản trị viên
          </p>

          <div className={styles.decor}>
            <span />
            <span />
            <span />
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.loginRight}>
          <div className={styles.formWrapper}>
            <div className={styles.header}>
              <h2>Đăng nhập</h2>

              <p>
                Chào mừng bạn quay trở lại!
                <br />
                Vui lòng đăng nhập để tiếp tục.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              {/* USERNAME */}
              <div className={styles.formGroup}>
                <label>Tên đăng nhập</label>

                <div className={styles.inputWrapper}>
                  <span className={styles.icon}>👤</span>

                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className={styles.formGroup}>
                <label>Mật khẩu</label>

                <div className={styles.inputWrapper}>
                  <span className={styles.icon}>🔒</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className={styles.showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.loginButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            <div className={styles.footer}>© 2026 Barber Booking</div>
          </div>
        </div>
      </div>
    </div>
  );
}
