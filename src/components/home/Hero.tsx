import styles from "../../assets/styles/Hero.module.scss";
import HeroSlider from "../SliderShow/SliderShow";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>
            Smile BarberShop
          </span>

          <h1>
            Đặt lịch cắt tóc
            <br />
            nhanh chóng & tiện lợi
          </h1>

          <p>
            Đặt lịch với đội ngũ Barber chuyên nghiệp. Chọn dịch vụ,
            thời gian và thợ cắt tóc chỉ trong vài phút.
          </p>

          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>
              Đặt lịch ngay
            </button>

            <button className={styles.secondaryBtn}>
              Xem dịch vụ
            </button>
          </div>
        </div>

        <div className={styles.image}>
          <HeroSlider />
        </div>
      </div>
    </section>
  );
}