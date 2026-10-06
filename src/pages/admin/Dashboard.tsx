import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../../assets/styles/Dashboard.module.scss";
import { dashboardApi } from "../../api/DashboardApi";

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await dashboardApi();

      if (response.success) {
        setDashboard(response);
      }
    } catch (error) {
      console.error("Lỗi lấy Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải dữ liệu Dashboard...</div>;
  }

  if (!dashboard) {
    return (
      <div className={styles.loading}>Không thể tải dữ liệu Dashboard</div>
    );
  }

  const { stats, revenue7Days, recentBookings, todaySchedule, serviceRevenue } =
    dashboard;

  const maxRevenue = Math.max(
    ...revenue7Days.map((item: any) => item.revenue),
    1,
  );

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <div className={styles.pageTitle}>
        <div>
          <h1>Dashboard</h1>
          <p>Tổng quan hoạt động của hệ thống đặt lịch Barber</p>
        </div>
      </div>

      {/* KPI */}
      <div className={styles.stats}>
        <StatCard
          icon="bi-calendar-check"
          title="Tổng số booking"
          value={stats.totalBookings}
          growth="Tất cả booking"
          type="blue"
        />

        <StatCard
          icon="bi-calendar-day"
          title="Booking hôm nay"
          value={stats.todayBookings}
          growth="Booking trong ngày"
          type="green"
        />

        <StatCard
          icon="bi-cash-stack"
          title="Doanh thu hôm nay"
          value={`${Number(stats.todayRevenue).toLocaleString("vi-VN")} đ`}
          growth="Doanh thu trong ngày"
          type="orange"
        />

        <StatCard
          icon="bi-people"
          title="Tổng khách hàng"
          value={stats.totalCustomers}
          growth="Khách hàng"
          type="purple"
        />
      </div>

      <div className={styles.mainGrid}>
        {/* LEFT */}
        <div className={styles.left}>
          {/* CHART */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3>Doanh thu 7 ngày gần nhất</h3>
              </div>

              <select>
                <option>Doanh thu</option>
              </select>
            </div>

            <div className={styles.chart}>
              <div className={styles.yAxis}>
                <span>{(maxRevenue / 1000000).toFixed(0)}M</span>

                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
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
                  {revenue7Days.map((item: any) => (
                    <div className={styles.barColumn} key={item.date}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${(item.revenue / maxRevenue) * 100}%`,
                        }}
                      />

                      <span>
                        {new Date(item.date).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* RECENT BOOKING */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Danh sách lịch đặt gần đây</h3>

              <button
                className={styles.viewAll}
                onClick={() => navigate("/admin/Booking")}
              >
                Xem tất cả
                <i className="bi bi-arrow-right" />
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
                  {recentBookings.map((booking: any) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>

                      <td>
                        <div className={styles.customer}>
                          <div className={styles.customerAvatar}>
                            {booking.customer?.charAt(0)}
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
                        <button
                          className={styles.detailButton}
                          onClick={() =>
                            navigate(`/admin/Booking/${booking.id}`)
                          }
                        >
                          <i className="bi bi-eye" />
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
          {/* TODAY */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>
                <i className="bi bi-calendar-week" /> &nbsp; Lịch hôm nay
              </h3>

              <button
                className={styles.viewAll}
                onClick={() => navigate("/admin/Booking")}
              >
                Xem tất cả →
              </button>
            </div>

            <div className={styles.todayList}>
              {todaySchedule.map((booking: any, index: number) => (
                <div
                  className={styles.todayItem}
                  key={`${booking.time}-${index}`}
                >
                  <div className={styles.time}>{booking.time}</div>

                  <div className={styles.timelineDot} />

                  <div className={styles.todayInfo}>
                    <strong>{booking.customer}</strong>

                    <span>{booking.service}</span>
                  </div>

                  <Status status={booking.status} />
                </div>
              ))}
            </div>
          </section>

          {/* QUICK STATS */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>
                <i className="bi bi-bar-chart-line" /> &nbsp; Thống kê nhanh
              </h3>
            </div>

            <div className={styles.quickStats}>
              <QuickStat
                icon="bi-scissors"
                title="Dịch vụ"
                value={stats.totalServices}
              />

              <QuickStat
                icon="bi-person-badge"
                title="Barber"
                value={stats.totalBarbers}
              />

              <QuickStat
                icon="bi-geo-alt"
                title="Chi nhánh"
                value={stats.totalBranches}
              />

              <QuickStat
                icon="bi-people"
                title="Khách hàng"
                value={stats.totalCustomers}
              />
            </div>
          </section>

          {/* SERVICE REVENUE */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Doanh thu theo dịch vụ</h3>
            </div>

            {serviceRevenue.map((item: any) => (
              <RevenueItem
                key={item.name}
                name={item.name}
                percent={item.percent}
                price={`${Number(item.revenue).toLocaleString("vi-VN")} đ`}
              />
            ))}
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
  value: string | number;
  growth: string;
  type: string;
}) {
  return (
    <div className={styles.statCard}>
      <div className={`${styles.statIcon} ${styles[type]}`}>
        <i className={`bi ${icon}`} />
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>

        <small>
          <i className="bi bi-arrow-up" /> {growth}
        </small>
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
  value: number;
}) {
  return (
    <div className={styles.quickStat}>
      <div>
        <i className={`bi ${icon}`} />
      </div>

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
  let text = status;
  let className = styles.waiting;

  switch (status) {
    case "CONFIRMED":
      text = "Đã xác nhận";
      className = styles.confirmed;
      break;

    case "COMPLETED":
      text = "Hoàn thành";
      className = styles.running;
      break;

    case "PENDING":
      text = "Chờ xử lý";
      className = styles.pending;
      break;

    case "CANCELLED":
      text = "Đã hủy";
      className = styles.waiting;
      break;
  }

  return <span className={`${styles.status} ${className}`}>{text}</span>;
}
