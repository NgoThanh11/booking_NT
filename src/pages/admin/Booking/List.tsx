import { useEffect, useState } from "react";
import styles from "../../../assets/styles/BookingAdmin.module.scss";
import { getAllBooking, updateBookingStatus } from "../../../api/BookingApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

interface Booking {
  id: number;
  customerName: string;
  phone: string;
  email: string;

  services: string[];

  barber: string;
  branch: string;

  bookingDate: string;
  date: string;
  time: string;

  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

const statusText: Record<Booking["status"], string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export default function BookingAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("ALL");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("vi-VN");
  };

  // GET ALL BOOKING

  const loadBookings = async () => {
    try {
      setLoading(true);

      const response = await getAllBooking();

      console.log("BOOKING API:", response);

      if (!response?.success) {
        console.error("API lấy danh sách booking thất bại:", response?.message);

        setBookings([]);
        return;
      }

      const data = response.data || [];

      const mappedBookings: Booking[] = data.map((item: any) => ({
        id: item.id,

        customerName: item.customerName,
        phone: item.phone,
        email: item.email || "",

        // Lấy tên dịch vụ
        services:
          item.services?.map((service: any) => service.service_text || "") ||
          [],

        // Barber
        barber: item.barber_text || "",

        // Branch
        branch: item.branch_text || "",

        // Dùng để filter
        bookingDate: item.bookingDate?.substring(0, 10) || "",

        // Dùng để hiển thị
        date: formatDate(item.bookingDate),

        time: item.bookingTime || "",

        status: item.status as Booking["status"],
      }));

      setBookings(mappedBookings);
    } catch (error) {
      console.error("Lỗi lấy danh sách đặt lịch:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CALL API WHEN OPEN PAGE
  // =====================================================

  useEffect(() => {
    loadBookings();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredBookings = bookings.filter((booking) => {
    const searchKeyword = keyword.toLowerCase().trim();

    const matchKeyword =
      booking.customerName.toLowerCase().includes(searchKeyword) ||
      booking.phone.includes(searchKeyword);

    const matchStatus = status === "ALL" || booking.status === status;

    const matchDate = !date || booking.bookingDate === date;

    return matchKeyword && matchStatus && matchDate;
  });

  // =====================================================
  // CONFIRM
  // =====================================================

  const handleUpdateStatus = async (
    id: number,
    newStatus: Booking["status"],
  ) => {
    try {
      const response = await updateBookingStatus(id, newStatus);

      console.log("eweeee", response);

      if (!response?.success) {
        toast.error(response?.message || "Cập nhật trạng thái thất bại");

        return;
      }

      // Cập nhật UI sau khi API thành công
      setBookings((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: newStatus,
              }
            : item,
        ),
      );
      toast.success(response?.message);
      console.log(response?.message);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái booking:", error);

      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
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
          <h1>Quản lý đặt lịch</h1>

          <p>Quản lý thông tin khách hàng và lịch đặt dịch vụ</p>
        </div>
      </div>

      {/* FILTER */}

      <section className={styles.filterCard}>
        <div className={styles.searchBox}>
          <span>⌕</span>

          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên khách hàng hoặc số điện thoại..."
          />
        </div>

        <div className={styles.filterItem}>
          <label>Từ ngày</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className={styles.filterItem}>
          <label>Đến ngày</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className={styles.filterItem}>
          <label>Trạng thái</label>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">Tất cả trạng thái</option>

            <option value="PENDING">Chờ xử lý</option>

            <option value="CONFIRMED">Đã xác nhận</option>

            <option value="COMPLETED">Hoàn thành</option>

            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        <button
          className={styles.resetBtn}
          onClick={() => {
            setKeyword("");
            setDate("");
            setStatus("ALL");
          }}
        >
          ↻ 
        </button>
      </section>

      {/* TABLE */}

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h3>Danh sách đặt lịch</h3>

            <span>Hiển thị {filteredBookings.length} lịch đặt</span>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Barber</th>
                <th>Chi nhánh</th>
                <th>Ngày / giờ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <div className={styles.empty}>
                      Đang tải danh sách đặt lịch...
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                /* EMPTY */

                <tr>
                  <td colSpan={8}>
                    <div className={styles.empty}>Không tìm thấy lịch đặt</div>
                  </td>
                </tr>
              ) : (
                /* DATA */

                filteredBookings.map((booking, index) => (
                  <tr key={booking.id}>
                    {/* ID */}

                    <td>
                      <strong className={styles.bookingId}>{index + 1}</strong>
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      <div className={styles.customer}>
                        <div>
                          <strong>{booking.customerName}</strong>

                          <span>{booking.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* SERVICES */}

                    <td>
                      <div className={styles.services}>
                        {booking.services.map((service, index) => (
                          <span key={`${service}-${index}`}>{service}</span>
                        ))}
                      </div>
                    </td>

                    {/* BARBER */}

                    <td>{booking.barber}</td>

                    {/* BRANCH */}

                    <td>
                      <span className={styles.branch}>{booking.branch}</span>
                    </td>

                    {/* DATE TIME */}

                    <td>
                      <div className={styles.datetime}>
                        <strong>{booking.date}</strong>

                        <span>{booking.time}</span>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td>
                      <Status status={booking.status} />
                    </td>

                    {/* ACTION */}

                    {/* ACTION */}
                    <td>
                      <div className={styles.actions}>
                        {/* CHI TIẾT */}
                        <button
                          className={styles.viewBtn}
                          title="Xem chi tiết"
                          onClick={() =>
                            navigate(`/admin/Booking/${booking.id}`)
                          }
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        {booking.status === "PENDING" && (
                          <>
                            {/* XÁC NHẬN */}
                            <button
                              className={styles.confirmBtn}
                              title="Xác nhận"
                              onClick={() =>
                                handleUpdateStatus(booking.id, "CONFIRMED")
                              }
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>

                            {/* HỦY */}
                            <button
                              className={styles.cancelBtn}
                              title="Hủy"
                              onClick={() =>
                                handleUpdateStatus(booking.id, "CANCELLED")
                              }
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </>
                        )}

                        {booking.status === "CONFIRMED" && (
                          <button
                            className={styles.completeBtn}
                            title="Hoàn thành"
                            onClick={() =>
                              handleUpdateStatus(booking.id, "COMPLETED")
                            }
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>
                        )}

                        {booking.status === "COMPLETED" && (
                          <button
                            className={styles.disabledBtn}
                            disabled
                            title="Đã hoàn thành"
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>
                        )}

                        {booking.status === "CANCELLED" && (
                          <button
                            className={styles.disabledBtn}
                            disabled
                            title="Đã hủy"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className={styles.pagination}>
          <span>
            Hiển thị{" "}
            {filteredBookings.length > 0
              ? `1 - ${filteredBookings.length}`
              : "0"}{" "}
            trong tổng số {filteredBookings.length}
          </span>

          <div>
            <button>‹</button>

            <button className={styles.current}>1</button>

            <button>›</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// =====================================================
// STATUS
// =====================================================

function Status({ status }: { status: Booking["status"] }) {
  return (
    <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>
      <i />

      {statusText[status]}
    </span>
  );
}
