import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../../assets/styles/ServiceAdmin/Detail.module.scss";
import { getByIdBarber } from "../../../api/BarberApi";

interface Barber {
  barberId: number;
  name: string;
  experience: string;
  phone: string;
  createDate: string;
  branch: {
    branchId: number;
    branchName: string;
    branchAddress: string;
    branchPhone: string;
  } | null;
}

export default function BaberDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [baber, setBaber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LẤY CHI TIẾT baber
  // =========================

  useEffect(() => {
    const loadBaberDetail = async () => {
      try {
        setLoading(true);

        if (!id) {
          toast.error("Không tìm thấy ID dịch vụ");
          navigate("/admin/baber");
          return;
        }

        const response = await getByIdBarber(Number(id));

        const data = response?.data || response;

        setBaber(data);
      } catch (error: any) {
        console.error("Lỗi lấy chi tiết baber:", error);

        toast.error(
          error?.response?.data?.message || "Không thể lấy thông tin dịch vụ",
        );

        navigate("/admin/barber");
      } finally {
        setLoading(false);
      }
    };

    loadBaberDetail();
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

    });
  };

  // =========================
  // IMAGE URL
  // =========================

  const getImageUrl = (url: string) => {
    if (!url) {
      return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `http://localhost:5021${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner}></div>

        <p>Đang tải thông tin dịch vụ...</p>
      </div>
    );
  }

  if (!baber) {
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
          <h1>Chi tiết thợ cắt tóc</h1>

          <p>Xem thông tin chi tiết của thợ cắt tóc</p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/admin/barber")}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Quay lại</span>
          </button>

          <button
            className={styles.editBtn}
            onClick={() => navigate(`/admin/barber/update/${baber.barberId}`)}
          >
            <i className="bi bi-pencil"></i>
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>

      {/* =========================
          baber INFORMATION
      ========================= */}

      <section className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <i className="bi bi-info-circle"></i>
          </div>

          <div>
            <h3>Thông tin thợ cắt tóc</h3>

            <p>Thông tin chi tiết của Baber</p>
          </div>
        </div>

        <div className={styles.infoGrid}>
          {/* SERVICE NAME */}

          <div className={styles.infoItem}>
            <span className={styles.label}>Tên Baber</span>

            <div className={styles.value}>
              <i className="bi bi-scissors"></i>

              {baber.name}
            </div>
          </div>

          {/* PRICE */}

          <div className={styles.infoItem}>
            <span className={styles.label}>Kinh nghiệm</span>

            <div className={`${styles.value} ${styles.price}`}>
              {baber.experience}
            </div>
          </div>

          {/* DURATION */}

          <div className={styles.infoItem}>
            <span className={styles.label}>Số điện thoại</span>

            <div className={styles.value}>
              <i className="bi bi-phone"></i>

              {baber.phone}
            </div>
          </div>

          {/* STATUS */}

          <div className={styles.infoItem}>
            <span className={styles.label}>Chi nhánh</span>
            <div className={styles.value}>{baber?.branch?.branchName}</div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>
              <i className="bi bi-calendar3"></i> 
               Ngày tạo
            </span>

            <strong>{formatDate(baber.createDate)}</strong>
          </div>
        </div>
      </section>

    </div>
  );
}
