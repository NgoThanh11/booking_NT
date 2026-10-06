import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../../assets/styles/UserAdmin/UserDetail.module.scss";
import { getUserById } from "../../../api/UserAdmin";

interface User {
  id: number;
  username: string;
  fullName: string;
  role: "Admin" | "Customer";
  isActive: boolean;
  createdAt: string;
}

export default function UserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LẤY CHI TIẾT USER
  // =========================
  useEffect(() => {
    const loadUserDetail = async () => {
      try {
        setLoading(true);

        if (!id) {
          toast.error("Không tìm thấy ID người dùng");
          navigate("/admin/User");
          return;
        }

        const response = await getUserById(Number(id));

        const data = response?.data || response;

        setUser(data);
      } catch (error: any) {
        console.error(
          "Lỗi lấy chi tiết người dùng:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Không thể lấy thông tin người dùng"
        );

        navigate("/admin/User");
      } finally {
        setLoading(false);
      }
    };

    loadUserDetail();
  }, [id, navigate]);

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date: string) => {
    if (!date) return "--";

    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner}></div>

        <p>
          Đang tải thông tin người dùng...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
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

      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.pageHeader}>
        <div>
          <h1>Chi tiết người dùng</h1>

          <p>
            Xem thông tin tài khoản người dùng
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.backBtn}
            onClick={() =>
              navigate("/admin/user")
            }
          >
            <i className="bi bi-arrow-left"></i>
            <span>Quay lại</span>
          </button>

          <button
            className={styles.editBtn}
            onClick={() =>
              navigate(
                `/admin/user/update/${user.id}`
              )
            }
          >
            <i className="bi bi-pencil"></i>
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>

      {/* =========================
          USER PROFILE
      ========================= */}

      <section className={styles.profileCard}>
        <div className={styles.avatar}>
          {user.fullName
            ? user.fullName
                .charAt(0)
                .toUpperCase()
            : "U"}
        </div>

        <div className={styles.profileInfo}>
          <h2>{user.fullName}</h2>

          <p>
            <i className="bi bi-person"></i>
            @{user.username}
          </p>

          <div className={styles.profileBadges}>
            <span
              className={`${styles.role} ${
                user.role === "Admin"
                  ? styles.admin
                  : styles.customer
              }`}
            >
              <i
                className={
                  user.role === "Admin"
                    ? "bi bi-shield-check"
                    : "bi bi-person"
                }
              ></i>

              {user.role}
            </span>

            <span
              className={`${styles.status} ${
                user.isActive
                  ? styles.active
                  : styles.inactive
              }`}
            >
              <span className={styles.statusDot}></span>

              {user.isActive
                ? "Đang hoạt động"
                : "Đã khóa"}
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          INFORMATION
      ========================= */}

      <section className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <i className="bi bi-person-vcard"></i>
          </div>

          <div>
            <h3>Thông tin tài khoản</h3>

            <p>
              Thông tin chi tiết của người dùng
            </p>
          </div>
        </div>

        <div className={styles.infoGrid}>
          {/* ID */}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              ID người dùng
            </span>

            <div className={styles.value}>
              <i className="bi bi-hash"></i>
              {user.id}
            </div>
          </div>

          {/* USERNAME */}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              Username
            </span>

            <div className={styles.value}>
              <i className="bi bi-person"></i>
              {user.username}
            </div>
          </div>

          {/* FULL NAME */}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              Họ và tên
            </span>

            <div className={styles.value}>
              <i className="bi bi-person-vcard"></i>
              {user.fullName}
            </div>
          </div>

          {/* ROLE */}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              Vai trò
            </span>

            <div className={styles.value}>
              <i className="bi bi-shield-check"></i>

              <span
                className={`${styles.role} ${
                  user.role === "Admin"
                    ? styles.admin
                    : styles.customer
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* STATUS */}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              Trạng thái
            </span>

            <div className={styles.value}>
              <span
                className={`${styles.status} ${
                  user.isActive
                    ? styles.active
                    : styles.inactive
                }`}
              >
                <span
                  className={
                    styles.statusDot
                  }
                ></span>

                {user.isActive
                  ? "Đang hoạt động"
                  : "Đã khóa"}
              </span>
            </div>
          </div>

          {/* CREATED DATE */}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              Ngày tạo
            </span>

            <div className={styles.value}>
              <i className="bi bi-calendar3"></i>

              {formatDate(user.createdAt)}
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          SECURITY
      ========================= */}

     
    </div>
  );
}