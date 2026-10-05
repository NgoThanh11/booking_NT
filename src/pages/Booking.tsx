import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../src/assets/styles/Booking.module.scss";
import SelectCustom from "../components/Select/select";

import { getAllBranches } from "../api/BranchApi";
import { getAllBarbers } from "../api/BarberApi";
import { GetAllServices } from "../api/ServiceApi";
import { createBooking } from "../api/BookingApi";

export default function Booking() {
  const [branches, setBranches] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [barberId, setBarberId] = useState<number | null>(null);
  const [serviceIds, setServiceIds] = useState<number[]>([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [voucher, setVoucher] = useState("");

  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingBarbers, setLoadingBarbers] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successBooking, setSuccessBooking] = useState<any>(null);
  const [errors, setErrors] = useState<{
    branchId?: string;
    barberId?: string;
    serviceIds?: string;
    bookingDate?: string;
    bookingTime?: string;
    customerName?: string;
    phone?: string;
    email?: string;
  }>({});

  // ================================
  // LẤY BRANCH
  // ================================
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);

        const data = await getAllBranches();

        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu chi nhánh không hợp lệ");
        }

        setBranches(data);
      } catch (error) {
        console.error(error);

        toast.error("Không thể tải danh sách chi nhánh");
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  // ================================
  // LẤY BARBER
  // ================================
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setLoadingBarbers(true);

        const data = await getAllBarbers();

        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu barber không hợp lệ");
        }

        setBarbers(data);
      } catch (error) {
        console.error(error);

        toast.error("Không thể tải danh sách barber");
      } finally {
        setLoadingBarbers(false);
      }
    };

    fetchBarbers();
  }, []);
  // LẤY SERVICE
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await GetAllServices();

        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu dịch vụ không hợp lệ");
        }

        setServices(data);
      } catch (error) {
        console.error(error);

        toast.error("Không thể tải danh sách dịch vụ");
      }
    };

    fetchServices();
  }, []);

  // OPTIONS
  const branchOptions = branches.map((branch) => ({
    value: branch.branchId,
    label: `${branch.branchName} - ${branch.branchAddress}`,
  }));

  const barberOptions = barbers
    .filter((barber) => barber.branchId === branchId)
    .map((barber) => ({
      value: barber.barberId,
      label: `${barber.name} - ${barber.experience || ""}`,
    }));

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.name,
  }));

  // VALIDATE
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!branchId) {
      newErrors.branchId = "Vui lòng chọn cơ sở";
    }

    if (!bookingDate) {
      newErrors.bookingDate = "Vui lòng chọn ngày";
    }

    if (!bookingTime) {
      newErrors.bookingTime = "Vui lòng chọn giờ";
    }

    if (!barberId) {
      newErrors.barberId = "Vui lòng chọn barber";
    }

    if (serviceIds.length === 0) {
      newErrors.serviceIds = "Vui lòng chọn ít nhất một dịch vụ";
    }

    if (!customerName.trim()) {
      newErrors.customerName = "Vui lòng nhập họ và tên";
    } else if (customerName.trim().length < 2) {
      newErrors.customerName = "Họ và tên phải có ít nhất 2 ký tự";
    }

    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = "Email không hợp lệ";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    // const isValid = validateForm();

    // if (!isValid) {
    //   toast.error("Vui lòng kiểm tra lại thông tin");

    //   return;
    // }

    const payload = {
      branchId,
      barberId,
      serviceIds,
      Branch_text:
        branchOptions.find((item) => item.value === branchId)?.label || "",
      Barber_text:
        barberOptions.find((item) => item.value === barberId)?.label || "",
      customerName: customerName.trim(),

      phone: phone.trim(),

      bookingDate: `${bookingDate}T00:00:00.000Z`,

      bookingTime,

      email: email.trim(),

      voucher: voucher.trim(),

      status: "PENDING",
    };
    //#region Api thêm mới đặt lịch
    try {
      setLoadingSubmit(true);

      const response = await createBooking(payload);

      console.log("CREATE BOOKING:", response);

      toast.success("Đặt lịch thành công!", {
        duration: 3000,
      });
      if (response?.success) {
        setSuccessBooking(response.data);
        setShowSuccess(true);
      }

      // ================================
      // RESET FORM
      // ================================
      setBranchId(null);
      setBarberId(null);
      setServiceIds([]);

      setBookingDate("");
      setBookingTime("");

      setCustomerName("");
      setPhone("");
      setEmail("");
      setVoucher("");

      setErrors({});
    } catch (error: any) {
      console.error("CREATE BOOKING ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        "Đặt lịch thất bại";

      toast.error(message, {
        duration: 4000,
      });
    } finally {
      setLoadingSubmit(false);
    }
    //#endregion
  };

  return (
    <>
      {/* ================================
          TOAST
      ================================= */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />

      <section className={styles.booking}>
        <div className={styles.container}>
          {/* ================================
              HEADING
          ================================= */}
          <div className={styles.heading}>
            <h2>Đặt lịch cắt tóc</h2>

            <p>Điền đầy đủ thông tin để đặt lịch với barber yêu thích.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* ================================
                CƠ SỞ
            ================================= */}
            <div className={styles.group}>
              <label>Cơ sở</label>

              <SelectCustom
                options={branchOptions}
                placeholder={
                  loadingBranches ? "Đang tải cơ sở..." : "Chọn cơ sở"
                }
                value={
                  branchOptions.find((item) => item.value === branchId) || null
                }
                onChange={(option: { value: number; label: string } | null) => {
                  setBranchId(option?.value ?? null);

                  setErrors((prev) => ({
                    ...prev,
                    branchId: undefined,
                  }));
                }}
              />

              {errors.branchId && (
                <small style={{ color: "red" }}>{errors.branchId}</small>
              )}
            </div>

            {/* ================================
                NGÀY
            ================================= */}
            <div className={styles.group}>
              <label>Ngày</label>

              <input
                type="date"
                value={bookingDate}
                onChange={(e) => {
                  setBookingDate(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    bookingDate: undefined,
                  }));
                }}
              />

              {errors.bookingDate && (
                <small style={{ color: "red" }}>{errors.bookingDate}</small>
              )}
            </div>

            {/* ================================
                GIỜ
            ================================= */}
            <div className={styles.group}>
              <label>Giờ</label>

              <input
                type="time"
                value={bookingTime}
                onChange={(e) => {
                  setBookingTime(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    bookingTime: undefined,
                  }));
                }}
              />

              {errors.bookingTime && (
                <small style={{ color: "red" }}>{errors.bookingTime}</small>
              )}
            </div>

            {/* ================================
                BARBER
            ================================= */}
            <div className={styles.group}>
              <label>Thợ cắt</label>

              <SelectCustom
                options={barberOptions}
                placeholder={
                  loadingBarbers ? "Đang tải Barber..." : "Chọn Barber"
                }
                value={
                  barberOptions.find((item) => item.value === barberId) || null
                }
                onChange={(option: { value: number; label: string } | null) => {
                  setBarberId(option?.value ?? null);

                  setErrors((prev) => ({
                    ...prev,
                    barberId: undefined,
                  }));
                }}
              />

              {errors.barberId && (
                <small style={{ color: "red" }}>{errors.barberId}</small>
              )}
            </div>

            {/* ================================
                SERVICE
            ================================= */}
            <div className={`${styles.group} ${styles.full}`}>
              <label>Dịch vụ</label>

              <SelectCustom
                options={serviceOptions}
                placeholder="Vui lòng chọn dịch vụ"
                isMulti
                value={serviceOptions.filter((item) =>
                  serviceIds.includes(item.value),
                )}
                onChange={(options: { value: number; label: string }[]) => {
                  setServiceIds(options.map((item) => item.value));

                  setErrors((prev) => ({
                    ...prev,
                    serviceIds: undefined,
                  }));
                }}
              />

              {errors.serviceIds && (
                <small style={{ color: "red" }}>{errors.serviceIds}</small>
              )}
            </div>

            {/* ================================
                HỌ TÊN
            ================================= */}
            <div className={styles.group}>
              <label>Họ và tên</label>

              <input
                type="text"
                placeholder="Nhập họ tên"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    customerName: undefined,
                  }));
                }}
              />

              {errors.customerName && (
                <small style={{ color: "red" }}>{errors.customerName}</small>
              )}
            </div>

            {/* ================================
                PHONE
            ================================= */}
            <div className={styles.group}>
              <label>Số điện thoại</label>

              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    phone: undefined,
                  }));
                }}
              />

              {errors.phone && (
                <small style={{ color: "red" }}>{errors.phone}</small>
              )}
            </div>

            {/* ================================
                EMAIL
            ================================= */}
            <div className={styles.group}>
              <label>Email</label>

              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    email: undefined,
                  }));
                }}
              />

              {errors.email && (
                <small style={{ color: "red" }}>{errors.email}</small>
              )}
            </div>

            {/* ================================
                VOUCHER
            ================================= */}
            <div className={styles.group}>
              <label>Mã giảm giá</label>

              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
              />
            </div>

            {/* ================================
                SUBMIT
            ================================= */}
            <div className={`${styles.group} ${styles.full}`}>
              <button
                type="submit"
                disabled={loadingBranches || loadingBarbers || loadingSubmit}
              >
                {loadingSubmit ? "Đang đặt lịch..." : "Đặt lịch ngay"}
              </button>
            </div>
          </form>
        </div>
      </section>
      {showSuccess && (
        <div className={styles.successOverlay}>
          {" "}
          <div className={styles.successModal}>
            {" "}
            {/* ICON */}{" "}
            <div className={styles.successIcon}>
              {" "}
              <span>✓</span>{" "}
            </div>{" "}
            {/* TITLE */} <h2>Đặt lịch thành công!</h2>{" "}
            <p className={styles.successMessage}>
              {" "}
              Lịch hẹn của bạn đã được ghi nhận.{" "}
            </p>{" "}
            {/* BOOKING INFO */}{" "}
            {successBooking && (
              <div className={styles.bookingInfo}>
                {" "}
                <div className={styles.infoRow}>
                  {" "}
                  <span>Cơ sở</span>{" "}
                  <strong>{successBooking.branch_text}</strong>{" "}
                </div>{" "}
                <div className={styles.infoRow}>
                  <span>Dịch vụ</span>

                  <strong>
                    {successBooking.services?.map((service: any) => (
                      <div key={service.serviceId}>{service.serviceText}</div>
                    ))}
                  </strong>
                </div>
                <div className={styles.infoRow}>
                  {" "}
                  <span>Thợ cắt</span>{" "}
                  <strong>{successBooking.barber_text}</strong>{" "}
                </div>{" "}
                <div className={styles.infoRow}>
                  {" "}
                  <span>Ngày</span>{" "}
                  <strong>
                    {" "}
                    {new Date(successBooking.bookingDate).toLocaleDateString(
                      "vi-VN",
                    )}{" "}
                  </strong>{" "}
                </div>{" "}
                <div className={styles.infoRow}>
                  {" "}
                  <span>Giờ</span>{" "}
                  <strong>{successBooking.bookingTime}</strong>{" "}
                </div>{" "}
                <div className={styles.infoRow}>
                  {" "}
                  <span>Khách hàng</span>{" "}
                  <strong>{successBooking.customerName}</strong>{" "}
                </div>{" "}
              </div>
            )}{" "}
            {/* BUTTON */}{" "}
            <button
              type="button"
              className={styles.successButton}
              onClick={() => {
                toast.success("Cảm ơn quý khách đã đặt lịch!", {
                  duration: 5000,
                });

                setShowSuccess(false);
                setSuccessBooking(null);
              }}
            >
              Hoàn tất
            </button>
          </div>{" "}
        </div>
      )}
    </>
  );
}
