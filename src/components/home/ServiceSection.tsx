import styles from "../../assets/styles/ServiceSection.module.scss";

const services = [
  {
    title: "Cắt tóc nam",
    icon: "💇",
    desc: "Cắt tóc theo nhiều phong cách hiện đại và cổ điển.",
  },
  {
    title: "Cạo râu",
    icon: "🪒",
    desc: "Cạo râu chuyên nghiệp, sạch sẽ và thư giãn.",
  },
  {
    title: "Uốn tóc",
    icon: "✨",
    desc: "Uốn tóc thời trang với nhiều kiểu phù hợp.",
  },
  {
    title: "Nhuộm tóc",
    icon: "🎨",
    desc: "Màu nhuộm chất lượng, an toàn cho tóc.",
  },
  {
    title: "Chăm sóc tóc",
    icon: "💆",
    desc: "Dưỡng tóc, phục hồi và chăm sóc chuyên sâu.",
  },
  {
    title: "Combo VIP",
    icon: "👑",
    desc: "Trải nghiệm đầy đủ dịch vụ với mức giá ưu đãi.",
  },
];

export default function ServiceSection() {
  return (
    <section className={styles.service}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2>Dịch vụ nổi bật</h2>
          <p>
            Lựa chọn dịch vụ phù hợp và đặt lịch nhanh chóng chỉ với vài thao tác.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((item) => (
            <div className={styles.card} key={item.title}>
              <div className={styles.icon}>{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

              <button>Xem chi tiết</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}