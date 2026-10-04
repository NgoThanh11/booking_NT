import styles from "../../assets/styles/Dashboard.module.scss";

const bookings = [
  {
    id: 1,
    customer: "Nguyễn Văn A",
    phone: "0987654321",
    service: "Cắt tóc nam",
    barber: "Ngo Trung Thanh",
    date: "10/10/2026 08:00",
    status: "Đã xác nhận",
  },
  {
    id: 2,
    customer: "Trần Minh Hoàng",
    phone: "0978123456",
    service: "Uốn tóc",
    barber: "Lê Văn Hùng",
    date: "10/10/2026 09:30",
    status: "Đã xác nhận",
  },
  {
    id: 3,
    customer: "Lê Thị Bích",
    phone: "0965432109",
    service: "Nhuộm tóc",
    barber: "Đỗ Văn Cường",
    date: "10/10/2026 11:00",
    status: "Chờ xử lý",
  },
  {
    id: 4,
    customer: "Phạm Đức Anh",
    phone: "0912345678",
    service: "Combo VIP",
    barber: "Ngo Trung Thanh",
    date: "10/10/2026 13:30",
    status: "Đang diễn ra",
  },
  {
    id: 5,
    customer: "Hoàng Văn Nam",
    phone: "0909876543",
    service: "Cắt tỉa râu",
    barber: "Lê Văn Hùng",
    date: "10/10/2026 15:00",
    status: "Chờ xác nhận",
  },
];

const todayBookings = [
  ["08:00", "Nguyễn Văn A", "Cắt tóc nam", "Đã xác nhận"],
  ["09:30", "Trần Minh Hoàng", "Uốn tóc", "Đã xác nhận"],
  ["11:00", "Lê Thị Bích", "Nhuộm tóc", "Chờ xử lý"],
  ["13:30", "Phạm Đức Anh", "Combo VIP", "Đang diễn ra"],
  ["15:00", "Hoàng Văn Nam", "Cắt tỉa râu", "Chờ xác nhận"],
];

const revenue = [
  4500000,
  6500000,
  7200000,
  8500000,
  10200000,
  9200000,
  15000000,
];

export default function Dashboard() {
  const maxRevenue = Math.max(...revenue);

  return (
    <div className={styles.dashboard}>
      <div className={styles.pageTitle}>
        <div>
          <h1>Dashboard</h1>
          <p>Tổng quan hoạt động của hệ thống đặt lịch Barber</p>
        </div>

        <button className={styles.dateButton}>
          ▣ &nbsp; Thứ 6, 10/10/2026 &nbsp;⌄
        </button>
      </div>

      {/* KPI */}
      <div className={styles.stats}>
        <StatCard
          icon="▣"
          title="Tổng số booking"
          value="128"
          growth="12% so với tuần trước"
          type="blue"
        />

        <StatCard
          icon="▣"
          title="Booking hôm nay"
          value="18"
          growth="5% so với hôm qua"
          type="green"
        />

        <StatCard
          icon="◉"
          title="Doanh thu hôm nay"
          value="12.450.000 đ"
          growth="18% so với hôm qua"
          type="orange"
        />

        <StatCard
          icon="♟"
          title="Tổng khách hàng"
          value="356"
          growth="10% so với tháng trước"
          type="purple"
        />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.left}>
          {/* Chart */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3>Doanh thu 7 ngày gần nhất</h3>
              </div>

              <select>
                <option>Doanh thu</option>
                <option>Booking</option>
              </select>
            </div>

            <div className={styles.chart}>
              <div className={styles.yAxis}>
                <span>20M</span>
                <span>15M</span>
                <span>10M</span>
                <span>5M</span>
                <span>0</span>
              </div>

              <div className={styles.chartBody}>
                <div className={styles.gridLines}>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>

                <div className={styles.bars}>
                  {revenue.map((item, index) => (
                    <div className={styles.barColumn} key={item}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${(item / maxRevenue) * 100}%`,
                        }}
                      />

                      <span>
                        {String(4 + index).padStart(2, "0")}/10
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Booking table */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Danh sách lịch đặt gần đây</h3>

              <button className={styles.viewAll}>
                Xem tất cả →
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Khách hàng</th>
                    <th>SĐT</th>
                    <th>Dịch vụ</th>
                    <th>Barber</th>
                    <th>Ngày đặt</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>

                      <td>
                        <div className={styles.customer}>
                          <div className={styles.customerAvatar}>
                            {booking.customer.charAt(0)}
                          </div>

                          {booking.customer}
                        </div>
                      </td>

                      <td>{booking.phone}</td>
                      <td>{booking.service}</td>
                      <td>{booking.barber}</td>
                      <td>{booking.date}</td>

                      <td>
                        <Status status={booking.status} />
                      </td>

                      <td>
                        <button className={styles.detailButton}>
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>▣ &nbsp; Lịch hôm nay</h3>

              <button className={styles.viewAll}>
                Xem tất cả →
              </button>
            </div>

            <div className={styles.todayList}>
              {todayBookings.map((booking, index) => (
                <div className={styles.todayItem} key={booking[0]}>
                  <div className={styles.time}>{booking[0]}</div>

                  <div className={styles.timelineDot} />

                  <div className={styles.todayInfo}>
                    <strong>{booking[1]}</strong>
                    <span>{booking[2]}</span>
                  </div>

                  <Status status={booking[3]} />
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>▣ &nbsp; Thống kê nhanh</h3>
            </div>

            <div className={styles.quickStats}>
              <QuickStat icon="▣" title="Dịch vụ" value="6" />
              <QuickStat icon="♙" title="Barber" value="4" />
              <QuickStat icon="⌖" title="Chi nhánh" value="2" />
              <QuickStat icon="♟" title="Khách hàng" value="356" />
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Doanh thu theo dịch vụ</h3>
            </div>

            <RevenueItem name="Combo VIP" percent={42} price="5.230.000 đ" />
            <RevenueItem name="Nhuộm tóc" percent={25} price="3.120.000 đ" />
            <RevenueItem name="Uốn tóc" percent={18} price="2.250.000 đ" />
            <RevenueItem name="Cắt tóc nam" percent={10} price="1.210.000 đ" />
            <RevenueItem name="Khác" percent={5} price="640.000 đ" />
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  growth,
  type,
}: {
  icon: string;
  title: string;
  value: string;
  growth: string;
  type: string;
}) {
  return (
    <div className={styles.statCard}>
      <div className={`${styles.statIcon} ${styles[type]}`}>
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>↑ {growth}</small>
      </div>
    </div>
  );
}

function QuickStat({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className={styles.quickStat}>
      <div>{icon}</div>

      <span>
        {title}
        <strong>{value}</strong>
      </span>
    </div>
  );
}

function RevenueItem({
  name,
  percent,
  price,
}: {
  name: string;
  percent: number;
  price: string;
}) {
  return (
    <div className={styles.revenueItem}>
      <div className={styles.revenueTop}>
        <span>{name}</span>
        <small>{percent}%</small>
        <strong>{price}</strong>
      </div>

      <div className={styles.progress}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const className =
    status === "Đã xác nhận"
      ? styles.confirmed
      : status === "Đang diễn ra"
      ? styles.running
      : status === "Chờ xử lý"
      ? styles.pending
      : styles.waiting;

  return <span className={`${styles.status} ${className}`}>{status}</span>;
}