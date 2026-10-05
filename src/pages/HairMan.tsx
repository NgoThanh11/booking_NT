import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../src/assets/styles/HairMan.module.scss";
import { GetAllServices } from "../api/ServiceApi";

interface Service {
  id: number;
  name: string;
  url: string;
  description: string;
  price: number;
  durationMinutes: number;
  status: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export default function HairMan() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await GetAllServices();

        // Chỉ lấy dịch vụ đang hoạt động
        const activeServices = data?.data?.filter(
          (item: Service) => item.status === true,
        );
        console.log(1111, activeServices);
        
        setServices(activeServices);
      } catch (error) {
        console.error("Lỗi lấy danh sách dịch vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <section className={styles.service}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2>Cắt tóc Nam</h2>

          <p>
            Trải nghiệm dịch vụ cắt tóc nam chuyên nghiệp, từ tư vấn kiểu tóc
            đến tạo kiểu hoàn thiện, mang đến diện mạo lịch lãm và tự tin. Giá
            dịch vụ có thể khác nhau giữa các salon, vui lòng kiểm tra chi tiết
            khi đặt lịch.
          </p>
        </div>

        {loading ? (
          <div className={styles.loading}>Đang tải dịch vụ...</div>
        ) : services.length === 0 ? (
          <div className={styles.empty}>Hiện chưa có dịch vụ nào.</div>
        ) : (
          <div className={styles.grid}>
            {services.map((item) => (
              <div className={styles.card} key={item.id}>
                <h3>{item.name}</h3>

                <p className={styles.desc}>{item.description}</p>

                <div className={styles.imageBox}>
                  <img
                    src={`http://localhost:5021${item.url}`}
                    alt={item.name}
                    onError={(e) => {
                      const img = e.currentTarget;

                      if (!img.dataset.fallback) {
                        img.dataset.fallback = "true";
                        img.src = "/images/haircut-1.jpg";
                      }
                    }}
                  />
                </div>

                <div className={styles.footer}>
                  <span className={styles.time}>
                    {item.durationMinutes} Phút
                  </span>

                  <Link to="/Booking" className={styles.price}>
                    Chỉ từ {formatPrice(item.price)}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
