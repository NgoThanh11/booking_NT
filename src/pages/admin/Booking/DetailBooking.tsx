import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../../assets/styles/DetailBooking.module.scss";
import { getDetailBooking } from "../../../api/BookingApi";

interface BookingService {
  id: number;
  bookingId: number;
  serviceId: number;
  service_text: string;
  price: number;
}

interface BookingDetailData {
  id: number;
  branchId: number;
  barberId: number;
  customerName: string;
  phone: string;
  bookingDate: string;
  bookingTime: string;
  email?: string;
  voucher?: string;
  barber_text: string;
  branch_text: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  services: BookingService[];
}

const statusText = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<BookingDetailData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!id) return;

        const response = await getDetailBooking(Number(id));

        if (response?.success) {
          setBooking(response.data);
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const formatDate = (date: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatPrice = (price: number | null | undefined) => {
    return (price ?? 0).toLocaleString("vi-VN") + " đ";
  };

  const totalPrice =
    booking?.services?.reduce(
      (total, service) => total + (service.price ?? 0),
      0,
    ) ?? 0;

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Đang tải thông tin đặt lịch...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>!</div>

        <h2>Không tìm thấy lịch đặt</h2>

        <p>Lịch đặt #{id} không tồn tại hoặc đã bị xóa.</p>

        <button className={styles.backBtn} onClick={() => navigate("/booking")}>
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div>
      

          <div className={styles.titleRow}>
            <div>
              <h1>Chi tiết đặt lịch</h1>

              <p>Thông tin chi tiết lịch đặt #{booking.id}</p>
            </div>

            <span
              className={`${styles.status} ${
                styles[booking.status.toLowerCase()]
              }`}
            >
              <i />
              {statusText[booking.status]}
            </span>
          </div>
        </div>
      </div>

      {/* CUSTOMER */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3>Thông tin khách hàng</h3>
            <span>Thông tin người đặt lịch</span>
          </div>
        </div>

        <div className={styles.customerInfo}>
          <div className={styles.customerAvatar}>
            {booking.customerName.charAt(0)}
          </div>

          <div className={styles.customerMain}>
            <h2>{booking.customerName}</h2>

            <div className={styles.contactList}>
              <div>
                <span className={styles.icon}>☎</span>
                <span>{booking.phone}</span>
              </div>

              {booking.email && (
                <div>
                  <span className={styles.icon}>✉</span>
                  <span>{booking.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.grid}>
        {/* BOOKING INFO */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Thông tin lịch hẹn</h3>
              <span>Thời gian và địa điểm</span>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>📅</div>

              <div>
                <span>Ngày đặt lịch</span>
                <strong>{formatDate(booking.bookingDate)}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>⏰</div>

              <div>
                <span>Giờ đặt lịch</span>
                <strong>{booking.bookingTime}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>✂</div>

              <div>
                <span>Barber</span>
                <strong>{booking.barber_text}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>📍</div>

              <div>
                <span>Chi nhánh</span>
                <strong>{booking.branch_text}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* VOUCHER */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Voucher</h3>
              <span>Mã giảm giá</span>
            </div>
          </div>

          {booking.voucher ? (
            <div className={styles.voucher}>
              <span className={styles.voucherIcon}>🎟</span>

              <div>
                <span>Mã voucher</span>
                <strong>{booking?.voucher}</strong>
              </div>
            </div>
          ) : (
            <div className={styles.noVoucher}>Không sử dụng voucher</div>
          )}
        </section>
      </div>

      {/* SERVICES */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3>Dịch vụ đã đặt</h3>

            <span>{booking?.services?.length} dịch vụ</span>
          </div>
        </div>

        <div className={styles.serviceList}>
          {booking.services?.map((service, index) => (
            <div className={styles?.serviceItem} key={service.id}>
              <div className={styles?.serviceNumber}>{index + 1}</div>

              <div className={styles.serviceInfo}>
                <strong>{service.service_text}</strong>

                <span>Dịch vụ #{service.serviceId}</span>
              </div>

              <strong className={styles.servicePrice}>
                {formatPrice(service.price)}
              </strong>
            </div>
          ))}
        </div>

        <div className={styles.total}>
          <span>Tổng tiền</span>

          <strong>{formatPrice(totalPrice)}</strong>
        </div>
      </section>

      {/* ACTION */}
      <div className={styles.footerActions}>
        <button className={styles.secondaryBtn} onClick={() => navigate("/admin/Booking")}>
          ← Quay lại
        </button>

       
      </div>
    </div>
  );
}
