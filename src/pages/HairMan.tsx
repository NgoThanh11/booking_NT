import { Link } from "react-router-dom";
import styles from "../../src/assets/styles/HairMan.module.scss";

const services = [
   {
    title: "Cắt xả tạo kiểu",
    desc: "Cắt tạo kiểu, xả sạch tóc con\nCạo mặt khai sáng ngũ quan",
    image: "/images/haircut-1.jpg",
    duration: "30 Phút",
    price: "94.000 VNĐ",
    path: "/Booking",
  },
  {
    title: "Cạo râu",
    icon: "🪒",
    desc: "Cạo râu chuyên nghiệp, sạch sẽ và thư giãn.",
    path: "/services/shaving",
  },
  {
    title: "Uốn tóc",
    icon: "✨",
    desc: "Uốn tóc thời trang với nhiều kiểu phù hợp.",
    path: "/services/perm",
  },
  {
    title: "Nhuộm tóc",
    icon: "🎨",
    desc: "Màu nhuộm chất lượng, an toàn cho tóc.",
    path: "/services/color",
  },
  {
    title: "Chăm sóc tóc",
    icon: "💆",
    desc: "Dưỡng tóc, phục hồi và chăm sóc chuyên sâu.",
    path: "/services/care",
  },
  {
    title: "Combo VIP",
    icon: "👑",
    desc: "Trải nghiệm đầy đủ dịch vụ với mức giá ưu đãi.",
    path: "/services/vip",
  },
];

export default function HairMan() {
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

        <div className={styles.grid}>
  {services.map((item) => (
    <div className={styles.card} key={item.title}>
      <h3>{item.title}</h3>

      <p className={styles.desc}>
        {item.desc}
      </p>

      <div className={styles.imageBox}>
        <img
          src={item.image}
          alt={item.title}
        />
      </div>

      <div className={styles.footer}>
        <span className={styles.time}>
          {item.duration}
        </span>

        <Link
          to={item.path}
          className={styles.price}
        >
          Chỉ từ {item.price}
        </Link>
      </div>
    </div>
  ))}
</div>
      </div>
    </section>
  );
}
