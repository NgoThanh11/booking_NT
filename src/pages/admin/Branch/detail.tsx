import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import styles from "../../../assets/styles/BranchDetail.module.scss";

import { getBranchById } from "../../../api/BranchApi";
// import { getBarbersByBranch } from "../../../api/BarberApi";

interface Branch {
  branchId: number;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  createdAt: string;
}

interface Barber {
  barberId: number;
  name: string;
  experience: string;
  branchId: number;
}

export default function BranchDetail() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [branch, setBranch] = useState<Branch | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingBarbers, setLoadingBarbers] = useState(true);

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date: string) => {
    if (!date) return "Chưa có";

    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // =========================
  // LOAD BRANCH DETAIL
  // =========================
  const loadBranchDetail = async () => {
    try {
      setLoading(true);

      if (!id) {
        toast.error("Không tìm thấy mã chi nhánh");
        return;
      }

      const branchId = Number(id);

      const response = await getBranchById(branchId);

      console.log("Branch detail:", response);

      setBranch(response);
    } catch (error: any) {
      console.error("Lỗi lấy chi tiết chi nhánh:", error);

      toast.error(
        error?.response?.data?.message || "Không thể lấy thông tin chi nhánh",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD BARBERS
  // =========================
  //   const loadBarbers = async () => {
  //     try {
  //       setLoadingBarbers(true);

  //       if (!id) return;

  //       const branchId = Number(id);

  //       const response = await getBarbersByBranch(branchId);

  //       console.log("Barbers by branch:", response);

  //       setBarbers(response || []);
  //     } catch (error: any) {
  //       console.error("Lỗi lấy Barber:", error);

  //       toast.error(
  //         error?.response?.data?.message ||
  //           "Không thể lấy danh sách Barber"
  //       );
  //     } finally {
  //       setLoadingBarbers(false);
  //     }
  //   };

  // =========================
  // EFFECT
  // =========================
  useEffect(() => {
    loadBranchDetail();
    // loadBarbers();
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className={styles.page}>
        <Toaster position="top-right" />

        <div className={styles.loading}>
          <div className={styles.spinner}></div>

          <p>Đang tải thông tin chi nhánh...</p>
        </div>
      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================
  if (!branch) {
    return (
      <div className={styles.page}>
        <Toaster position="top-right" />

        <div className={styles.notFound}>
          <i className="bi bi-building-x"></i>

          <h2>Không tìm thấy chi nhánh</h2>

          <p>Chi nhánh không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>

          <button
            className={styles.backBtn}
            onClick={() => navigate("/admin/Branch")}
          >
            <i className="bi bi-arrow-left"></i>
            Quay lại danh sách
          </button>
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

      {/* =========================
          HEADER
      ========================= */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backIconBtn}
            title="Quay lại"
            onClick={() => navigate("/admin/Branch")}
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <div>
            <div className={styles.breadcrumb}>
              Quản lý chi nhánh
              <i className="bi bi-chevron-right"></i>
              Chi tiết
            </div>

            <h1>{branch.branchName}</h1>

            <p>Thông tin chi tiết chi nhánh</p>
          </div>
        </div>
      </div>

      {/* =========================
          BRANCH INFORMATION
      ========================= */}
      <section className={styles.infoCard}>
        <div className={styles.cardTitle}>
          <div className={styles.titleIcon}>
            <i className="bi bi-building"></i>
          </div>

          <div>
            <h3>Thông tin chi nhánh</h3>

            <p>Thông tin cơ bản của chi nhánh</p>
          </div>
        </div>

        <div className={styles.infoGrid}>
          {/* NAME */}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              <i className="bi bi-building"></i>
              Tên chi nhánh
            </span>

            <strong>{branch.branchName}</strong>
          </div>

          {/* PHONE */}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              <i className="bi bi-telephone"></i>
              Số điện thoại
            </span>

            <strong>{branch.branchPhone || "Chưa có"}</strong>
          </div>

          {/* ADDRESS */}
          <div className={`${styles.infoItem} ${styles.fullWidth}`}>
            <span className={styles.label}>
              <i className="bi bi-geo-alt"></i>
              Địa chỉ
            </span>

            <strong>{branch.branchAddress || "Chưa có địa chỉ"}</strong>
          </div>

          {/* CREATED DATE */}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              <i className="bi bi-calendar3"></i>
              Ngày tạo
            </span>

            <strong>{formatDate(branch.createdAt)}</strong>
          </div>

          {/* ID */}
          <div className={styles.infoItem}>
            <span className={styles.label}>
              <i className="bi bi-hash"></i>
              Mã chi nhánh
            </span>

            <strong>#{branch.branchId}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
