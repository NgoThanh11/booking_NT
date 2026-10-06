import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../../assets/styles/ServiceAdmin/Detail.module.scss";
import { GetServiceDetail } from "../../../api/ServiceApi";

interface Service {
  id: number;
  name: string;
  url: string;
  description: string;
  price: number;
  durationMinutes: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [service, setService] = useState<Service | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // =========================
  // LẤY CHI TIẾT DỊCH VỤ
  // =========================

  useEffect(() => {
    const loadServiceDetail = async () => {
      try {
        setLoading(true);

        if (!id) {
          toast.error("Không tìm thấy ID dịch vụ");
          navigate("/admin/Service");
          return;
        }

        const response = await GetServiceDetail(Number(id));

        const data = response?.data || response;

        setService(data);
      } catch (error: any) {
        console.error(
          "Lỗi lấy chi tiết dịch vụ:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Không thể lấy thông tin dịch vụ"
        );

        navigate("/admin/Service");
      } finally {
        setLoading(false);
      }
    };

    loadServiceDetail();
  }, [id, navigate]);

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

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
  // IMAGE URL
  // =========================

  const getImageUrl = (url: string) => {
    if (!url) {
      return "";
    }

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
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

  if (!service) {
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
          <h1>Chi tiết dịch vụ</h1>

          <p>
            Xem thông tin chi tiết của dịch vụ
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.backBtn}
            onClick={() =>
              navigate("/admin/Service")
            }
          >
            <i className="bi bi-arrow-left"></i>
            <span>Quay lại</span>
          </button>

          <button
            className={styles.editBtn}
            onClick={() =>
              navigate(
                `/admin/Service/update/${service.id}`
              )
            }
          >
            <i className="bi bi-pencil"></i>
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>

      {/* =========================
          SERVICE OVERVIEW
      ========================= */}

      <section className={styles.overviewCard}>
        {/* IMAGE */}

        <div className={styles.imageWrapper}>
          {service.url ? (
            <img
              src={getImageUrl(service.url)}
              alt={service.name}
              className={styles.serviceImage}
            />
          ) : (
            <div className={styles.noImage}>
              <i className="bi bi-image"></i>

              <span>Chưa có hình ảnh</span>
            </div>
          )}
        </div>

        {/* INFO */}

        <div className={styles.overviewInfo}>
          <div className={styles.serviceId}>
            DỊCH VỤ #{service.id}
          </div>

          <h2>{service.name}</h2>

          <div className={styles.overviewPrice}>
            {formatPrice(service.price)}đ
          </div>

          <div className={styles.overviewMeta}>
            <div className={styles.metaItem}>
              <i className="bi bi-clock"></i>

              <span>
                {service.durationMinutes} phút
              </span>
            </div>

            <span
              className={`${styles.status} ${
                service.status
                  ? styles.active
                  : styles.inactive
              }`}
            >
              <span className={styles.statusDot}></span>

              {service.status
                ? "Đang hoạt động"
                : "Đã ngừng hoạt động"}
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          SERVICE INFORMATION
      ========================= */}

      <section className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <i className="bi bi-info-circle"></i>
          </div>

          <div>
            <h3>Thông tin dịch vụ</h3>

            <p>
              Thông tin chi tiết của dịch vụ
            </p>
          </div>
        </div>

        <div className={styles.infoGrid}>
          {/* SERVICE NAME */}

          <div className={styles.infoItem}>
            <span className={styles.label}>
              Tên dịch vụ
            </span>

            <div className={styles.value}>
              <i className="bi bi-scissors"></i>

              {service.name}
            </div>
          </div>

          {/* PRICE */}

          <div className={styles.infoItem}>
            <span className={styles.label}>
              Giá dịch vụ
            </span>

            <div
              className={`${styles.value} ${styles.price}`}
            >
              <i className="bi bi-currency-dollar"></i>

              {formatPrice(service.price)}đ
            </div>
          </div>

          {/* DURATION */}

          <div className={styles.infoItem}>
            <span className={styles.label}>
              Thời gian thực hiện
            </span>

            <div className={styles.value}>
              <i className="bi bi-clock"></i>

              {service.durationMinutes} phút
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
                  service.status
                    ? styles.active
                    : styles.inactive
                }`}
              >
                <span
                  className={styles.statusDot}
                ></span>

                {service.status
                  ? "Đang hoạt động"
                  : "Đã ngừng hoạt động"}
              </span>
            </div>
          </div>

          {/* CREATED */}

          <div className={styles.infoItem}>
            <span className={styles.label}>
              Ngày tạo
            </span>

            <div className={styles.value}>
              <i className="bi bi-calendar-plus"></i>

              {formatDate(service.createdAt)}
            </div>
          </div>

          {/* UPDATED */}

          <div className={styles.infoItem}>
            <span className={styles.label}>
              Cập nhật lần cuối
            </span>

            <div className={styles.value}>
              <i className="bi bi-calendar-check"></i>

              {formatDate(service.updatedAt)}
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          DESCRIPTION
      ========================= */}

      <section className={styles.descriptionCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <i className="bi bi-card-text"></i>
          </div>

          <div>
            <h3>Mô tả dịch vụ</h3>

            <p>
              Nội dung giới thiệu về dịch vụ
            </p>
          </div>
        </div>

        <div className={styles.description}>
          {service.description ? (
            <p>{service.description}</p>
          ) : (
            <div className={styles.emptyDescription}>
              <i className="bi bi-file-earmark-text"></i>

              <span>
                Dịch vụ chưa có mô tả
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}