import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../assets/styles/Login.module.scss";
import { loginApi } from "../../api/LoginApi";
import { registerApi } from "../../api/LoginApi";

export default function Login() {
  const navigate = useNavigate();

  // =========================
  // LOGIN
  // =========================
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // REGISTER
  // =========================
  const [fullName, setFullName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // false = login
  // true = register
  const [isRegister, setIsRegister] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================
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
        const {
          token,
          userId,
          username,
          fullName,
          role,
        } = response.data;

        localStorage.setItem("accessToken", token);

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
          if (role === "Admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 500);
      } else {
        toast.error(
          response?.message || "Đăng nhập thất bại",
        );
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

  // =========================
  // REGISTER
  // =========================
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }

    if (!registerUsername.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập");
      return;
    }

    if (!registerPassword) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    if (registerPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (registerPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);

      const response = await registerApi({
        username: registerUsername.trim(),
        passwordHash: registerPassword,
        fullName: fullName.trim(),
      });

      if (response?.success) {
        toast.success("Tạo tài khoản thành công");

        // Reset form
        setFullName("");
        setRegisterUsername("");
        setRegisterPassword("");
        setConfirmPassword("");

        // Chuyển lại form login
        setIsRegister(false);

        // Có thể tự điền username vừa đăng ký
        setUsername(registerUsername.trim());
      } else {
        toast.error(
          response?.message || "Tạo tài khoản thất bại",
        );
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi tạo tài khoản";

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

        {/* ================= LEFT ================= */}
        <div className={styles.loginLeft}>
          <div className={styles.logo}>
            <span><i className="bi bi-scissors"></i></span>
          </div>

          <h1>Barber Booking</h1>

          <p>
            Đặt lịch cắt tóc
            <br />
            nhanh chóng và tiện lợi
          </p>

          <div className={styles.decor}>
            <span />
            <span />
            <span />
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className={styles.loginRight}>
          <div className={styles.formWrapper}>

            {/* ================= LOGIN ================= */}
            {!isRegister && (
              <>
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
                      <span className={styles.icon}>
                        👤
                      </span>

                      <input
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value)
                        }
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className={styles.formGroup}>
                    <label>Mật khẩu</label>

                    <div className={styles.inputWrapper}>
                      <span className={styles.icon}>
                        🔒
                      </span>

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        autoComplete="current-password"
                      />

                      <button
                        type="button"
                        className={styles.showPassword}
                        onClick={() =>
                          setShowPassword(
                            !showPassword,
                          )
                        }
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
                        <span
                          className={styles.spinner}
                        />
                        Đang đăng nhập...
                      </>
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </form>

                {/* REGISTER LINK */}
                <div className={styles.registerText}>
                  Chưa có tài khoản?

                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </>
            )}

            {/* ================= REGISTER ================= */}
            {isRegister && (
              <>
                <div className={styles.header}>
                  <h2>Tạo tài khoản</h2>

                  <p>
                    Đăng ký tài khoản để đặt lịch
                    <br />
                    tại Barber Booking.
                  </p>
                </div>

                <form onSubmit={handleRegister}>

                  {/* FULL NAME */}
                  <div className={styles.formGroup}>
                    <label>Họ và tên</label>

                    <div className={styles.inputWrapper}>
                      <span className={styles.icon}>
                        👤
                      </span>

                      <input
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={fullName}
                        onChange={(e) =>
                          setFullName(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* USERNAME */}
                  <div className={styles.formGroup}>
                    <label>Tên đăng nhập</label>

                    <div className={styles.inputWrapper}>
                      <span className={styles.icon}>
                        👤
                      </span>

                      <input
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        value={registerUsername}
                        onChange={(e) =>
                          setRegisterUsername(
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className={styles.formGroup}>
                    <label>Mật khẩu</label>

                    <div className={styles.inputWrapper}>
                      <span className={styles.icon}>
                        🔒
                      </span>

                      <input
                        type={
                          showRegisterPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Nhập mật khẩu"
                        value={registerPassword}
                        onChange={(e) =>
                          setRegisterPassword(
                            e.target.value,
                          )
                        }
                      />

                      <button
                        type="button"
                        className={styles.showPassword}
                        onClick={() =>
                          setShowRegisterPassword(
                            !showRegisterPassword,
                          )
                        }
                      >
                        {showRegisterPassword
                          ? "🙈"
                          : "👁"}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className={styles.formGroup}>
                    <label>Nhập lại mật khẩu</label>

                    <div className={styles.inputWrapper}>
                      <span className={styles.icon}>
                        🔒
                      </span>

                      <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={styles.loginButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className={styles.spinner}
                        />
                        Đang tạo tài khoản...
                      </>
                    ) : (
                      "Tạo tài khoản"
                    )}
                  </button>
                </form>

                {/* BACK TO LOGIN */}
                <div className={styles.registerText}>
                  Đã có tài khoản?

                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                  >
                    Đăng nhập
                  </button>
                </div>
              </>
            )}

            <div className={styles.footer}>
              © 2026 Barber Booking
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}