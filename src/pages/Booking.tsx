import styles from "../../src/assets/styles/Booking.module.scss";
import SelectCustom from "../components/Select/select";
const options = [
  { value: "cs1", label: "Cơ sở Hà Nội" },
  { value: "cs2", label: "Cơ sở Thanh Hóa" },
];

export default function Booking() {
  return (
    <section className={styles.booking}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2>Đặt lịch cắt tóc</h2>
          <p>Điền đầy đủ thông tin để đặt lịch với barber yêu thích.</p>
        </div>

        <form className={styles.form}>
          <div className={styles.group}>
            <label>Cơ sở</label>
            <SelectCustom options={options} placeholder="Chọn cơ sở" />
          </div>

          <div className={styles.group}>
            <label>Ngày</label>
            <input type="date" />
          </div>

          <div className={styles.group}>
            <label>Giờ</label>
            <input type="time" />
          </div>

          <div className={styles.group}>
            <label>Thợ cắt</label>
            <SelectCustom options={options} placeholder="Chọn Barber" />
          </div>

          <div className={`${styles.group} ${styles.full}`}>
            <label>Dịch vụ</label>
            <select>
              <option>Chọn dịch vụ</option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Họ và tên</label>
            <input type="text" placeholder="Nhập họ tên" />
          </div>

          <div className={styles.group}>
            <label>Số điện thoại</label>
            <input type="text" placeholder="Nhập số điện thoại" />
          </div>

          <div className={styles.group}>
            <label>Email</label>
            <input type="email" placeholder="Nhập email" />
          </div>

          <div className={styles.group}>
            <label>Mã giảm giá</label>
            <input type="text" placeholder="Nhập mã giảm giá" />
          </div>

          <div className={`${styles.group} ${styles.full}`}>
            <button type="submit">Đặt lịch ngay</button>
          </div>
        </form>
      </div>
    </section>
  );
}
